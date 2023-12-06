from datetime import datetime, timezone, timedelta

import pytz
import requests, json, sys, os
import paho.mqtt.client as mqtt
import requests, json
from http import HTTPStatus
from requests import ReadTimeout, ConnectTimeout

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from modules.database.measure import Measure
from modules.configuration.cfg_abstract import AbstractConfig
from modules.database.models import HubCoreMeasureData
from modules.database.entity_abstract import MeasureEntity, ControlEntity
from modules.mqtt.payload import HubCoreException, HubCoreError
import time
from jsonschema import validate
from jsonschema.exceptions import ValidationError


# credit Omer Enbar
class SensiboDriver:
    """
    I wrap this entity arount this class for any request
    wrappo l'entità attorno a questa classe per qualsiasi richiesta
    """
    _server = None
    _api_key = None
    _timeout = 10
    json_cfg = AbstractConfig.load_json_from_file('driver/sensibo.json')
    if json_cfg:
        _server = json_cfg.get("api_url")
        _api_key = json_cfg.get("api_key")
        del json_cfg

    @staticmethod
    def _get(path, ** params):
        params['apiKey'] = SensiboDriver._api_key
        response = requests.get(SensiboDriver._server + path, params=params, timeout=SensiboDriver._timeout)
        response.raise_for_status()
        return response.json()

    @staticmethod
    def _patch(path, data, ** params):
        params['apiKey'] = SensiboDriver._api_key
        response = requests.patch(SensiboDriver._server + path, params=params, data=data, timeout=SensiboDriver._timeout)
        response.raise_for_status()
        return response.json()

    @staticmethod
    def _post(path, data, **params):
        params['apiKey'] = SensiboDriver._api_key
        response = requests.post(SensiboDriver._server + path, params=params, data=data,
                                 headers={'Content-Type': 'application/json'}, timeout=SensiboDriver._timeout)
        response.raise_for_status()
        return response.json()

    @staticmethod
    def devices():
        """
        get list of devices connected
        :return: dictionary of the dataset
        """
        result = SensiboDriver._get("/users/me/pods", fields="id,room")
        return {x['room']['name']: x['id'] for x in result['result']}

    @staticmethod
    def pod_info(podUid):
        """
        :param podUid: get the id of the pod
        :return: return the device information
        """
        result = SensiboDriver._get(f"/pods/{podUid}")
        return result['result']

    @staticmethod
    def pod_measurement(podUid):
        """
        :param podUid: get the id of the pod
        :return: return the result of the measurements
        """
        result = SensiboDriver._get(f"/pods/{podUid}/measurements")
        return result['result'][0]

    @staticmethod
    def pod_ac_state(podUid):
        """
        :param podUid: get the id of the pod
        :return: state of the ac unit
        """
        result = SensiboDriver._get(f"/pods/{podUid}/acStates", limit=1, fields="acState")
        return result['result'][0]['acState']

    @staticmethod
    def pod_post_ac_state(podUid, newAcState):
        """
        :param podUid: id of the pod
        :param newAcState: new ac state
        """
        return SensiboDriver._post(f"/pods/{podUid}/acStates", data=json.dumps(newAcState))

    @staticmethod
    def pod_change_ac_state(podUid, currentAcState, propertyToChange, newValue):
        """
        :param podUid: id of the pod
        :param currentAcState: current ac state
        :param propertyToChange: property to be changed
        :param newValue: new value to set for the property
        """
        SensiboDriver._patch(f"/pods/{podUid}/acStates/{propertyToChange}",
                json.dumps({'currentAcState': currentAcState, 'newValue': newValue}))
        
    @staticmethod
    def historicalMeasurements(podUid):
        """
        get historical measurements with up to 5 days of backlog
        :param podUid: id of the pod
        :return: return the result
        """
        result = SensiboDriver._get(f"/pods/{podUid}/historicalMeasurements")
        return result

    @staticmethod
    def pod_get_cr_setting(podUid):
        """
        :param podUid: get the id of the pod
        :return: Climate React setting in dict format
        """
        result = SensiboDriver._get(f"/pods/{podUid}/smartmode")
        return result['result']

    @staticmethod
    def pod_get_current_timer(podUid):
        """
        :param podUid: get the id of the pod
        :return: current timer in dict format
        """
        result = SensiboDriver._get(f"/pods/{podUid}/timer")
        return result['result']

    @staticmethod
    def pod_get_sched_items(podUid):
        """
        :param podUid: get the id of the pod
        :return: scheduled items in dict format
        """
        result = SensiboDriver._get(f"/pods/{podUid}/schedules")
        return result['result']


