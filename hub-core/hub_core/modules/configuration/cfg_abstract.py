"""Abstract Configuration Module"""
import json
from abc import abstractmethod
from json import load
from logging import getLogger
from os.path import isfile, abspath
from typing import Dict

# This works only if "hub_core" folder contains a folder named "modules"
FILE_PATH = abspath(__file__)
PRJ_PATH = FILE_PATH[:FILE_PATH.find("modules")]


class ConfigManager:
    """Configuration Manager Class"""
    _config_list = []

    @staticmethod
    def add_cfg(cfg):
        """Add new configuration"""
        ConfigManager._config_list.append(cfg)

    @staticmethod
    def update_cfg(path: str, cfg: dict) -> tuple[Dict, str]:
        """Update an existent configuration"""
        resp = None
        cfg_obj = next((cfg for cfg in ConfigManager._config_list if cfg.get_path() == path), None)  # type: AbstractConfig
        if cfg_obj is None:
            msg = f"No cfg found with path '{path}'"
        else:
            resp, msg = cfg_obj.update(cfg)
        return resp, msg


class AbstractConfig(object):
    """Define an abstract configuration"""
    _file_path = 'undefined'

    def __init__(self):
        ConfigManager.add_cfg(self)
        self._open_file_and_populate()

    def __str__(self):
        return f"{__class__.__name__} object - file path: {self._file_path}"

    def get_path(self):
        """Get the configuration file path"""
        return self._file_path

    def _open_file_and_populate(self):
        """Open the cfg file and populate Config object"""
        path = PRJ_PATH + self._file_path
        if isfile(path):
            with open(path, 'r') as fp:
                config = load(fp)
                self.populate(config)
        else:
            getLogger().error(f"Not found file at path {path}")

    def _write_file(self):
        """Change the cfg file with the current configuration"""
        path = PRJ_PATH + self._file_path
        if isfile(path):
            with open(path, 'w') as fp:
                json.dump(self.get_cfg(), fp, indent=4)
        else:
            getLogger().error(f"Not found file at path {path}")

    @staticmethod
    def load_json_from_file(path):
        """Open a json file and return a dict object"""
        resp = None
        path = PRJ_PATH + path
        if isfile(path):
            with open(path, 'r') as fp:
                resp = json.loads(fp.read())
        else:
            getLogger().error(f"Not found file at path {path}")
        return resp

    @abstractmethod
    def populate(self, config):
        """Populate Config object. Not implemented in the abstract class, required in the derived class"""
        raise NotImplementedError

    @abstractmethod
    def update(self, new_config):
        """Update Config object. Not implemented in the abstract class, required in the derived class"""
        raise NotImplementedError

    @abstractmethod
    def get_cfg(self):
        """Get cfg dict. Not implemented in the abstract class, required in the derived class"""
        raise NotImplementedError
