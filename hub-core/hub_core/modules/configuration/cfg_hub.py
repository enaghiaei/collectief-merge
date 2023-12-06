"""Hub Configuration Module: contains general information about the border router (serial number, model, ...)"""
from modules.configuration.cfg_abstract import AbstractConfig


class HubConfig(AbstractConfig):
    """Describe the hub configuration"""
    _file_path = 'config/hub_core.json'
    serial = ''
    model = ''
    version = ''
    firmware = ''
    firmware_min = ''

    """init method is defined in AbstractConfig: it calls 'populate' to load the parameters from json file"""

    @property
    def tech_code(self):
        """Tech Code: TODO"""
        separator = ''
        return "%s%s%s" % (self.model, separator, self.version)

    def __str__(self):
        return "%s %s %s" % (self.serial, self.tech_code, self.firmware)

    def populate(self, config: dict):
        """Populate the HubConfig object"""
        # {"FactorySN":"19XXXDEV","FirmwareVersion":"1.02.00","FirmwareMin":"1.02.00","LSICode":"ALP","LSISubCode":"001"}
        self.serial = config.get('FactorySN', None)
        self.model = config.get('LSICode', None)
        self.version = config.get('LSISubCode', None)
        self.firmware = config.get('FirmwareVersion', None)
        self.firmware_min = config.get('FirmwareMin', None)

    def update(self, new_config) -> tuple[bool, str]:
        """Update the HubConfig object"""
        res = True
        msg = "success"
        self.serial = new_config.get('FactorySN', self.serial)
        self.model = new_config.get('LSICode', self.model)
        self.version = new_config.get('LSISubCode', self.version)
        self.firmware = new_config.get('FirmwareVersion', self.firmware)
        self.firmware_min = new_config.get('FirmwareMin', self.firmware_min)
        self._write_file()
        # TODO: il metodo di update si potrebbe migliorare... ad esempio ritorno nel msg: i campi modificati, i campi
        #  che non sono stati trovati nella cfg (es: arriva il campo "FactorySN", viene segnalato che non esiste)
        return res, msg

    def get_cfg(self):
        """Get cfg dict"""
        return {"FactorySN": self.serial, "FirmwareVersion": self.firmware, "FirmwareMin": self.firmware_min,
                "LSICode": self.model, "LSISubCode": self.version}