class SensiboEntity(MeasureEntity, ControlEntity):
    """Sensibo Device Entity"""
    _config_struct = {}
    _api_url = None
    _api_key = None
    _device_name = "test"
    _meas_cfg_schema = {
        "type": "object",
        "properties": {
            "api_url": {
            "type": "string"
            },
            "api_key": {
            "type": "string"
            },
            "device_name": {
            "type": ["string","array"]
            }
        },
        "required": ["api_url", "api_key", "device_name"]
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.last_timestamp = None
        self.last_response = {}

    def entity_init(self):
        """init function from the abstract parent"""
        pass

    def meas_cfg_is_valid(self, cfg):
        """
        This method checks if the configuration works in terms of application
        """
        # I keep the try statements separate to explain the pipeline
        try:
            # check if the configuration follows the schema
            validate(cfg, self._meas_cfg_schema)
        except ValidationError as e:
            print(e)
            return False
        # try:
        #     # check if the configurations are valid in terms of devices present
        #     self.check_devices()
        #
        # except Exception as e:
        #     print(e)
        #     return False

    def read_measure(self, meas_obj: Measure) -> HubCoreMeasureData:
        """Allow to read new value for the measure identified by 'tag'"""
        already_read = False
        if meas_obj is None:
            raise HubCoreException(HubCoreError.INV_PARAM, f"Measure object is not defined")
        # Entity does not repeat the http get request if the required measure has been read within the 20% of the
        # polling_period TODO: rendere percentage configurabile
        percentage = 1  # 0.2
        valid_meas_interval = int(meas_obj.additional_cfg.get('polling_period') * 60 * percentage)
        if self.last_timestamp and datetime.now(timezone.utc) < self.last_timestamp + timedelta(seconds=valid_meas_interval):
            if meas_obj.tag in self.last_response:
                already_read = True
        if not already_read:
            try:
                response = SensiboDriver().pod_measurement(self.field_id)
                # self.check_stale(response["timestamp"]["time"]) TODO: da gestire
                self.last_response = response
                self.last_timestamp = datetime.strptime(response["time"]["time"], '%Y-%m-%dT%H:%M:%S.%fZ')
                self.last_timestamp = self.last_timestamp.replace(tzinfo=pytz.utc)  # assigning the timezone
            except ReadTimeout as timeout:
                raise HubCoreException(HubCoreError.NO_ANSW_ENT)
        value = self.last_response.get(meas_obj.tag)
        timestamp = self.last_timestamp.strftime('%Y-%m-%d %H:%M:%S')
        return HubCoreMeasureData(meas_obj.id, timestamp, value)

    @staticmethod
    def send_drv_cmd(drv_context):
        """This method sends a driver generic command"""
        resp = None
        try:
            cmd_type = drv_context.get("type")
            if cmd_type == "get devices":
                resp = SensiboDriver().devices()
        except ConnectTimeout as exc:
            raise HubCoreException(HubCoreError.NO_ANSW_ENT, str(exc))
        except BaseException as exc:
            raise HubCoreException(HubCoreError.DRIVER_ERROR, str(exc))
        return resp

    def send_ent_cmd(self, drv_context):
        resp = None
        try:
            # TODO: definire gestione errori -> TIMEOUT? PARAMETRI ERRATI? PARAMETRI OBBLIGATORI?
            cmd_type = drv_context.get("type")
            if cmd_type == "get info":
                resp = SensiboDriver().pod_info(self.field_id)
            elif cmd_type == "get state":
                resp = SensiboDriver().pod_ac_state(self.field_id)
            elif cmd_type == "set state":
                ac_state = SensiboDriver().pod_ac_state(self.field_id)
                ac_state.pop("timestamp")
                for key in ac_state.keys():
                    ac_state[key] = drv_context.get(key, ac_state[key])
                resp = SensiboDriver().pod_post_ac_state(self.field_id, newAcState={'acState': ac_state})
            elif cmd_type == "change prop":
                pass  # not implemented
            elif cmd_type == "get meas":
                resp = SensiboDriver().pod_measurement(self.field_id)
            elif cmd_type == "get hist":
                resp = SensiboDriver().historicalMeasurements(self.field_id)
            elif cmd_type == "get CR":
                resp = SensiboDriver().pod_get_cr_setting(self.field_id)
            elif cmd_type == "get curr tim":
                resp = SensiboDriver().pod_get_current_timer(self.field_id)
            elif cmd_type == "get sched":
                resp = SensiboDriver().pod_get_sched_items(self.field_id)
        except ConnectTimeout as exc:
            raise HubCoreException(HubCoreError.NO_ANSW_ENT, str(exc))
        except BaseException as exc:
            raise HubCoreException(HubCoreError.DRIVER_ERROR, str(exc))
        return resp

    # Custom methods
    # def check_devices(self):
    #     if self._device_name in self.devices:
    #         return True
    #     else:
    #         return False
    
    def check_stale(self, new_timestamp):
        if self.last_timestamp == new_timestamp:
            return True
        else:
            return False


def main():
    # import the modules for the execution
    
    # rel_path = ["hub-core","hub_core","driver","sensibo.json"] # path from the project root
    rel_path = ["C:", "SWnum", "278", "hub_core", "driver", "sensibo.json"]  # path from the project root

    curr_path = os.getcwd().split("\\")
    print(curr_path)
    for lvl in rel_path:
        if lvl in curr_path:
            continue
        else:
            curr_path.append(lvl)
    # import the configuration
    with open("\\".join(curr_path), "r") as f:
        sensibo_conf = json.load(f)
    
    # initialize the client API
    # client = SensiboEntity(sensibo_conf['api_url'], sensibo_conf['api_key'])

    # get the device list
    devices = SensiboDriver().devices()
    print(devices)
    # get the uid
    uid = devices[sensibo_conf['device_name']]

    # reti
    ac_state = SensiboDriver().pod_ac_state(uid)
    print("new_ac_state:", ac_state)
    pod_measurements = SensiboDriver().pod_measurement(uid)
    print(pod_measurements, "\n\n")

    # test pod controls
    # get current setpoints
    old_target = ac_state['targetTemperature']
    new_target = old_target - 1

    # change setpint
    SensiboDriver().pod_change_ac_state(uid, ac_state, 'targetTemperature', new_target)
    new_ac_state = SensiboDriver().pod_ac_state(uid)
    print("new ac state:", new_ac_state)
    time.sleep(10)
    print("resetting to previous state")
    SensiboDriver().pod_change_ac_state(uid, ac_state, 'targetTemperature', new_target)

    # test change of whole state
    

if __name__=="__main__":
    main()
