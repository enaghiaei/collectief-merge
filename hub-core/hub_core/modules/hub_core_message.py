"""Hub Core Message module"""
from enum import Enum


class HubCoreMessage:
    """This class describes a generic Hub Core message.
    entity: the entity associated to this message
    msg_context: all the information related to how to deal with this message (e.g.: send over MQTT, save into db)
    drv_context: all the driver-dependant information
    prio: priority of the message (minimum = 0, maximum = 3)"""
    def __init__(self, target, msg_ctx=None, drv_ctx=None, prio=0):
        self.target = target
        self.msg_context = msg_ctx
        self.drv_context = drv_ctx
        self.prio = prio

    def __eq__(self, other):
        if isinstance(other, HubCoreMessage):
            return self.target == other.target and self.msg_context == other.msg_context \
                and self.drv_context == other.drv_context and self.prio == other.prio
        return False


class HubCoreMsgResult:
    """Hub Core Message Result Class"""
    def __init__(self, status=None, **kwargs):
        self.msg_status = status  # type: MessageStatus
        self.msg = kwargs.get("msg")  # type: str
        self.remove_list = kwargs.get("remove_list", [])


class MessageStatus(Enum):
    """Hub Core Message Status Enum"""
    ADD = 0
    DISCARD = 1
    OVERWRITE = 2


