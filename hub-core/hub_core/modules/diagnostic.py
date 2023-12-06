"""This module manages the diagnostic for Hub Core. It gathers information and saves it in the database.
Refer to BRiG technical specification for more details"""
import json
import time
from datetime import datetime, timezone, timedelta
from logging import getLogger
from threading import Thread, Condition
from sqlalchemy.exc import SQLAlchemyError
from modules.database.database import Database
from modules.database.entity_abstract import EntityStatus
from modules.database.models import HubCoreSystemDiagno, HubCoreMeasureData, HubCoreEntitiesDiagno
from modules.mqtt.brig_mqtt import MqttClient
from modules.mqtt.payload import HubCoreException, HubCoreError
from modules.registry import Registry

diagnostic_event_topic = 'collectief/%s/brig/brig/diag/event'


class Diagnostic:
    """Manage Hub Core Diagnostic"""
    _instance = None

    def __init__(self):
        if Diagnostic._instance is not None:
            raise Exception("Registry object already created")
        Diagnostic._instance = self
        self._thread = Thread(target=self.diag_run, name="Diagnostic")
        self._thread.daemon = True
        self._wait_condition = Condition()
        self.start_dt = datetime.now(timezone.utc)
        self._diag_system_flag = self._diag_entities_flag = False
        self._last_system_refresh = self._last_entities_refresh = int(time.time())
        self._diag_system_period = 60*60*2  # TEST (in secondi)
        self._diag_system_expiry = 60*96  # TEST (in minuti)
        self._diag_entities_period = 60*60  # TEST (in secondi)
        self._diag_entities_expiry = 60*48  # TEST (in minuti)
        self._force_diag_run = False
        self._db = None  # type: None | Database
        self._mqtt = None  # type: None | MqttClient
        self._registry = None  # type: None | Registry
        self.system_diag = None  # type: None | HubCoreSystemDiagno
        self.entities_diag = []  # type: list[HubCoreEntitiesDiagno]
        self._unregistered_entities = []
        self._sys_errors = 0

    @staticmethod
    def get_instance() -> "Diagnostic":
        """Get the singleton object"""
        return Diagnostic._instance

    def start(self):
        """Start Diagnostic thread"""
        self._db = Database.get_instance()
        self._mqtt = MqttClient.get_instance()
        self._registry = Registry.get_instance()
        if self._db is None:
            raise Exception("Found empty db object")
        if self._registry is None:
            raise Exception("Found empty registry object")
        self._thread.start()

    def diag_run(self):
        """Diagnostic Thread handler"""
        while True:
            with self._wait_condition:
                if self._wait_condition.wait_for(self.ready_to_update, timeout=30):  # timeout in seconds TODO: cfg
                    try:
                        getLogger().debug("Refreshing diagnostic")
                        if self._db.active:
                            self.refresh()
                            self.save_into_db()
                            self.clean_old()
                        else:
                            self.send_diag_event("error", f"Diagnostic failed: database is not active")
                            self._diag_system_flag = self._diag_entities_flag = False
                    except BaseException as exc:
                        self.send_diag_event("error", f"Error in Diagnostic thread: {exc.args}")
                        time.sleep(30)

    def refresh(self):
        """Refresh Diagnostic values"""
        db_size = self._db.get_db_size()
        data_count = self._db.get_table_row_count(HubCoreMeasureData.__tablename__)
        with self._registry.entity_list_lock:
            en_list = self._registry.entity_list
            unreach_count = lost_count = enabled_count = 0
            self.entities_diag.clear()
            current_dt = datetime.now(timezone.utc)
            for ent in en_list:
                # System Diagnostic
                if ent.enabled:
                    enabled_count += 1
                if ent.status == EntityStatus.UNREACHABLE or ent.status == EntityStatus.MISSING:
                    unreach_count += 1
                elif ent.status == EntityStatus.LOST or ent.status == EntityStatus.DEAD:
                    lost_count += 1
                # Entities Diagnostic
                meas_cnt = ent.meas_count if ent.has_measures else None
                ent_status = ent.status.value if ent.enabled else EntityStatus.DISABLED.value  # TODO: rivedere gestione stati
                self.entities_diag.append(HubCoreEntitiesDiagno(current_dt, self.start_dt, ent.buid, ent.unsol_msg,
                                                                meas_cnt, ent.req_msg, ent.resp_msg,
                                                                ent_status, ent.errors))

            self.system_diag = HubCoreSystemDiagno(current_dt, self.start_dt, db_size, data_count, len(en_list),
                                                   enabled_count, unreach_count, lost_count,
                                                   len(self._unregistered_entities), self._sys_errors)

    def save_into_db(self):
        """Save Diagnostic context into database"""
        session = self._db.get_session()
        if self._diag_system_flag:
            session.add(self.system_diag)
            self._diag_system_flag = False
        if self._diag_entities_flag:
            session.add_all(self.entities_diag)
            self._diag_entities_flag = False
        try:
            session.commit()
        except SQLAlchemyError as err:
            session.rollback()
            getLogger().error(err.args)
        session.close()

    def clean_old(self):
        """Delete from database all the record older than the expiry time"""
        session = self._db.get_session()
        system_expiry_date = datetime.now(timezone.utc) - timedelta(minutes=self._diag_system_expiry)
        entities_expiry_date = datetime.now(timezone.utc) - timedelta(minutes=self._diag_entities_expiry)
        session.query(HubCoreSystemDiagno).filter(HubCoreSystemDiagno.dt < system_expiry_date).delete()
        session.query(HubCoreEntitiesDiagno).filter(HubCoreEntitiesDiagno.dt < entities_expiry_date).delete()
        try:
            session.commit()
        except SQLAlchemyError as err:
            session.rollback()
            getLogger().error(err.args)
        session.close()

    def ready_to_update(self):
        """Check if diagnostic needs to be updated"""
        # check for system diagnostic refresh
        if (int(time.time()) - self._last_system_refresh) >= self._diag_system_period:
            self._diag_system_flag = True
            self._last_system_refresh = int(time.time())
        # check for entities diagnostic refresh
        if (int(time.time()) - self._last_entities_refresh) >= self._diag_entities_period:
            self._diag_entities_flag = True
            self._last_entities_refresh = int(time.time())
        # check for forced diagnostic refresh
        if self._force_diag_run:
            self._force_diag_run = False
            self._diag_system_flag = self._diag_entities_flag = True
            self._last_system_refresh = self._last_entities_refresh = int(time.time())
        return self._diag_system_flag | self._diag_entities_flag

    def force_diag_run(self):
        """Force Diagnostic context refresh and saving"""
        self._force_diag_run = True
        with self._wait_condition:
            self._wait_condition.notify_all()

    def get_current(self, out_format):
        """Return the current Diagnostic data in the specified format"""
        if self.entities_diag is None or self.system_diag is None:
            raise HubCoreException(HubCoreError.NOT_PERM, "Diagnostic context is still empty. Wait next update or send "
                                                          "a 'force' command")
        if out_format == "json":
            return {"system": self.system_diag.to_dict(), "entities": [ent.to_dict() for ent in self.entities_diag]}
        else:
            raise NotImplementedError(f"{format} Diagnostic format not implemented")

    def send_diag_event(self, severity, msg):
        """Send a Diagnostic message over MQTT"""
        getLogger().info(msg)  # TODO: enum severity
        payload = {"severity": severity, "ts": datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S+00:00'),
                   "msg": msg}
        self._mqtt.publish(diagnostic_event_topic % self._mqtt.name, payload)

    def send_diag_sys_error(self, msg):
        """Send a SysError message over MQTT"""
        self._sys_errors += 1
        getLogger().error(msg)
        payload = {"severity": "error", "ts": datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S+00:00'),
                   "msg": msg}
        self._mqtt.publish(diagnostic_event_topic % self._mqtt.name, payload)

    def add_unregistered_entity(self, field_id, drv) -> bool:
        """Add an entity to the unregistered entity list. Return True if the entity has been added"""
        added = False
        if all(ent_drv[0] != field_id and ent_drv[1] != drv for ent_drv in self._unregistered_entities):
            self._unregistered_entities.append((field_id, drv))
            added = True
        return added

    def remove_from_unregistered(self, ent_tuples):
        """Remove entities found in unregistered entity list. Return how many entities have been removed"""
        removed = 0
        for ent_tuple in ent_tuples:
            if any(ent_drv[0] == ent_tuple[0] and ent_drv[1] == ent_tuple[1] for ent_drv in self._unregistered_entities):
                self._unregistered_entities.remove(ent_tuple)
                removed += 1
        return removed

