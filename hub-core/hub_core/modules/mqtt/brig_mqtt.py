"""This module is intended to manage MQTT messages for Collectief project. Refer to BRiG technical specification
for more details"""
import json
import time
from datetime import datetime, timezone
from logging import getLogger
from paho.mqtt.client import Client, MQTT_ERR_SUCCESS
from modules.configuration.cfg_mqtt import MqttConfig

COLLECTIEF_BRIG_STATUS_TOPIC = 'collectief/%s/brig_mb/brig_mb/diag/event'


class MqttClient:
    """Hub Core MQTT Client Class"""
    _instance = None

    def __init__(self, client_name):
        if MqttClient._instance is not None:
            raise Exception("Mqtt Client object already created")
        MqttClient._instance = self
        self._mqtt_cfg = MqttConfig()
        self.name = client_name
        self.host = self._mqtt_cfg.broker_ip
        self.pwd = self._mqtt_cfg.pwd
        self.active = False
        self._reconnecting = False
        self.client = Client()
        last_will_msg = {"status": "ungracefully disconnected"}
        self.client.will_set(COLLECTIEF_BRIG_STATUS_TOPIC % self.name, str(last_will_msg), 1, True)
        self.client.on_connect = self.on_connect
        self.client.on_disconnect = self.on_disconnect
        self.client.on_connect_fail = self.on_connect_fail
        self.client.on_subscribe = self.on_subscribe
        self.client.on_unsubscribe = self.on_unsubscribe
        self.client.on_message = self.on_message
        self.client.on_publish = self.on_publish
        # self.client.on_log = on_log # Useful for debug
        self.pending_subscriptions = []
        self.requested_subscriptions = []
        self.active_subscriptions = []
        self.pending_pub_callbacks = []
        self.custom_disconnect_callback = None

    @staticmethod
    def get_instance() -> "MqttClient":
        """Get the MqttClient Singleton instance"""
        return MqttClient._instance

    def set_custom_msg_callback(self, topic, callback):
        """Add a new subscription with an associated callback"""
        self.client.message_callback_add(topic, callback)
        if self.active:
            self.subscribe(topic)
        else:
            self.pending_subscriptions.append(topic)  # qos always 1 in this implementation...

    def connect(self):
        """Try to connect to MQTT broker"""
        self.client.username_pw_set(self.name, self.pwd)
        self.client.connect_async(self.host)
        self.client.loop_start()

    def disconnect(self, reason=None):
        """Disconnect from MQTT broker"""
        self.active = False
        msg = {"status": "gracefully disconnected", "reason": reason if reason is not None else "not specified",
               "ts": datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S+00:00')}
        self.client.publish(COLLECTIEF_BRIG_STATUS_TOPIC % self.name, str(msg), qos=1, retain=True)
        time.sleep(1)
        self.client.disconnect()

    def subscribe(self, topic, qos=1):
        """Subscribe to a new MQTT topic"""
        result = self.client.subscribe(topic, qos=qos)
        if result[0] == MQTT_ERR_SUCCESS:
            self.requested_subscriptions.append((result[1], topic))
        else:
            raise Exception("Mqtt subscription failed")

    def publish(self, topic, payload):
        """Publish new MQTT message and return the message id"""
        msg_info = self.client.publish(topic, json.dumps(payload, default=str), qos=1, retain=False)
        return msg_info.mid

    def disable_last_will(self):
        self.client.will_clear()

    def on_connect(self, client, userdata, flags, rc):
        """Successfull connection callback"""
        if self._reconnecting:
            self._reconnecting = False
            getLogger().warning("Reconnected to MQTT broker %s" % self.host)
        else:
            getLogger().info("Connected to MQTT broker %s" % self.host)
        self.active = True
        # Subscriptions
        if len(self.pending_subscriptions) > 0:
            for topic in self.pending_subscriptions:
                self.subscribe(topic)
            self.pending_subscriptions.clear()  # Do not check if the topic is successfully subscribed
        # Repeat subscriptions in case of disconnection
        for topic in self.active_subscriptions:
            self.subscribe(topic)
        status_msg = {"status": "connected", "ts": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S+00:00")}
        client.publish(COLLECTIEF_BRIG_STATUS_TOPIC % self.name, str(status_msg), qos=1, retain=True)

    def on_connect_fail(self, client, userdata, flags, rc):
        """Failed connection callback"""
        getLogger().info("Client %s failed to connect" % self.name)

    def on_message(self, client, userdata, message):
        """Received Message callback"""
        getLogger().debug(f"Unhandled message received by {self.name} on topic '{message.topic}' "
                          f"with payload: {message.payload}")

    def on_subscribe(self, client, userdata, mid, granted_qos):
        """Successfull subscribe callback"""
        for sub in self.requested_subscriptions:
            if sub[0] == mid:
                topic = sub[1]
                getLogger().debug(f"Successfully subscribed to {topic}")
                self.requested_subscriptions.remove(sub)
                self.active_subscriptions.append(topic)
                break

    def on_unsubscribe(self):
        """Successfull unsubscribe callback"""
        pass

    def on_disconnect(self, client, userdata, rc):
        """Disconnection callback"""
        getLogger().warning("Disconnected from MQTT broker %s" % self.host)
        if self.custom_disconnect_callback:
            self.custom_disconnect_callback()
        if self.active:
            self._reconnecting = True
            getLogger().debug("Re-connecting to MQTT broker %s..." % self.host)
            self.connect()

    def on_publish(self, client, userdata, mid):
        for pending_pub in self.pending_pub_callbacks:
            if pending_pub[0] == mid:
                func = pending_pub[1]
                self.pending_pub_callbacks.remove(pending_pub)
                func()

    def add_on_publish_callback(self, mid, func):
        self.pending_pub_callbacks.append((mid, func))

    def set_custom_disconnect_callback(self, func):
        self.custom_disconnect_callback = func

def on_log(client, userdata, level, buf):
    """MQTT Log callback"""
    getLogger().debug(f"{buf}")
