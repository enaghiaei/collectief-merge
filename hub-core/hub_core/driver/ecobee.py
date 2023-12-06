import requests, json
from custom import CustomEntity
from http import HTTPStatus
import requests
from requests import ReadTimeout
from modules.database.measure import Measure
from modules.database.models import HubCoreMeasureData
from modules.database.entity_abstract import MeasureEntity, ControlEntity
from modules.mqtt.payload import HubCoreException, HubCoreError


class EcobeeClientError(Exception):
    pass

class EcobeeClient(object):
    def __init__(self, api_key, token):
        self.api_key = api_key
        self.token = token
        self.api_url = 'https://api.ecobee.com'

    def _handle_response(self, response):
        if response.status_code == 400:
            raise EcobeeClientError("Bad request, please check your input parameters.")
        elif response.status_code != 200:
            raise EcobeeClientError(f"Unexpected error: {response.status_code} - {response.text}")

        try:
            result = response.json()
        except (KeyError, ValueError):
            raise EcobeeClientError("Invalid response format from the ecobee server.")

        return result

    def get_thermostats(self):
        headers = {'Content-Type': 'application/json;charset=UTF-8', 'Authorization': f'Bearer {self.token}'}
        params = {'json': '{"selection":{"selectionType":"registered","selectionMatch":""}}'}
        response = requests.get(f'{self.api_url}/1/thermostat', headers=headers, params=params)
        return self._handle_response(response)

    def set_temperature(self, thermostat_id, cool_temp, heat_temp):
        headers = {'Content-Type': 'application/json;charset=UTF-8', 'Authorization': f'Bearer {self.token}'}
        data = {
            "selection": {
                "selectionType": "thermostats",
                "selectionMatch": thermostat_id
            },
            "functions": [
                {
                    "type": "setHold",
                    "params": {
                        "coolHoldTemp": cool_temp,
                        "heatHoldTemp": heat_temp
                    }
                }
            ]
        }
        response = requests.post(f'{self.api_url}/1/thermostat', headers=headers, data=json.dumps(data))
        return self._handle_response(response)



