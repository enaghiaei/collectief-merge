"""This module is an example of how an Entity driver should be implemented"""
import json
from http import HTTPStatus
import requests
from requests import ReadTimeout
from modules.database.measure import Measure
from modules.database.models import HubCoreMeasureData
from modules.database.entity_abstract import MeasureEntity, ControlEntity
from modules.mqtt.payload import HubCoreException, HubCoreError


class CustomEntity(MeasureEntity, ControlEntity):   # Choose from which classes CustomEntity should be derived
    """Entity driver class for "custom" devices"""
    # Example of additional class attributes
    _driver_param1 = 5
    _driver_param2 = "example"

    def __init__(self, *args, **kwargs):    # Optional
        super().__init__(*args, **kwargs)
        self.param1 = None
        self.param2 = None
        self._url = ""
        self.entity_init()

    def entity_init(self):
        """Entity initialization from cfg"""
        self.param1 = self.cfg.get("param1")
        self.param2 = self.cfg.get("param2")
        self._url = self.cfg.get("url")

    @staticmethod
    def cfg_is_valid(cfg: dict) -> bool:    # Optional # TODO rivedere
        """This method checks if the configuration provided is valid for the "Custom" entity"""
        resp = True
        # Example
        param1 = cfg.get("param1")
        param2 = cfg.get("param2")
        if param1 is not None and param2 is not None:
            if type(param1) is not int or param1 > 100:
                raise HubCoreException(HubCoreError.INV_PARAM, f"param1 invalid: {param1}")
            # if param2...
        else:
            # resp = False
            pass
        return resp

    """Measure Entity methods"""
    @staticmethod
    def meas_cfg_is_valid(meas_cfg: dict) -> bool:    # Optional # TODO rivedere
        """ This method checks if the configuration provided is valid for the "Custom" entity measures. """
        resp = True
        # Here you can add your custom check on measure configuration...
        return resp

    def read_measure(self, meas_obj: Measure) -> HubCoreMeasureData:    # Required
        """This method allows to read new value for the measure identified by 'tag'"""
        # Get measure object from entity list
        if meas_obj is not None:

            # Here you can add your custom code

            # This is a measure-related parameter
            test1 = meas_obj.additional_cfg.get("optional_param", 0)
            # This is an entity-related parameter
            test2 = self.cfg.get("entity_param1", 0)

            timestamp = "NULL"
            value = 0 * test1 * test2
            pass
        else:
            raise HubCoreException(HubCoreError.INV_PARAM, f"Measure object is not defined")
        return HubCoreMeasureData(meas_obj.id, timestamp, value)

    # def read_measure(self, meas_obj: Measure) -> HubCoreMeasureData:    # Required
    #     """This method allows to read new value for the measure identified by 'tag'"""
    #     value = timestamp = None
    #     # Get measure object from entity list
    #     if meas_obj is not None:
    #         headers = {
    #             "Authorization": f"Bearer {self.token}",
    #             "Content-Type": "application/json"
    #         }
    #         params = {"measure": meas_obj.tag}
    #         response = requests.request("GET", self._url, headers=headers, params=params)
    #         if response.status_code == HTTPStatus.OK:
    #             resp_json = json.loads(response.content)[0]
    #             value = resp_json.get("payload", {}).get(meas_obj.tag)
    #             timestamp = resp_json.get("timestamp")
    #         else:
    #             # Manage other HTTP codes..
    #             pass
    #     else:
    #         raise HubCoreException(HubCoreError.INV_PARAM, f"Measure object is not defined")
    #     return HubCoreMeasureData(meas_obj.id, timestamp, value)

    """ Control Entity methods """
    @staticmethod
    def ctrl_cfg_is_valid(ctrl_cfg: dict) -> bool:    # Optional # TODO rivedere
        """This method checks if the configuration provided is valid for the "Custom" entity controls"""
        resp = True
        # Here you can add your custom check on measure configuration...
        return resp

    def send_ent_cmd(self, drv_context):    # Required
        """This method send a command according to drv_context content"""
        # Here you can add your custom code
        message = "example"

        # Here you can add your custom code
        parameter = drv_context.get("param")
        if parameter < 100:
            raise HubCoreException(HubCoreError.GENERIC_ERROR, "parameter must be >= 100")

        return message

    # def send_ent_cmd(self, drv_context):    # Required
    #     """This method send a command according to drv_context content"""
    #     # Here you can add your custom code
    #     headers = {'Content-Type': 'application/json'}
    #     params = {"ch": drv_context["ch"], "value": drv_context["value"]}
    #     try:
    #         response = requests.request("POST", self._url, headers=headers, params=params, timeout=10)
    #     except ReadTimeout as timeout:
    #         raise HubCoreException(HubCoreError.NO_ANSW_ENT, timeout.response)
    #     if response.status_code == HTTPStatus.OK:
    #         message = response.text
    #     else:
    #         message = f'HTTP resp {response.status_code} - {response.text}'
    #         raise HubCoreException(HubCoreError.DRIVER_ERROR, message)
    #     return message

    @staticmethod
    def send_drv_cmd(drv_context):
        """This method sends a driver generic command"""
        resp = None

        # Here you can add you code

        return resp
