"""Entity Creator module"""
from logging import getLogger
from driver.a2a import A2AEntity
from driver.custom import CustomEntity
from driver.sensibo import SensiboEntity
from driver.sph_p import SphensorEntity
from driver.httptest import TestHttpEntity
from driver.sginterop import SGInteropEntity
from modules.database.models import HubCoreEntity
import traceback

class EntityCreator:
    """Entity Creator class"""
    @staticmethod
    def get_class_from_driver(driver):
        """Get the entity driver class from driver"""
        if driver == "sph_p":
            entity_class = SphensorEntity
        elif driver == "httptest":
            entity_class = TestHttpEntity
        elif driver == "a2a":
            entity_class = A2AEntity
        elif driver == "sginterop":
            entity_class = SGInteropEntity
        elif driver == "sensibo":
            entity_class = SensiboEntity
        elif driver == "custom":
            entity_class = CustomEntity
        else:
            entity_class = None
            getLogger().warning(f"Driver \"{driver}\" not found")  # TODO: generare un warning nella response?
        return entity_class

    @staticmethod
    def create(ent: HubCoreEntity):
        """Create a new entity object"""
        entity = None
        if ent.driver == "sph_p":
            creator = SphensorEntity
        elif ent.driver == "httptest":
            creator = TestHttpEntity
        elif ent.driver == "a2a":
            creator = A2AEntity
        elif ent.driver == "sginterop":
            creator = SGInteropEntity
        elif ent.driver == "custom":
            creator = CustomEntity
        elif ent.driver == "sensibo":
            creator = SensiboEntity
        else:
            creator = None
            getLogger().warning(f"Driver \"{ent.driver}\" not found")
        if creator:
            try:
                entity = creator(ent.id, ent.driver, ent.field_id, ent.cfg, ent.name, ent.zone_id, ent.enabled,
                                 db_obj=ent)
            except BaseException as exc:

                getLogger().error(f"Entity Creator failed with error '{type(exc).__name__}: {exc.args[0]}')")
                getLogger().error(f"Traceback\n{traceback.format_exc()}")
                # TODO: rendere gestibile esternamente questo errore... dovrei poter manadare un messaggio mqtt
        return entity

