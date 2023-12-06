# -*- coding: utf-8 -*-

"""

"""
import json, os, sys
from collections import OrderedDict
from datetime import datetime, timezone
import pandas as pd
import requests
import socket
from typing import Dict, Any, List, AnyStr
from requests import ReadTimeout, ConnectTimeout

# Get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Get the parent directory
parent_dir = os.path.dirname(current_dir)

# Add the parent directory to sys.path
sys.path.append(parent_dir)

from modules.database.measure import Measure
from modules.configuration.cfg_abstract import AbstractConfig
from modules.database.models import HubCoreMeasureData
from modules.database.entity_abstract import MeasureEntity, ControlEntity
from modules.mqtt.payload import HubCoreException, HubCoreError
from jsonschema import validate
import datetime
from datetime import datetime, timedelta
from time import sleep, time


class SGINTEROP:
    def __init__(self, host: str, login: str, password: str, header_content_type: str, header_accept: str,
                 certificate: str, x_authorization: str):
        """
        Constructor of class SGINTEROP. The parameters below are the parameters for the HTTP protocol
        :param host:
        :param login:
        :param password:
        :param header_content_type:
        :param header_accept:
        :param certificate:
        :param x_authorization:
        """
        self.host = host
        self.login = login
        self.password = password
        self.post_credentials = f'{{"username": "{self.login}", "password":"{self.password}"}}'
        self.header_content_type = header_content_type
        self.header_accept = header_accept
        self.x_authorization = x_authorization
        self.post_headers = {
            "Content-Type": self.header_content_type, "Accept": self.header_accept}
        self.certificate = certificate

    def get_headers(self) -> dict[str, str]:
        """
        Class method to fetch the JWT token and creating new headers
        :return:
        """
        url = 'https://{}/api/auth/login'.format(self.host)
        resp_token = requests.post(url=url, headers=self.post_headers, data=self.post_credentials,
                                   verify=self.certificate)
        JWT_token = str(resp_token.json()['token'])
        headers = {"Content-Type": self.header_content_type,
                   "X-Authorization": f"{self.x_authorization} {JWT_token}"}

        return headers

    def get_single_measure(self, device_id: str, key: str) -> list[dict[str, Any]] | tuple[int, str]:
        headers = self.get_headers()
        limit = 10 ** 6
        # @marcorivolta-LSI In teoria SGINTEROP gestisce una tag alla volta. Il wrapper ne gestisce multiple
        # Osservando che il tuo hub core fa una richiesta per ogni tag, cambio il metodo per considerare una key alla
        # volta
        # for key in variables:
        url = f"https://{self.host}/api/plugins/telemetry/DEVICE/{device_id}/values/timeseries?keys={key}&limit={limit}"
        response = requests.get(
            url=url, headers=headers, verify=self.certificate)

        if response.status_code == 200:
            # make a json of jsons for setting up the rest
            return response.json()[key]
        else:
            print(f"Status Code {response.status_code}: {response.text}")
            print(f"Reason {response.reason}")
            return response.status_code, response.reason

    def get_all_measures(self, device_id: str) -> dict[str, Any] | tuple[int, str]:
        headers = self.get_headers()
        limit = 10 ** 6
        url = f"https://{self.host}/api/plugins/telemetry/DEVICE/{device_id}/values/timeseries?limit={limit}"
        response = requests.get(url=url, headers=headers, verify=self.certificate)
        if response.status_code == 200:
            # make a json of jsons for setting up the rest
            return response.json()
        else:
            print(f"Status Code {response.status_code}: {response.text}")
            print(f"Reason {response.reason}")
            return response.status_code, response.reason

    @staticmethod
    def convert_timestamp(timestamp: int) -> datetime:
        """
        Convert a timestamp from milliseconds to datetime.
        """
        return datetime.fromtimestamp(timestamp / 1000 - 7200)

    @staticmethod
    def is_datapoint_stale(timestamp: datetime, int_sec: int = 900) -> bool:
        """
        Check if a datapoint is considered stale based on the time difference between
        the datapoint timestamp and the current time.
        :param timestamp: timestamp to check
        :param int_sec: number of seconds to consider the limit after which the data is "stale"
        :return: return if the teh difference is valued
        """
        current_time = datetime.now()
        latest_timestamp = current_time - timedelta(seconds=current_time.second,
                                                    microseconds=current_time.microsecond)
        timediff = latest_timestamp - timestamp
        return timediff.total_seconds() > int_sec

    def update_timestamp(self, timeseries: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Update timestamps and stale status in a given timeseries dictionary.
        """
        # structure is [{"ts": <<unix_ts shifted by two hours>>, "value": float}]
        for datapoint in timeseries:
            # The timestamps are in millisecond
            # the unix timestamp exposed by sginterop is shifted to utc+2 so using plain conversion seems to be
            timestamp = datapoint["ts"]

            timedate = self.convert_timestamp(timestamp)
            datapoint["original_datetime"] = timedate.isoformat()

            datapoint["stale"] = self.is_datapoint_stale(timedate)

            # missing datapoints are not missing, it's just that the value hasn't changed,
            # it assumed the datapoints is grouped into one of the quarter-hour interval values
            if datapoint["stale"]:
                latest_timestamp = datetime.now() - timedelta(minutes=datetime.now().minute % 15)
                latest_timestamp = latest_timestamp.replace(second=0, microsecond=0)
                datapoint["datetime"] = latest_timestamp.isoformat()

        return timeseries

    def update_all_timestamp(self, measure_dict: dict[str, Any]) -> dict[str, Any]:
        for key in measure_dict:
            self.update_timestamp(measure_dict[key])
        return measure_dict

    def get_interval(self, device_id: str, keys: str | List, start_ts: str = None, end_ts: str = None) \
            -> dict[str, list[dict[str, Any]]] | tuple[int, str]:
        """
        Getting latest telemetry from the SGINTEROP thingsboard
        :param keys: either a string or a list of strings
        :param device_id: ID of the device from which to get the interval (either measurements or historical setpoint)
        :type device_id: str
        :param start_ts: start of data retrieval in ISO 8601 format, assuming UTC
        :type start_ts: str
        :param end_ts:
        :type end_ts: str
        :return:
        """
        headers = self.get_headers()

        if start_ts is None:
            start_ts = 0
        else:
            start_ts = int(datetime.fromisoformat(start_ts).timestamp() * 1000)

        if end_ts is None:
            end_ts = int(time() * 1000)
        else:
            end_ts = datetime.fromisoformat(end_ts).timestamp() * 1000

        data_series = dict.fromkeys(keys)
        limit = 10 ** 6
        if isinstance(keys, str):
            keys = [keys]

        for key in keys:
            url = f"https://{self.host}/api/plugins/telemetry/DEVICE/{device_id}/values/timeseries?keys={key}" \
                  f"&startTs={start_ts}&endTs={end_ts}&limit={limit}"
            response = requests.get(
                url=url, headers=headers, verify=self.certificate)
            # TODO what if the system goes in timeout
            if response.status_code == 200:
                data_series[key] = response.json()[key]
                return data_series
            else:
                return response.status_code, response.reason

    def get_latest_time(self, device_id: str, keys: list) -> list[dict[str, Any]]:
        """
        Obtain the latest data point timestamps available
        :param device_id: id of the device
        :param variables: variable to request to the device
        :return: dictionary containing the latest timestamp, corrected to actual UTC
        """
        headers = self.get_headers()

        dict_latest = dict.fromkeys(keys)

        for key in keys:
            url = f"https://{self.host}/api/plugins/telemetry/DEVICE/{device_id}/values/timeseries?keys={key}"
            response = requests.get(
                url=url, headers=headers, verify=self.certificate)
            json_data = response.json()

            if json_data:
                # corrected to -2 hours in order to account for the bad case of system
                last_timestamp = float(json_data[key][-1]['ts'])
                dict_latest[key] = last_timestamp
            else:
                dict_latest[key] = 0

            return dict_latest

    @staticmethod
    def within_threshold(data: Dict[str, Any], min_temperature: float, max_temperature: float,
                         min_co2: float,
                         max_co2: float) -> dict:
        """
        verify that it stays within threshold
        :param data: setpoint data
        :type data: Dict[str, Any]
        :param min_temperature: minimum temperature allowed
        :type min_temperature: float
        :param max_temperature: maximum temperature allowed
        :type max_temperature: float
        :param min_co2: minimum co2 allowed
        :type min_co2: float
        :param max_co2: maximum co2 allowed
        :type max_co2: float
        :return: dict
        """
        # it assumes the structure {"ts": <<unix_ts>>, "values": <<dict>>} of which only "values" is passed
        for setpoint in data:
            if ("_thot" in setpoint) or ("_tcold") in setpoint:

                if data[setpoint]['value'] < min_temperature:
                    data[setpoint]['value'] = round(min_temperature, 1)

                elif data[setpoint]['value'] > max_temperature:
                    data[setpoint]['value'] = round(max_temperature, 1)

                else:
                    data[setpoint]['value'] = round(data[setpoint][0]['value'], 1)

            elif "_co2" in setpoint:
                if data[setpoint]['value'] < min_co2:
                    data[setpoint]['value'] = round(min_co2, 0)

                elif data[setpoint]['value'] > max_co2:
                    data[setpoint]['value'] = round(max_co2, 0)

                else:
                    data[setpoint][0]['value'] = round(data[setpoint][0]['value'], 0)
        return data

    def set(self, device_token: str, item: Any) -> bool:
        """
        pushing a single key to the telemetry of the SGINTEROP thingsboard
        :param device_token: token of the device, either ip token or setpoint token
        :param key: variable to change
        :return: nothing, it sends a post request
        """
        measurement = json.dumps(item)

        url = f'https://{self.host}/api/v1/{device_token}/telemetry'
        res = requests.post(url=url, headers=self.post_headers,
                            data=measurement, verify=self.certificate)

        if res.status_code == 200 or res.status_code == 204:
            return True
        else:
            return False

    # @MarcoRivolta-LSI questo metodo potrebbe essere utile per i batch control ma altrimenti non va bene
    def set_multiple(self, device_token: str, data: dict, relax: bool = False) -> bool:
        """
        Pushing data to the telemetry of the SGINTEROP thingsboard in case the structure is
        {<<key>>: [{"ts": <<unix_timestamp>>, "value": <<float>>}]}
        :param device_token:
        :paramt data: setpoints
        :return:
        """

        batch_entity = 0
        for key, item in data.items():
            r = self.set(device_token=device_token, item=item)

            if not r:
                return r

            if relax:
                batch_entity += 1

                if batch_entity == 6120:
                    sleep(2)
                    batch_entity = 0

        return r


class SGInteropEntity(MeasureEntity, ControlEntity):
    _config_struct = {}
    _api_url = None
    _api_key = None
    _device_name = None
    _meas_cfg_schema = {
        "type": "object",
        "properties": {
            "host": {
                "type": "string"
            },
            "login": {
                "type": "string"
            },
            "password": {
                "type": "string"
            },
            "header_content_type": {
                "type": "string"
            },
            "header_accept": {
                "type": "string"
            },
            "certificate": {
                "type": "string"
            },
            "x_authorization": {
                "type": "string"
            },
            "data_device_id": {
                "type": "string"
            },
            "data_device_token": {
                "type": "string"
            },
            "setpoint_device_id": {
                "type": "string"
            },
            "setpoint_device_token": {
                "type": "string"
            },
            "ip_device_id": {
                "type": "string"
            },
            "ip_device_token": {
                "type": "string"
            },
            "sensor_variables": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "setpoint_variables": {
                "type": "object",
                "patternProperties": {
                    "^4A01[3-9]_[a-zA-Z_]+$": {
                        "type": "string"
                    },
                    "^4A02[0]_[a-zA-Z_]+$": {
                        "type": "string"
                    }
                }
            },
            "setpoint_thresholds": {
                "type": "object",
                "items": {
                    "min_temperature": {
                        "type": "string"
                    },
                    "max_temperature": {
                        "type": "string"
                    },
                    "min_co2": {
                        "type": "string"
                    },
                    "max_co2": {
                        "type": "string"
                    }
                }
            }
        },
        "required": [
            "host",
            "login",
            "password",
            "header_content_type",
            "header_accept",
            "certificate",
            "x_authorization",
            "data_device_id",
            "data_device_token",
            "ip_device_id",
            "ip_device_token",
            "sensor_variables",
            "setpoint_variables",
            "setpoint_thresholds"
        ]
    }

    json_cfg = AbstractConfig.load_json_from_file("driver/sginterop.json")

    if json_cfg:
        _certificate = json_cfg.get("certificate")
        _data_device_id = json_cfg.get("data_device_id")
        _data_device_token = json_cfg.get("data_device_token")
        _header_accept = json_cfg.get("header_accept")
        _header_content_type = json_cfg.get("header_content_type")
        _host = json_cfg.get("host")
        _ip_device_id = json_cfg.get("ip_device_id")
        _ip_device_token = json_cfg.get("ip_device_token")
        _login = json_cfg.get("login")
        _password = json_cfg.get("password")
        _x_authorization = json_cfg.get("x_authorization")
        _sensor_variables = json_cfg.get("sensor_variables")
        _setpoint_variables = json_cfg.get("setpoint_variables")
        _setpoint_thresholds = json_cfg.get("setpoint_thresholds")
        _setpoint_device_id = json_cfg.get("setpoint_device_id")
        _setpoint_device_token = json_cfg.get("setpoint_device_token")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.last_timestamp = None
        self._last_read_data = None
        self._last_read_time = None
        self.sensor_variables = self._sensor_variables
        self.setpoint_variables = self._setpoint_variables
        self.setpoint_thresholds = self._setpoint_thresholds
        # whenever the host name is sent
        self.ip_info = {"host_name": socket.gethostname(),
                        "host_full_name": socket.getfqdn(),
                        "ip_address": requests.get("https://api.ipify.org/",
                                                   headers={"ResponseType": "text"}).text}

        kwargs = {d: self.json_cfg.get(d) for d in ["host", "login", "password", "header_content_type",
                                                "header_accept", "certificate", "x_authorization"]}

        self.sginterop = SGINTEROP(**kwargs)

        # TODO use dict mapping in spare time
        # self.ent_cmds = {
        #     "get state": lambda : self.sginterop.get,
        #     "set state": self.sginterop.post,
        #     "get meas": ,
        #     "get interval":,
        #     "get history":,
        #     "get ltst time":,
        #     "get schedule":
        # }

    def meas_cfg_is_valid(self, cfg):
        """
        This method checks if the configuration works and contains all the fields of interest
        """
        # I keep the try statements separate to explain the pipeline
        try:
            # check if the configuration follows the schema
            validate(cfg, self._meas_cfg_schema)

            # check if the system is available

        except Exception as e:
            print(e)
            return False

    def read_measure(self, meas_obj: Measure) -> HubCoreMeasureData:
        if meas_obj is not None:
            try:
                period_percentage = 0.1
                max_accepted_delay = timedelta(minutes=period_percentage * meas_obj.additional_cfg.get('polling_period'))
                measure_is_old = self._last_read_time is None or datetime.now(timezone.utc) - self._last_read_time > max_accepted_delay
                if measure_is_old:
                    # Read all measures
                    self._last_read_data = self.sginterop.get_all_measures(device_id=self._data_device_id)
                    self._last_read_data = self.sginterop.update_all_timestamp(self._last_read_data)
                    self._last_read_time = datetime.now(timezone.utc)
                # Get timestamp and value
                timestamp = datetime.strptime(self._last_read_data.get(meas_obj.tag)[0].get("datetime"), "%Y-%m-%dT%H:%M:%S")
                timestamp = timestamp.strftime('%Y-%m-%d %H:%M:%S')
                value = self._last_read_data.get(meas_obj.tag)[0].get("value")
            except ReadTimeout as timeout:
                raise HubCoreException
        else:
            raise HubCoreException(HubCoreError.INV_PARAM, f"Measure object is not defined")
        return HubCoreMeasureData(meas_obj.id, timestamp, value)

    def send_ent_cmd(self, drv_context):
        resp = None
        try:
            cmd_type = drv_context.get("type")
            if cmd_type == "get state":
                resp = {"ts": datetime.fromtimestamp(time()), "values":
                        self.sginterop.get_all_measures(device_id=self.cfg.get("setpoint_device_id", self._setpoint_device_id))}
            elif cmd_type == "set state":
                data = {"ts": time() * 1000,
                        "values": {key: drv_context.get(key) for key in self.setpoint_variables}}
                data = self.sginterop.within_threshold(data, **self._setpoint_thresholds)
                resp = self.sginterop.set(device_token=self.cfg.get("ip_device_token", self.cfg.get("ip_device_token", self._ip_device_token)), item=data)

            elif cmd_type == "get meas":
                resp = self.sginterop.update_all_timestamp(self.sginterop.get_all_measures(
                    device_id=self.cfg.get("setpoint_device_id", self._setpoint_device_id)))

            elif cmd_type == "get interval":
                for field in ["meas_key", "start_ts", "end_ts"]:
                    if field not in drv_context:
                        raise Exception(f"Missing mandatory '{field}' field")
                keys = drv_context.get("meas_key").split(",")
                start_ts = drv_context.get("start_ts")
                end_ts = drv_context.get("end_ts")
                resp = self.sginterop.get_interval(device_id=self.cfg.get("data_device_id", self._data_device_id), keys=keys, start_ts=start_ts,
                                                   end_ts=end_ts)

            elif cmd_type == "get history":
                # Nota, questo prende molto tempo perché richiede tutti i dati scibili, significa che sarà molto lento
                # probabilmente assimilabile a get interval senza i parametri start ts
                resp = self.sginterop.get_interval(device_id=self.cfg.get("data_device_id", self._data_device_id), keys=self._sensor_variables)

            elif cmd_type == "get ltst time":
                if "keys" not in drv_context:
                    raise Exception(f"Missing mandatory 'keys' field")
                keys = drv_context.get("keys").split(",") if drv_context.get("keys") else self._sensor_variables
                resp = self.sginterop.get_latest_time(device_id=self.cfg.get("data_device_id", self._data_device_id), keys=keys)

        except ConnectTimeout as exc:
            raise HubCoreException(HubCoreError.NO_ANSW_ENT, str(exc))
        except BaseException as exc:
            raise HubCoreException(HubCoreError.DRIVER_ERROR, str(exc))
        return resp

    @staticmethod
    def send_drv_cmd(drv_context):
        # non è detto che mi sarà utile | I have no assurance it will be useful to me
        pass


if __name__ == "__main__":
    rel_path = "hub_core\\certs\\CAcert_sginterop.cer".split("\\")
    abs_path = os.getcwd().split("\\")

    mean = lambda x: sum(x) / len(x)

    latest_test = True
    ts_test = False
    ip_test = False
    setpoint_test = False
    set_test = False

    final_cert_path = ''

    for i, p in enumerate(abs_path):
        if p not in rel_path:
            continue
        elif i == len(abs_path) - 1:
            "\\".join(abs_path + rel_path)
        else:
            final_cert_path = "\\".join(abs_path[:i] + rel_path)
            break

    with open('sginterop.json', "r") as f:
        json_conf = json.load(f)

    kwar = {d: json_conf[d] for d in
            ["host", "login", "password", "header_content_type", "header_accept", "certificate", "x_authorization"]}
    sginterop = SGINTEROP(**kwar)

    sginterop.certificate = final_cert_path

    if latest_test:
        # get latest datapoint, corrected
        variables = json_conf['sensor_variables']
        latest = {key: sginterop.update_timestamp(sginterop.get_single_measure(device_id=json_conf["data_device_id"], key=key)) for key in variables}

    if ts_test:
        # capture only one driver
        variables = [v for v in json_conf['sensor_variables'] if '4a013' in v]

        for key in variables:
            # method called for all the datapoints of all time
            data_series = sginterop.get_interval(device_id=json_conf["data_device_id"], key=key)

            data_series = sginterop.update_timestamp(data_series)

            print(f"Retrieved data of {key}\n")
            print(f"first item:\n{data_series[0]}\n")
            print(f"last item:\n{data_series[-1]}\n")

        import sys

        dict_size = sys.getsizeof(data_series)

        print(f"The size of the dictionary version is {dict_size}")

    if ip_test:
        # do not interfere with the system
        import socket, requests

        # first ip info test, with dict[list[dict]]
        data_ip_info = {key: [{"ts": int(time() * 1000), "value": item}] for key, item in data_ip_info.items()}
        # second ip info test, with dict[dict]

        print(data_ip_info)

        res = sginterop.set(
            device_token=json_conf["ip_device_token"],
            item=data_ip_info
        )
        # todo perform mock api test to test independently of the system
        if res:
            print("sginterop online")
        else:
            print("al bad")

        data_ip_info_alt = {"ts": int(time() * 1000), "values": data_ip_info}
        print(data_ip_info_alt)
        res = sginterop.set(
            device_token=json_conf["ip_device_token"],
            item=data_ip_info_alt
        )

        if res:
            print("all good")
        else:
            print("al bad")

    # data_ip_info = {"ts": time() * 1000, "values": data_ip_info}

    # send information about the machine (this is an override test, it will be reversed in 5 minutes)

    if setpoint_test:
        setpoint_variables = [v for v in json_conf['setpoint_variables'] if '4a015' in v or '4a018' in v]

        for key in setpoint_variables:
            telemetry = sginterop.get_single_measure(device_id=json_conf["setpoint_device_id"], key=key)
            print(telemetry)

    if set_test:
        setpoint_variables = [v for v in json_conf['setpoint_variables'] if '4a015' in v or '4a018' in v]
        # TODO find alternatives that don't rely on external APIs to get the IP
        data_ip_info = {"host_name": socket.gethostname(),
                        "host_full_name": socket.getfqdn(),
                        "ip_address": requests.get('http://jsonip.com/').json()['ip']}

        data_ip_info = {"ts": time() * 1000, "values": data_ip_info}

        setpoints = {'thot': 20, 'tcold': 24, 'co2': 500}

        setpoint = {"ts": int(time() * 1000), "values": {v: setpoints[v.split("_")[1]] for v in setpoint_variables}}

        print("Cumulative setpoint:\n", setpoint)

        telemetry = dict.fromkeys(setpoint_variables)

        for key in setpoint_variables:
            telemetry[key] = sginterop.get_single_measure(device_id=json_conf["setpoint_device_id"], key=key)

        print("telemetry: ", telemetry)

        sginterop.set(
            device_token=json_conf["ip_device_token"],
            item=data_ip_info
        )

        sginterop.set(
            device_token=json_conf["setpoint_device_token"],
            item=setpoint
        )
        new_telemetry = dict.fromkeys(setpoint_variables)

        for key in setpoint_variables:
            new_telemetry[key] = sginterop.get_single_measure(device_id=json_conf["setpoint_device_id"], key=key)

        print("new_telemetry: ", new_telemetry)

        sleep(120)

        # Send IP INFO
        data_ip_info = {"ts": time() * 1000, "values": data_ip_info}
        sginterop.set(
            device_token=json_conf["ip_device_token"],
            item=data_ip_info
        )

        # Send telemetry INFO
        telemetry = {key: [{'ts': time() * 1000, 'value': i['value']} for i in item] for key, item in telemetry.items()}
        sginterop.set(
            device_token=json_conf["setpoint_device_token"],
            item=telemetry
        )

        # Send IP INFO for second command
        data_ip_info = {"ts": time() * 1000, "values": data_ip_info}
        sginterop.set(
            device_token=json_conf["ip_device_token"],
            item=data_ip_info
        )

        # repeat same command, check if the response is useful
        alt_telemetry = {"ts": int(time() * 1000), "values": {w: f[0]['value'] for w, f in telemetry.items()}}
        sginterop.set(
            device_token=json_conf["setpoint_device_token"],
            item=telemetry
        )

