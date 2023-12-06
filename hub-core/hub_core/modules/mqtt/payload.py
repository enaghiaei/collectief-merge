"""Hub Core MQTT Payload module"""
import json
from datetime import datetime, timezone
from enum import Enum
from logging import getLogger


class HubCoreError(Enum):
    """Hub Core Error Enum"""
    SUCCESS = 0
    JSON_MALFORMED = 1
    UNSUPP_CMD = 2
    INV_PARAM = 3
    NOT_FOUND = 4
    NOT_UNIQUE = 5
    NOT_PERM = 6
    DRIVER_ERROR = 7
    DB_ERROR = 8
    GENERIC_ERROR = 9
    QUEUE_FULL = 101
    NO_ANSW_ENT = 102

    def __str__(self):
        return self.name


class HubCoreException(Exception):
    """Hub Core Exception Class"""
    def __init__(self, error_type: HubCoreError = HubCoreError.GENERIC_ERROR, msg=None):
        self.error_type = error_type
        self.msg = msg


class Head:
    """Payload Head Class"""
    def __init__(self, ts: datetime = datetime.now(timezone.utc), uuid=None, priority: int = 0, res=None,
                 message=None):
        self.ts = ts
        self.uuid = uuid
        self.priority = priority
        self.res = res
        self.message = message

    def to_json_dict(self):
        """Convert the head object to dictionary"""
        resp = {"head": {"ts": str(self.ts)}}
        if self.uuid:
            resp["head"]["uuid"] = self.uuid
        if self.res:
            resp["head"]["res"] = str(self.res)
        if self.message:
            resp["head"]["message"] = self.message
        return resp

    def __str__(self):
        return f"uuid {self.uuid}"


class Payload(object):
    """Hub Core Payload Class"""
    def __init__(self, head: Head = Head()):
        self.head = head

    def to_json_dict(self):
        """Convert the payload object to dictionary"""
        return self.head.to_json_dict()

    def __str__(self):
        return f"uuid {self.head.uuid}"


class RequestPayload(Payload):
    """Request Payload Class"""
    def __init__(self, head: Head = Head(), action: str = None, params: dict = None):
        super().__init__(head)
        self.action = action
        self.params = params

    def to_json_dict(self):
        """Convert the payload object to dictionary"""
        resp = self.head.to_json_dict()
        if self.action is not None:
            resp["action"] = self.action
        if self.params is not None:
            resp["params"] = self.params
        return resp

    def __str__(self):
        return f"{str(super())} - action: '{self.action}'"

    @staticmethod
    def create_from_bytes(byte_payload):
        """Extract payload object from byte string"""
        payload_dict = json.loads(byte_payload)
        head_dict = payload_dict.get("head", None)
        if head_dict:
            ts = head_dict.get("ts", None)
            uuid = head_dict.get("uuid", None)
            prio = head_dict.get("prio", 0)
            head = Head(ts, uuid, prio)
        else:
            head = Head()
        action = payload_dict.get("action", "")
        params = payload_dict.get("params", {})
        return RequestPayload(head, action, params)


class ResponsePayload(Payload):
    """Response Payload Class"""
    def __init__(self, head: Head = Head(), res_body: dict = None):
        super().__init__(head)
        self.res_body = res_body

    def to_json_dict(self):
        """Convert the payload object to dictionary"""
        resp = self.head.to_json_dict()
        if self.res_body is not None:
            # Merging the two dictionaries
            resp = resp | self.res_body
        return resp

    def __str__(self):
        return f"{str(super())} - resp: '{self.res_body}'"


def try_getting_uuid_from_malformed_message(message):
    """Try (if possible) to extract at least the 'uuid' from a malformed payload"""
    str_message = str(message)
    uuid = None
    uuid_pos = str_message.find("uuid")
    # If "uuid" field is present
    if uuid_pos > 0:
        try:
            comma_pos = str_message.find(",", uuid_pos)
            uuid_str = str_message[uuid_pos-1:comma_pos]
            uuid_dict = json.loads("{" + uuid_str + "}")
            uuid = uuid_dict["uuid"]
        except Exception as exc:
            getLogger().debug("Failed to recover uuid. Something is wrong in payload: %s", exc)
    return uuid
