"""Collectief Configuration Module: contains information about the Collectief interface"""
from modules.configuration.cfg_abstract import AbstractConfig


class CollectiefConfig(AbstractConfig):
    """Collectief Configuration Class"""
    _file_path = 'config/collectief.json'
    send_saved_msg = None
    send_msg_topic = None
    entities = {}
    polling_scheduler = {}
    thread_pool = {}  # TODO: cfg ad hoc per ThrPool?
    mqtt = {}

    """init method is defined in AbstractConfig: it calls 'populate' to load the parameters from json file"""

    def __str__(self):
        return str(self.get_cfg())

    def populate(self, config):
        """Populate the CollectiefConfig object"""
        self.send_saved_msg = config.get('mqtt', {}).get("send_saved_msg", False)
        self.send_msg_topic = config.get('mqtt', {}).get("send_msg_topic")
        # self.entities = config.get('entities', None)
        # self.polling_scheduler = config.get('polling_scheduler', None)
        # self.thread_pool = config.get('thread_pool', None)
        # self.mqtt = config.get('mqtt', None)

    def update(self, new_config) -> tuple[bool, str]:
        """Update the CollectiefConfig object"""
        res = True
        msg = "success"
        # TODO: da rivedere comportamento con valori nested
        self.entities = new_config.get('entities', self.entities)
        self.polling_scheduler = new_config.get('polling_scheduler', self.polling_scheduler)
        self.thread_pool = new_config.get('thread_pool', self.thread_pool)
        self.mqtt = new_config.get('mqtt', self.mqtt)
        self._write_file()
        return res, msg

    def get_cfg(self):
        """Get cfg dict"""
        # TODO: da rivedere comportamento con valori nested
        return {"entities": self.entities, "polling_scheduler": self.polling_scheduler,
                "thread_pool": self.thread_pool, "mqtt": self.mqtt}

