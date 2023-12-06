"""A2A Entity driver"""
import json
from datetime import datetime
from http import HTTPStatus
from json import JSONDecodeError
from logging import getLogger
import requests
from requests import ReadTimeout
from modules.configuration.cfg_abstract import AbstractConfig
from modules.database.measure import Measure
from modules.database.models import HubCoreMeasureData
from modules.database.entity_abstract import MeasureEntity, ControlEntity
from modules.mqtt.payload import HubCoreError, HubCoreException


class A2AEntity(MeasureEntity, ControlEntity):
    """
    Driver class managing A2A devices.
    """
    # Credentials
    _logged_in = False
    _auth_token = None
    _organization_key = None
    _url = None
    _email = None
    _password = None
    _http_timeout = None
    # Read configuration file
    json_cfg = AbstractConfig.load_json_from_file('driver/a2a.json')
    if json_cfg:
        _url = json_cfg.get("url")
        _email = json_cfg.get("email")
        _password = json_cfg.get("password")
        _http_timeout = json_cfg.get("http_timeout_sec")
        del json_cfg

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def read_measure(self, meas_obj: Measure) -> HubCoreMeasureData:
        """
        This method allows to read new value for the measure identified by "tag".
        The meas_id is automatically assigned from mysql when the measure is added to hc_measures table.
        """
        if meas_obj is not None:
            A2AEntity._login()
            url = f"{self._url}/devices/{self._field_id}/measures/latest"
            headers = {
                'Authorization': f'Bearer {A2AEntity._auth_token}',
                'Content-Type': 'application/json',
                'organizationKey': A2AEntity._organization_key
            }
            params = {"measureName": meas_obj.tag}

            try:  # Send HTTP Request
                response = requests.request("GET", url, headers=headers, params=params, timeout=A2AEntity._http_timeout)
            except ReadTimeout as timeout:
                raise HubCoreException(HubCoreError.NO_ANSW_ENT, timeout.response)

            # Handle HTTP Response
            response_json = json.loads(response.content)
            if response.status_code == HTTPStatus.OK:
                read_meas = response_json[0].get("payload", {}).get(meas_obj.tag)
                timestamp = response_json[0].get("timestamp")
                timestamp = datetime.strptime(timestamp, '%Y-%m-%dT%H:%M:%S.%fZ')
                timestamp = timestamp.strftime('%Y-%m-%d %H:%M:%S')
            elif response.status_code == HTTPStatus.UNAUTHORIZED and response_json.get("invalidToken") is True:
                # TODO: testare
                A2AEntity._logged_in = False
                raise HubCoreException(HubCoreError.DRIVER_ERROR, f'Auth Token expired')
            else:
                raise HubCoreException(HubCoreError.DRIVER_ERROR, f'HTTP resp {response.status_code} - {response.text}')
        else:
            raise Exception(f"Empty measure object ({str(self)})")
        return HubCoreMeasureData(measure_id=meas_obj.id, dt=timestamp, value=read_meas)

    def send_ent_cmd(self, drv_context):
        """
        This method allows to send a command to a specific entity (self).
        """
        A2AEntity._login()
        headers = {'Authorization': f'Bearer {A2AEntity._auth_token}', 'Content-Type': 'application/json',
                   'organizationKey': A2AEntity._organization_key}
        params = {}
        payload = b''
        try:
            cmd_type = drv_context.get("type")
            if cmd_type == "get device list":
                url = f"{self._url}/devices"
                # optional parameters
                page_size = drv_context.get("pagSize", 30)
                page = drv_context.get("page", 1)
                form = drv_context.get("form", "long")
                params = {"pagSize": page_size, "page": page, "form": form}
                method = "GET"
            elif cmd_type == "get info":
                url = f"{self._url}/devices/{self._field_id}"
                params = {"form": drv_context.get("form", "long")}
                method = "GET"
            elif cmd_type == "get measures":
                url = f"{self._url}/devices/{self._field_id}/measures"
                method = "GET"
            elif cmd_type == "get meas by date":
                url = f"{self._url}/devices/{self._field_id}/measures"
                meas_count = drv_context.get("take", 50)
                order = drv_context.get("order", "DESC")
                from_datetime = drv_context.get("from")
                to_datetime = drv_context.get("to")
                if from_datetime is None or to_datetime is None:
                    raise HubCoreException(HubCoreError.INV_PARAM, f"A2A driver: 'to' and/or 'from' missing in params")
                params = {"take": meas_count, "order": order, "from": from_datetime, "to": to_datetime}
                method = "GET"
            elif cmd_type == "get latest meas":
                url = f"{self._url}/devices/{self._field_id}/measures/latest"
                if "measureName" not in drv_context:
                    raise HubCoreException(HubCoreError.INV_PARAM, f"A2A driver: 'measureName' missing in params")
                params = {"measureName": drv_context["measureName"]}
                method = "GET"
            elif cmd_type == "get downlinks":
                url = f"{self._url}/devices/{self._field_id}/downlinks"
                method = "GET"
            elif cmd_type == "get actions":
                url = f"{self._url}/devices/{self._field_id}/actions"
                method = "GET"
            elif cmd_type == "get action fields":
                action = drv_context.get("action")
                if action is None:
                    raise HubCoreException(HubCoreError.INV_PARAM, f"A2A driver: 'action' missing in params")
                url = f"{self._url}/devices/{self._field_id}/actions/{action}/fields"
                method = "GET"
            elif cmd_type == "send dwn by field":
                action = drv_context.get("action")
                if action is None:
                    raise HubCoreException(HubCoreError.INV_PARAM, f"A2A driver: 'action' missing in params")
                url = f"{self._url}/devices/{self._field_id}/downlinks/actions/{action}"
                dwn_ack = drv_context.get("downlinkAckByUplink", False)
                fields = drv_context.get("fields")
                if fields is None:  # fields può non esserci!!!! TODO
                    raise HubCoreException(HubCoreError.INV_PARAM, f"A2A driver: 'fields' missing in params")
                method = "POST"
                payload = json.dumps({"fields": fields, "downlinkAckByUplink": dwn_ack})
            else:
                raise HubCoreException(HubCoreError.INV_PARAM, f"Driver command '{cmd_type}' not recognized ({str(self)})")
            response = requests.request(method, url, headers=headers, params=params, data=payload, timeout=A2AEntity._http_timeout)
            try:
                response_json = json.loads(response.content)
            except JSONDecodeError:
                response_json = response.content.decode("utf-8")
            if response.status_code == HTTPStatus.OK:
                message = response.text
            elif response.status_code == HTTPStatus.UNAUTHORIZED and response_json.get("invalidToken") == "true":
                A2AEntity._logged_in = False
                raise HubCoreException(HubCoreError.DRIVER_ERROR, f'Auth Token expired')  # TODO: da implementare login+retry
            else:
                raise HubCoreException(HubCoreError.DRIVER_ERROR, f'HTTP response {response.text}')
        except ReadTimeout as timeout:
            raise HubCoreException(HubCoreError.NO_ANSW_ENT, timeout.response)
        except HubCoreException as exc:
            raise HubCoreException(exc.error_type, exc.msg)
        except BaseException as exc:
            raise HubCoreException(HubCoreError.GENERIC_ERROR, str(exc))
        return message

    """
    Custom A2A Driver methods:
    - login
    - logout
    """
    @staticmethod
    def _login():
        """
        Send the HTTP POST request to retrieve the auth token and the organization keys
        """
        if not A2AEntity._logged_in:
            if A2AEntity._url is not None:
                url = f"{A2AEntity._url}/login"
                headers = {'Content-Type': 'application/json'}
                payload = json.dumps({"email": A2AEntity._email, "password": A2AEntity._password})
                try:
                    response = requests.request("POST", url, headers=headers, data=payload,
                                                timeout=A2AEntity._http_timeout)
                except ReadTimeout as timeout:
                    raise HubCoreException(HubCoreError.NO_ANSW_ENT, timeout.response)
                if response.status_code == HTTPStatus.OK:
                    # Getting auth code
                    content = json.loads(response.content)
                    A2AEntity._auth_token = content["token"]
                    A2AEntity._organization_key = content["organizationKeys"][0]
                    A2AEntity._logged_in = True
                    getLogger().info("Successfully logged in A2A platform!")
                else:
                    msg = f"Login to A2A server failed, response code: {response.status_code} - body: {response.text}"
                    getLogger().debug(msg)
                    raise HubCoreException(HubCoreError.DRIVER_ERROR, msg)
            else:
                msg = "Login to A2A server failed, URL not set"
                getLogger().debug(msg)
                raise HubCoreException(HubCoreError.DRIVER_ERROR, msg)

    @staticmethod
    def _logout():
        """
        This method clean all the members involved in the login procedure
        """
        A2AEntity._auth_token = None
        A2AEntity._organization_key = None
        A2AEntity._logged_in = False
