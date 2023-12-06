import asyncio
from datetime import datetime
from uuid import uuid4
from paho.mqtt.client import Client
import json
from threading import Event
import time
import csv
# import sqlalchemy
# from sqlalchemy import text


message_received = Event()
def on_message(client, userdata, message):
    payload = json.loads(message.payload.decode('utf-8'))
    print(f"Message from {client}: {message.payload.decode('utf-8')}\nThe topic is {message.topic}")
    global MESSAGE_MEMORY_HOLDER
    data = [{'tag': d['sensor_type']+'_'+str(d['channel_index'])} for d in payload]
    MESSAGE_MEMORY_HOLDER = data
    print(MESSAGE_MEMORY_HOLDER)
    client.unsubscribe(message.topic)


def on_connect(client, userdata, flags, rc):
    """ Called when the Connector connects to the MQTT broker. Required by paho-mqtt.
    """
    print("Connected with result code " + str(rc))


def on_publish(client, userdata, mid):
    print(f"sending the message n. {mid}")


def on_subscribe(client, userdata, mid, granted_qos):
    print(f"Subscribed with QoS {granted_qos} with topic ")


def generate_head(prio=1):
    return {"ts": datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3], "uuid": str(uuid4()), "prio": prio}


class EntityManager:
    """
    it contacts the hub core using the Sphensor messaging method and adds all the sensors according to the
    asset schematic, as well as any measurement/tag

    """
    # class attributes
    _client = Client(client_id="testAdder", reconnect_on_failure=True)
    _client.on_connect = on_connect
    _client.on_publish = on_publish
    _client.on_subscribe = on_subscribe
    _client.on_message = on_message

    def __init__(self, host : str = "localhost", port : int = 1883):
        with open("../hub_core/config/hub_core.json", "r") as j:
            hub_core_config = json.load(j)
        self.serialNumber = hub_core_config["FactorySN"]
        self._client.connect(host=host, port=port)

    def client_loop_stop(self):
        self._client.loop_stop()

    def generate_collectief_topic(self, ent_id, ent="brig", ent_class="registry", trig="req"):
        return f"collectief/{self.serialNumber}/{ent}/{ent_id}/{ent_class}/{trig}"

    def generate_sphensor_topic(self, field_id) -> str:
        return f"sphensor/{self.serialNumber}/{field_id}/grouped_inst"

    def subscribe(self,field_id):
        self._client.subscribe(self.generate_sphensor_topic(field_id))
        self._client.loop_start()

    def add_sphensor_entity(self, entity_params):
        """publish entity to the database"""
        topic = self.generate_collectief_topic(entity_params["field_id"])
        action = "add"
        self._client.publish(topic=topic,
                             payload=json.dumps({
                                 "head": generate_head(),
                                 "action": action,
                                 "params": entity_params
                             }))

    def list_entities(self, query="*"):
        topic = self.generate_collectief_topic()
        action = "list"
        self._client.publish(topic=topic,
                             payload=json.dumps({
                                 "head": generate_head(),
                                 "action": action,
                                 "params": query
                             }))

    def remove_sphensor_entity(self, entity_params):
        pass


def sphensor_entity_initializer(**kwargs) -> dict:
    return dict(driver='sph_p', field_id=kwargs['field_id'], cfg={}, name=f"sphensor unit {kwargs['field_id']} in {kwargs['zone_id']}", zone_id=kwargs['zone_id'])


def collectief_entity_initializer(**kwargs) -> dict:
    return dict(driver=kwargs["driver"], field_id=kwargs['field_id'], cfg=kwargs['cfg'], name=kwargs['name'])


if __name__ == "__main__":
    MESSAGE_MEMORY_HOLDER = {}

    with open("../hub_core/config/hub_core.json", "r") as hc:
        brig_id = json.load(hc)["FactorySN"]

    entityManager = EntityManager()






