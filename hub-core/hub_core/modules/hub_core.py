"""This module manages Hub Core and its functions.
Hub Core is responsible to send and receive MQTT messages using Collectief topics.
Its main tasks are:
    - read and elaborate data sent using the old "sphensor" topic and send them using the new "collectief"
    - manage commands received from other MQTT clients"""
from logging import getLogger
from sqlalchemy.exc import OperationalError
from modules.collectief_interface import CollectiefItf
from modules.configuration.cfg_hub import HubConfig
from modules.database.database import Database
from modules.diagnostic import Diagnostic
from modules.mqtt.brig_mqtt import MqttClient
from modules.registry import Registry
from modules.sphensor_interface import SphensorItf


class HubCore:
    """Hub Core is the central unit. It manages the external requests directed to other entities (es: sphensor gateway,
     external devices, etc...)"""
    def __init__(self):
        self._hub_cfg = HubConfig()
        self._serial = self._hub_cfg.serial
        self._active = False
        self._mqtt = MqttClient(self._serial)
        self._database = Database()
        self._registry = Registry()
        self._diagnostic = Diagnostic()
        self._collectief_itf = CollectiefItf()
        self._sph_itf = SphensorItf()

    def activate(self):
        """Activate the Hub Core"""
        getLogger().debug(f"Activating Hub Core (serial: {self._serial})")
        self._active = True
        getLogger().debug("Connecting to MQTT broker")
        self._mqtt.connect()
        self._diagnostic.start()
        try:
            self._database.connect()
        except OperationalError as exc:
            Diagnostic.get_instance().send_diag_event("error", f"Database connection failed: {exc.args}")
        # TODO: occorre aggiungere i controlli dello stato del db per qualsiasi comando che lo utilizzi (decorator?)
        if self._database.active:
            self._registry.start()
        self._collectief_itf.activate()
        self._sph_itf.activate()
        # self.check_time_at_startup()
        # getLogger().debug("Connecting to MQTT broker")
        # self._mqtt_client.connect()
        # new_thread(self.time_checker)
        # new_thread(self.hub_alive_handler)

    def deactivate(self, message=None):
        """Deactivate the Hub Core"""
        self._active = False
        msg = "Deactivating Hub Core"
        if message:
            msg = f"{msg} - {message}"
        getLogger().debug(msg)
        self._mqtt.disconnect(message)
        self._database.disconnect()
