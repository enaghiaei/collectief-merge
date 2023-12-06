"""HTTP Test Entity driver"""
from http import HTTPStatus
from logging import getLogger
import requests
from requests import ReadTimeout
from modules.collectief_interface import MessageStatus, HubCoreMsgResult
from modules.database.entity_abstract import ControlEntity, EntityRetry
from modules.mqtt.payload import HubCoreError, HubCoreException


class TestHttpEntity(ControlEntity):
    """Driver class managing HTTP Test devices"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._url = ""
        self.entity_init()

    def entity_init(self):
        """Entity initialization from cfg"""
        self._url = self._cfg.get("url")

    def get_url(self):
        """Get the url to reach the HTTP entity"""
        return self._url

    def send_ent_cmd(self, drv_context):
        """This method send an HTTP POST request to the HTTP Test entity.
        Each entity has different channels. Each channel has a value assigned."""
        url = f"{self._url}/{self._field_id}"
        headers = {'Content-Type': 'application/json'}
        params = {"ch": drv_context["ch"], "value": drv_context["value"]}
        try:
            response = requests.request("POST", url, headers=headers, params=params, timeout=self.request_timeout)
        except ReadTimeout as timeout:
            raise HubCoreException(HubCoreError.NO_ANSW_ENT, timeout.response)

        getLogger().debug(f"HTTP Response:\n{response.text}")
        if response.status_code == HTTPStatus.OK:
            message = response.text
        else:
            msg = f'HTTP resp {response.status_code} - {response.text}'
            raise HubCoreException(HubCoreError.DRIVER_ERROR, msg)
        return message

    def queueing_criteria(self, drv_ctxt, item_list) -> HubCoreMsgResult:
        """drv_ctxt: driver dependent parameters.
        item_list: list of items in queue for the specific entity
        This method uses drv_ctxt and item_list and  decides which is the next item that the HubCore has to manage.
        It returns Item object that has to be executed first"""
        item_msg = None
        remove_list = []
        # Search by channel
        channel_list = search_ch(drv_ctxt["ch"], item_list)
        print(f"Append: found {len(channel_list)} elements for channel {drv_ctxt['ch']}")
        if channel_list:
            item = search_state(drv_ctxt["value"], channel_list)
            if item:
                item_status = MessageStatus.DISCARD
                item_msg = f"Found identical item in the list - channel {drv_ctxt['ch']}, value {drv_ctxt['value']}"
            else:
                control = next((ctrl for ctrl in self._controls if ctrl["ch"] == drv_ctxt["ch"]), None)
                if control is None:
                    raise Exception(f"No control object with channel {drv_ctxt['ch']} found for {str(self)}")
                if control["type"] == "scroll":
                    for channel_element in channel_list:
                        remove_list.append(channel_element)
                    item_status = MessageStatus.OVERWRITE
                    item_msg = f"Append: replaced value {drv_ctxt['value']} for scrollbar"
                elif control["type"] == "btn":
                    items = search_state(not drv_ctxt["value"], channel_list)
                    # print(f"Append: found {len(items)} items with state: {not params['value']}")
                    if items:
                        for item in items:
                            remove_list.append(item)
                        item_status = MessageStatus.OVERWRITE
                        item_msg = f"Overwrite {len(items)} items for channel '{drv_ctxt['ch']}'"
                    else:
                        item_status = MessageStatus.ADD
                else:
                    raise Exception(f"Control type '{control['type']}' not found for {str(self)}")
        else:
            item_status = MessageStatus.ADD
        return HubCoreMsgResult(item_status, msg=item_msg, remove_list=remove_list)


def search_ch(ch, it_list):
    """This method search items with a specific "ch" inside a list"""
    return [it for it in it_list if it.body.drv_context["ch"] == ch]


def search_state(state, it_list):
    """This method search items with a specific "value" inside a list"""
    return [it for it in it_list if it.body.drv_context["value"] == state]


