from paho.mqtt.client import Client
from enum import Enum
import json
import csv
from datetime import datetime
from uuid import uuid4
from paho.mqtt.packettypes import PacketTypes
from paho.mqtt.properties import Properties

DATA_FOLDER = "sphensor_data" # edit this folder if needed

def on_connect(client, userdata, flags, res_code):
    print(f"{client} has connected with result code {res_code}\n",
          f"flags: {flags}\n")


def on_subscribe(client, userdata, mid, granted_qos):
    print(f"Client {client} with userdata {userdata} subscribed with QoS {granted_qos}")


def on_message(client, userdata, message):
    print(f"Client {client} with userdata {userdata} sent the following response",
          f"at topic {message.topic}",
          f"{message.payload.decode('utf-8')}")


def on_publish(client, userdata, msg):
    print(f"Sent the message of id {msg} by client {client} as user {userdata}")


class root(Enum):
    SPHENSOR = "sphensor"
    COLLECTIEF = "collectief"


class ents(Enum):
    BRIG = "brig"
    BRIG_HC = "brig_hc"
    BRIG_SG = "brig_sg"
    BRIG_IG = "brig_ig"
    BRIG_ALGO = "brig_algo"
    FIELD = "field"
    ANY = "any"


class classes(Enum):
    SYSTEM = "system"
    REGISTRY = "registry"
    CONFIG = "config"
    DIAG = "diag"
    CMD = "cmd"


class trig(Enum):
    REQ = "req"
    ANS = "ans"
    EVENT = "event"


