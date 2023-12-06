"""MQTT Configuration Module: contains general information about the MQTT protocol"""
from modules.configuration.cfg_abstract import AbstractConfig
from os.path import exists


class MqttConfig(AbstractConfig):
    """Describe the MQTT configuration"""
    _file_path = 'config/mqtt.json'
    broker_ip = ''
    pwd = ''

    """init method is defined in AbstractConfig: it calls 'populate' to load the parameters from json file"""

    def __str__(self):
        return f"broker ip '{self.broker_ip}'"

    def populate(self, config):
        """Populate the MqttConfig object"""
        # questo è per individuare se si trova in un docker container o no
        host_var = 'broker_ip_dckr' if exists("/.dockerenv") else 'broker_ip'
        self.broker_ip = config.get(host_var, None)
        self.pwd = config.get('mqtt_client_pwd', None)

    def update(self, new_config) -> tuple[bool, str]:
        """Update the MqttConfig object"""
        res = True
        msg = "success"
        self.broker_ip = new_config.get('broker_ip', self.broker_ip)
        self.pwd = new_config.get('mqtt_client_pwd', self.pwd)
        # TODO: la modifica dei parametri di connessione è critica perchè in caso di errori non sarà più possibile
        #  riconnettersi tramite MQTT per modificarli. Come controllo aggiuntivo si potrebbe implementare un tentativo
        #  di connessione con i nuovi parametri e generare un errore in caso questi non funzionino
        self._write_file()
        return res, msg

    def get_cfg(self):
        """Get cfg dict"""
        return {"broker_ip": self.broker_ip, "mqtt_client_pwd": self.pwd}

