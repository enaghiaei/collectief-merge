"""Hub Core Registry module: contains all the data structures needed to manage entities saved into database"""
from datetime import datetime, timezone
from logging import getLogger
from threading import Lock
from sqlalchemy import select
from sqlalchemy.sql import text
from sqlalchemy.engine import CursorResult, Result
from modules.database.database import Database
from modules.database.measure import Measure
from modules.database.models import HubCoreEntity, HubCoreEntityDataGroup, HubCoreMeasure, \
    HubCoreMeasureData
from modules.database.entity_abstract import GenericEntity
from modules.database.entity_creator import EntityCreator
from modules.mqtt.payload import HubCoreException, HubCoreError


# def check_db_conn_decorator(function):  # TODO -> serve?
#     def wrapper(*args):
#         registry = args[0]  # type: Registry
#         if not registry.active:
#             raise HubCoreException(HubCoreError.DB_ERROR, "database is not connected")
#         else:
#             return function(*args)
#     return wrapper


class Registry:
    """This class manages the Hub Core Registry"""
    _instance = None

    def __init__(self):
        if Registry._instance is not None:
            raise Exception("Registry object already created")
        Registry._instance = self
        self.db = None
        self.entity_list = []
        self.entity_list_lock = Lock()

    @staticmethod
    def get_instance() -> "Registry":
        """Get the Registry Singleton instance"""
        return Registry._instance

    def start(self):
        """Poulate entity list"""
        self.db = Database.get_instance()
        self.entity_list = self.create_entities()  # Create cached entity list
        getLogger().info(f"Registry: found {len(self.entity_list)} registered entities into db")

    def get_entity(self, driver, field_id):
        """Get the first entity by driver and field_id from the cached list"""
        with self.entity_list_lock:
            return next((e for e in self.entity_list if e.field_id == field_id and e.driver == driver), None)

    def get_polling_entities(self):
        """Get from the cached list all the entities with at least one polling measure configured"""
        polling_entities = []
        with self.entity_list_lock:
            for entity in self.entity_list:
                if entity.use_polling:
                    for meas in entity.measures:  # type: Measure
                        if meas.additional_cfg is not None and meas.additional_cfg.get("polling") is True:
                            polling_entities.append(entity)
                            break
        return polling_entities

    def msg_handler(self, command, params):
        """Manages the MQTT messages related to registry"""
        alerts = {}
        entities = []
        try:
            if command == "add":
                entity = self.registry_add(params)
                resp_body = {"buid": entity.buid}
                if entity.has_measures and entity.use_polling:
                    alerts["update_polling"] = True
                alerts["added"] = True
                entities = [entity]
            elif command == "remove":
                entities = self.registry_remove(params)
                resp_body = {"buid": [ent.buid for ent in entities]}
                if [ent for ent in entities if ent.use_polling]:
                    alerts["update_polling"] = True
                alerts["removed"] = True
            elif command == "get":
                entities = self.registry_get(params)
                ent_dicts = [{"buid": e.buid, "driver": e.driver, "field_id": e.field_id, "name": e.name,
                              "zone_id": e.zone_id, "cfg": e.cfg, "enabled": e.enabled} for e in entities]
                if len(ent_dicts) == 1:
                    ent_dicts = ent_dicts[0]
                resp_body = {"params": ent_dicts}
            elif command == "update":
                entity = self.registry_update(params)
                resp_body = {"buid": entity.buid}
                if entity.use_polling:
                    alerts["update_polling"] = True
                alerts["updated"] = True
                entities = [entity]
            elif command == "list":
                buids = self.registry_list(params)
                resp_body = {"buids": buids}
            else:
                raise HubCoreException(HubCoreError.INV_PARAM, f"Command {command} not recognized")
        except KeyError as err:
            getLogger().debug(f'Registry message handler fail {err}')
            raise HubCoreException(HubCoreError.INV_PARAM, f"{err} parameter not specified")
        return resp_body, entities, alerts

    # @check_db_conn_decorator
    def registry_add(self, params):
        """Add a new entity to Hub Core database. If the entity already exists, parameters are not valid ot other errors
         occur, a HubCoreException is raised"""
        driver = params.get("driver")
        field_id = params.get("field_id")
        cfg = params.get("cfg")
        if field_id is None or driver is None:
            raise HubCoreException(HubCoreError.INV_PARAM, f"Missing field_id and/or driver in payload params")
        session = self.db.get_session()  # create SQL Alchemy session
        # Save entity into db
        sql_entity = HubCoreEntity(driver, field_id, cfg, params.get("zone_id"), params.get("name"))
        entity = EntityCreator.create(sql_entity)  # type: GenericEntity
        if entity is None:
            raise HubCoreException(HubCoreError.INV_PARAM, f"Failed creating entity with these params: {params}")
        # Check configuration
        if cfg is None or entity.cfg_is_valid(cfg) is False:  # TODO -> testare cfg check
            raise HubCoreException(HubCoreError.INV_PARAM, f"Invalid or missing cfg in payload")
        if sql_entity.save(session) is False:
            raise HubCoreException(HubCoreError.DB_ERROR, f"New entity add failed")  # TODO: testare
        entity.buid = sql_entity.id
        getLogger().info(f"Saved new entity with buid {entity.buid}, field_id {entity.field_id} and driver"
                          f" {entity.driver}")
        # Add a record to EDG table
        edg = HubCoreEntityDataGroup(entity_id=entity.buid, start_dt=datetime.now(timezone.utc))
        if edg.save(session) is False:
            raise HubCoreException(HubCoreError.DB_ERROR, f"New edg add failed")  # TODO: testare
        getLogger().info(f'Saved new edg with id {edg.id}')
        entity.edg = edg
        if entity.has_measures:
            # Add measures for the new EDG
            entity.measures = self.create_new_measures(edg.id, cfg, session)
            getLogger().info(f"Saved {len(entity.measures)} new measures")
        if entity.has_controls:
            pass  # entity.edg.controls = [] # TODO
        with self.entity_list_lock:
            self.entity_list.append(entity)
        session.close()
        return entity

    # @check_db_conn_decorator
    def registry_remove(self, params):
        """Remove one or more entities from db. The entities are identified by the "buid" key in params.
        If none of the provided buids is found into db, it raises a HubCoreException"""
        buids = params.get("buid")
        if type(buids) is not list:
            buids = [buids]
        with self.entity_list_lock:
            found_entities = [ent for ent in self.entity_list if str(ent.buid) in buids]
            if len(found_entities) <= 0:
                raise HubCoreException(HubCoreError.NOT_FOUND, f"No entity found with id {params['buid']}")
            for ent in found_entities:  # type: GenericEntity
                session = self.db.get_session()  # create SQL Alchemy session
                session.merge(ent.db_obj)
                if ent.db_obj.remove(session) is False:
                    raise HubCoreException(HubCoreError.DB_ERROR, f"Entity remove failed")  # TODO: testare
                session.close()
                self.entity_list.remove(ent)
                ent.enabled = 0  # Useful for who is using this entity (e.g: thrpool)
        getLogger().info(f"Removed entity with buid '{buids}' from db")
        return found_entities

    # @check_db_conn_decorator
    def registry_get(self, params):
        """Get one or more entities from database. The entities are identified by the "buid" key in params.
         If none of the provided buids is found into db, it raises a HubCoreException"""
        buids = params.get("buid")
        if type(buids) is not list:
            buids = [buids]
        with self.entity_list_lock:
            found_entities = [ent for ent in self.entity_list if str(ent.buid) in buids]
        getLogger().debug(f"Requested entity with id {buids}, found {len(found_entities)}")
        if len(found_entities) <= 0:
            raise HubCoreException(HubCoreError.NOT_FOUND, f"No entity found with id {params['buid']}")
        return found_entities

    # @check_db_conn_decorator
    def registry_update(self, params):
        """Update an entity from database. The entity is identified by the "buid" key in params. If the
         provided buid is not found into db, it raises a HubCoreException. This method does not support multiple buids.
          In case more buids are provided, only the first will be considered"""
        buid = params.get("buid")
        if type(buid) is list:
            buid = buid[0]
            # TODO: da buttare dentro il messaggio di risposta il warning
            getLogger().warning("Registry Update not suitable for multiple ids. Only the first buid in considered")
        with self.entity_list_lock:
            session = self.db.get_session()  # create SQL Alchemy session
            entity = next((ent for ent in self.entity_list if str(ent.buid) == buid), None)  # type: GenericEntity
            if entity is None:
                raise HubCoreException(HubCoreError.NOT_FOUND, f"No entity found with id {params['buid']}")
            # Check for driver/field_id changes
            driver = params.get("driver")
            field_id = params.get("field_id")
            driver_changed = driver and driver != entity.driver
            field_id_changed = field_id and field_id != entity.field_id
            if driver_changed or field_id_changed:
                # Check if new values are unique in db  # TODO: togliere questo check
                stmt = select(HubCoreEntity).where(HubCoreEntity.field_id == field_id, HubCoreEntity.driver == driver)
                found_entities = list(session.execute(stmt).scalars())
                if len(found_entities) > 0:
                    raise HubCoreException(HubCoreError.NOT_UNIQUE, f"New field_id/driver values not unique into db"
                                                                    f" ('{field_id}','{driver}')")
            # Discard "enbaled" param if present
            if "enabled" in params:
                # TODO: da buttare nella response il messaggio di warning
                getLogger().warning("\"enabled\" column cannot be modified using the update registry command."
                                    " \"cmd\" class must be used")
                params.pop("enabled")
            # Check cfg
            # TODO: rivedere i criteri per cui edg va ricreato... es: no se modifico solo polling period
            new_edg_required = True
            if params.get("cfg") is None or entity.cfg == params["cfg"] or entity.cfg_is_valid(params["cfg"]) is False:
                new_edg_required = False
                params.pop("cfg", None)
            entity.update(params)
            session.merge(entity.db_obj)
            if entity.db_obj.update(session) is False:
                raise HubCoreException(HubCoreError.DB_ERROR, f"Entity update failed")  # TODO: testare
            if new_edg_required:
                edg = HubCoreEntityDataGroup(entity.buid, datetime.now(timezone.utc))
                if edg.save(session) is False:
                    raise HubCoreException(HubCoreError.DB_ERROR, f"New edg add failed")  # TODO: testare
                entity.edg = edg
                if entity.has_measures:
                    entity.measures = self.create_new_measures(edg.id, params["cfg"], session)
                    getLogger().info(f"Saved {len(entity.measures)} new measures")
                # id entity.has_controls: # TODO
        getLogger().info(f"Updated entity with id '{params['buid']}'")
        session.close()
        return entity

    # @check_db_conn_decorator
    def registry_enable(self, buids, status: int):
        """Enables/disables entities both in database and in registry cache"""
        resp_body = {"buid": []}
        if type(buids) is not list:
            buids = [buids]
        for buid in buids:
            with self.entity_list_lock:
                entity = next((e for e in self.entity_list if str(e.buid) == buid), None)  # type: GenericEntity
                if entity:
                    resp_body["buid"].append(buid)
                    entity.enabled = status
                    session = self.db.get_session()  # create SQL Alchemy session
                    session.merge(entity.db_obj)
                    if entity.db_obj.update(session) is False:
                        raise HubCoreException(HubCoreError.DB_ERROR, f"Entity enable/disable failed")  # TODO: testare
                    else:
                        status_str = "enabled" if status == 1 else "disabled"
                        getLogger().info(f"Entity {status_str} ({str(entity)})")
                    session.close()
                else:
                    getLogger().warning(f"No entity found with  buid {buid}")  # TODO... si potrebbe aggiungere un msg alla resp
        return resp_body
        # TODO -> bloccare il task polling quando disabilito

    # @check_db_conn_decorator
    def registry_list(self, params):  # TODO -> testare filtro
        """Return a list of buids according to list_filter parameter. If list_filter is None, empty or
        equal to "*", all the saved buid are sent back. Otherwise, list_filter is used as WHERE condition in the
        SELECT query to database"""
        stmt = f"SELECT id FROM {HubCoreEntity.__tablename__}"
        filter_param = params.get("filter")
        if filter_param and filter_param != "*":
            stmt += "WHERE " + filter_param
        session = self.db.get_session()  # create SQL Alchemy session
        found_buids = session.execute(text(stmt))  # type: Result
        session.close()
        buids = []
        for buid in found_buids.scalars():
            buids.append(buid)
        if len(buids) <= 0:
            raise HubCoreException(HubCoreError.NOT_FOUND, f"No entity found using filter {filter_param}")
        getLogger().debug(f'Requested entity list with filter "{filter_param}": {len(buids)} elements')
        return buids

    # @check_db_conn_decorator
    def create_entities(self):
        """Read all records from entities_table and returns a list of Entity objects, one for each record found.
        If no entity is found, an empty list is returned"""
        # query = "SELECT e.id,e.driver,e.field_id,e.name,e.zone_id,e.cfg,e.enabled,edg.id,edg.start_dt "
        # query += f"FROM {self._entity_table.name} e "
        # query += f"INNER JOIN ( SELECT entity_id, MAX(start_dt) AS start_dt FROM {self._edg_table.name}" \
        #          f" GROUP BY entity_id) m ON e.id = m.entity_id "
        # query += f"INNER JOIN {self._edg_table.name} edg " \
        #          f"ON edg.entity_id = m.entity_id AND edg.start_dt = m.start_dt;"
        entities = []
        stmt = select(HubCoreEntity)
        session = self.db.get_session()  # create SQL Alchemy session
        found_entities = session.execute(stmt)  # get all entities from db
        for sql_ent in found_entities.scalars():
            new_ent = EntityCreator.create(sql_ent)
            if new_ent is None:
                continue
            # get all EDG related to a specific entity
            stmt = select(HubCoreEntityDataGroup).where(HubCoreEntityDataGroup.entity_id == str(sql_ent.id))
            found_edg = list(session.execute(stmt).scalars())
            sql_edg = max(found_edg, key=lambda x: x.start_dt, default=None)
            if sql_edg is not None:
                new_ent.edg = sql_edg
                # get all the measures related to a specific EDG
                stmt = select(HubCoreMeasure).where(HubCoreMeasure.edg_id == str(sql_edg.id))
                found_meas = session.execute(stmt)
                measures = []
                for sql_meas in found_meas.scalars():
                    meas = Measure.create_from_sql_obj(sql_meas)
                    last_data = session.query(HubCoreMeasureData).filter(HubCoreMeasureData.measure_id == meas.id)\
                        .order_by(HubCoreMeasureData.dt.desc()).first()
                    if last_data:
                        meas.last_dt = last_data.dt
                    measures.append(meas)
                new_ent.measures = measures
            entities.append(new_ent)
        session.close()
        return entities

    def save_new_measure_data(self, measure: HubCoreMeasureData):
        """Save MeasureData into db"""
        session = self.db.get_session()  # create SQL Alchemy session
        if measure.save(session) is False:
            raise HubCoreException(HubCoreError.DB_ERROR, f"New measure data save failed")  # TODO: testare
        session.close()

    def create_new_measures(self, edg_id, cfg, session):
        """Create new Measure object parsing cfg"""
        measures = []
        measures_cfg = cfg.get("measures")
        if measures_cfg:
            if type(measures_cfg) is not list:
                msg = f"'measures' param must be a list. Cfg: {cfg}"
                getLogger().error(msg)
                raise Exception(msg)
            for measure in measures_cfg:
                unit = measure.get("unit")
                decimals = measure.get("decimals")
                name = measure.get("name")
                tag = measure.get("tag")
                sql_meas = HubCoreMeasure(edg_id=edg_id, tag=tag, name=name, unmis=unit, decimals=decimals)
                if sql_meas.save(session) is False:
                    raise HubCoreException(HubCoreError.DB_ERROR, f"New measure add failed")  # TODO: testare
                meas = Measure(sql_meas.id, edg_id, name, unit, decimals, tag)
                meas.sql_obj = sql_meas
                measures.append(meas)
        else:
            getLogger().warning(f"No measures provided into cfg: {cfg}")  # TODO: non viene bypassato dai controlli prima?
        return measures