class HubCoreWrapper(object):
    """
    Wrapper for the hub core mqtt messaging component. Handles REGISTRY and FIELD_XXX requests

    Parameters
    __________

    """
    _levels = ['root', 'brig_id', 'ent', 'field_id', 'class', 'trig']
    _sphensor_levels = ['sphensor', 'brig_id', 'field_id', 'type']
    _valid_actions = {
        classes.SYSTEM: ["reset", "en"],
        classes.CONFIG: ["set", "get"],
        classes.REGISTRY: ["add", "update", "get", "remove", "list"],
        classes.CMD: ["output"],
        classes.DIAG: ["get", "reset", "event"]
    }
    _available_drivers = ["a2a", "sensibo", "sginterop", "sph_p"]

    def __init__(self, broker_ip, broker_pwd, brig_id, data_folder: str = None,
                 extra_entities: list[dict] | dict = None):
        self.client = Client()
        self.client.on_publish = on_publish
        self.client.on_connect = on_connect
        self.client.on_subscribe = on_subscribe
        self.client.on_message = on_message
        self._latest_msg_uuid = None
        self._subscribe_topic = f'collectief/{brig_id}/+/+/+/ans'

        data_folder = data_folder if data_folder else DATA_FOLDER
        # import the broker information
        # with open(f"{config_folder}/mqtt.json", "r") as f:
        #     mqtt_file = json.load(f)

        # self.broker_ip = mqtt_file.get("broker_ip")
        self.broker_ip = broker_ip
        # self.broker_pwd = mqtt_file.get("mqtt_client_pwd")
        self.broker_pwd = broker_pwd

        # import the brig id(class wide configuration from the file)
        # with open(f"{config_folder}/hub_core.json") as f:
        #     _brig_id = json.load(f).get("FactorySN")

        # self._brig_id = brig_id if brig_id else _brig_id
        self._brig_id = brig_id

        with open(f"{data_folder}/brig_meas_{self._brig_id}.csv", "r") as csvfile:
            automatic_entity_table = [r for r in csv.DictReader(csvfile)]

        if extra_entities:
            extra_entities = [extra_entities] if isinstance(extra_entities, dict) else extra_entities
            automatic_entity_table.extend(extra_entities)

        self.automatic_entity_table = automatic_entity_table

    @property
    def latest_msg_uuid(self):
        return self._latest_msg_uuid

    @latest_msg_uuid.setter
    def latest_msg_uuid(self, uuid):
        self._latest_msg_uuid = uuid

    def connect(self, broker_ip: str = None, port: int = 1883):
        if broker_ip is None:
            broker_ip = self.broker_ip

        if self.broker_pwd:
            self.client.username_pw_set(username=self._brig_id, password=self.broker_pwd)
        self.client.connect(host=broker_ip, port=port)

    def subscribe(self, topic:str=None):
        topic = topic if topic else self._subscribe_topic
        self.client.subscribe(topic)

    @staticmethod
    def _generate_head(prio=1, uuid_val: str = None, **kwargs):
        head = {"ts": datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3],
                "uuid": uuid_val if uuid_val else str(uuid4()),
                "prio": prio}
        if kwargs:
            head = {**head, **kwargs}
        return head

    def _generate_body(self, Class: classes, action: str, head: dict, params: dict):
        body = dict.fromkeys(["head", "action", "params"])
        if action in self._valid_actions[Class]:
            body["head"] = head
            body["action"] = action
            body["params"] = params
        return body

    def _generate_topic(self, Ent: ents, Ent_id: str, Class: classes, Root: root = root.COLLECTIEF, driver: str = None,
                        trigger: trig = trig.REQ):
        if Root == root.COLLECTIEF:
            if Ent == ents.FIELD and driver in self._available_drivers:
                Ent_id = f"{Ent}_{driver}"

            topic = f"{Root.value}/{self._brig_id}/{Ent.value}/{Ent_id}/{Class.value}/{trigger.value}"

            return topic
        else:
            raise NotImplementedError

    def _generate_payload(self, Class: classes, action: str, params: dict, head_args: dict = None):

        if head_args:
            head = self._generate_head(**head_args)
        else:
            head = self._generate_head()

        payload = self._generate_body(Class, action, head, params)
        return payload

    def _publish_message(self, topic, payload):
        response_topic = topic.replace('/req', '/'+trig.ANS.value)
        props = Properties(PacketTypes.PUBLISH)
        props.ResponseTopic=response_topic
        self.client.publish(topic, json.dumps(payload))

    def get_entity(self, buid: str | list[str]):
        # def add on_message routine that catches the answer and returns the entity
        params = {"buid": buid}
        topic = self._generate_topic(Ent=ents.BRIG, Ent_id="config", Class=classes.REGISTRY)
        payload = self._generate_payload(action="get", params=params, Class=classes.REGISTRY)

        self._publish_message(topic=topic, payload=payload)

    def update_entity(self, **params):
        topic = self._generate_topic(Ent=ents.BRIG, Ent_id="config", Class=classes.REGISTRY)
        payload = self._generate_payload(action="update", params=params, Class= classes.REGISTRY)

        self._publish_message(topic=topic, payload=payload)


    def add_entity(self, field_id: str, driver: str, zone_id: str, cfg: dict, name: str = None, head_args: dict = None):
        """
        Add a new entity
        :param field_id: Id of the entity according to the field system
        :param driver: driver to consider
        :param zone_id: zone ID
        :param cfg: configuration string
        :param name: name of the entity
        :param head_args:
        :return: None
        """
        # root/brig_id/ent/entity_id/class/trig
        # collectief/[brig_id]/brig/brig/registry/req
        cfg = json.loads(cfg) if isinstance(cfg,str) else cfg
        params = dict(field_id=field_id, driver=driver, zone_id=zone_id, cfg=cfg, name=name) if name\
                 else dict(field_id=field_id, driver=driver, zone_id=zone_id, cfg=cfg)
        topic = self._generate_topic(Ent=ents.BRIG, Ent_id="config", Class=classes.REGISTRY)
        payload = self._generate_payload(action="add", params=params, Class=classes.REGISTRY, head_args=head_args)
        print(topic)
        print(payload)
        self._publish_message(topic=topic, payload=payload)

    def list_entities(self, filter=''):
        """
        list hub core entities
        :param filter: filter with which to remove data
        :return:
        """
        params = {"filter": filter} if filter else '*'
        topic = self._generate_topic(Ent=ents.BRIG, Ent_id="config", Class=classes.REGISTRY)
        payload = self._generate_payload(Class=classes.REGISTRY, action="list", params=params)
        self._publish_message(topic=topic, payload=payload)

    def remove_entity(self, buid: str | list[str]):
        """
        Remove an entity
        :param buid: Id of the entity to remove
        :return: None
        """
        params = {"buid": buid}
        topic = self._generate_topic(Ent=ents.BRIG, Ent_id="config", Class=classes.REGISTRY)
        payload = self._generate_payload(action="remove", params=params, Class=classes.REGISTRY)
        self._publish_message(topic=topic, payload=payload)

    def en_entity(self, buid: str | list[str], enabled: bool):
        params = {"buid": buid, "enabled": enabled}
        topic = self._generate_topic(Ent=ents.BRIG, Ent_id="config", Class=classes.REGISTRY)
        payload = self._generate_payload(action="remove", params=params, Class=classes.REGISTRY)
        self._publish_message(topic=topic, payload=payload)

    # noinspection PyTypeChecker
    def initialize_brig(self, head_args=None):
    # collectief/[brig_id]/brig/brig/registry/req
        for item in self.automatic_entity_table:
            self.add_entity(field_id=item["field_id"], driver=item["driver"], zone_id=item["zone_id"], cfg=json.loads(item["cfg"]),
                            name=item["name"], head_args=head_args)

    def send_drv_command(self, drv, field_id: str, buid: int, type: str, head_args: dict = None, **other_params):
        # todo add check for commands in the driver?
        # root/brig_id/ent/entity_id/class/trig
        # collectief/[brig_id]/field_[driver name]/[entity id]/cmd/req
        params = {"buid": buid, "type": type}

        if other_params:
            params = {**params, **other_params}

        topic = self._generate_topic(Ent=ents.FIELD, Ent_id=field_id, Class=classes.CMD, driver=drv)
        payload = self._generate_payload(action="drv cmd", Class=classes.CMD, params=params, head_args=head_args)
        self._publish_message(topic=topic, payload=payload)
