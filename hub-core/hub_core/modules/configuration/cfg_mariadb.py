"""Mariadb Configuration Module: contains general information about the database"""
from os.path import exists
from modules.configuration.cfg_abstract import AbstractConfig


class MariadbConfig(AbstractConfig):
    """Describe the database configuration"""
    _file_path = 'config/mariadb.json'
    user = ''
    pwd = ''
    host = ''
    port = ''
    name = ''

    """init method is defined in AbstractConfig: it calls 'populate' to load the parameters from json file"""

    def __str__(self):
        return f"{self.name}: usr '{self.user}', host '{self.host}'"

    def populate(self, config):
        """Populate the MariadbConfig object"""
        self.user = config.get('user', None)
        self.pwd = config.get('pwd', None)
        # verify that it is within a docker container
        host_var = 'host_dckr' if exists("/.dockerenv") else 'host'
        self.host = config.get(host_var, None)
        self.port = config.get('port', None)
        self.name = config.get('db_name', None)

    def update(self, new_config) -> tuple[bool, str]:
        """Update the MariadbConfig object"""
        res = True
        msg = "success"
        self.user = new_config.get('user', self.user)
        self.pwd = new_config.get('pwd', self.pwd)
        self.host = new_config.get('host', self.host)
        self.port = new_config.get('port', self.port)
        self.name = new_config.get('db_name', self.name)
        self._write_file()
        return res, msg

    def get_cfg(self):
        """Get cfg dict"""
        return {"user": self.user, "pwd": self.pwd, "host": self.host, "port": self.port,
                "db_name": self.name}

