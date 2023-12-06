"""Sphensor Interface Module"""
import json
from datetime import datetime, timedelta
from logging import getLogger
from driver.sph_p import SphensorEntity
from modules.configuration.cfg_abstract import AbstractConfig
from modules.database.entity_abstract import EntityStatus
from modules.database.measure import Measure
from modules.database.models import HubCoreMeasureData
from modules.diagnostic import Diagnostic
from modules.mqtt.brig_mqtt import MqttClient
from modules.registry import Registry
from modules.time_utilities import measuretime
from modules.mqtt.topic import HubCoreTopic
import traceback


class SphensorItf:
    """This class is an interface useful to "sniff" and convert data published by SphensorGateway over MQTT on
     "sphensor" topic"""
    def __init__(self):
        self._diag = None
        self._registry = None
        self._mqtt = None
        json_cfg = AbstractConfig.load_json_from_file('config/sphensor.json')
        self.sub_topics = json_cfg.get("sub_topics")
        self.send_topic = json_cfg.get("send_msg_topic")
        self.send_saved_msg = json_cfg.get("send_saved_msg", False)
        self.send_unsaved_msg = json_cfg.get("send_unsaved_msg", False)

    def activate(self):
        """Activate the sphensor interface by subscribing on MQTT topics"""
        self._diag = Diagnostic.get_instance()
        self._registry = Registry.get_instance()
        self._mqtt = MqttClient.get_instance()
        for topic in self.sub_topics:
            self._mqtt.set_custom_msg_callback(topic % self._mqtt.name, self.sph_callback)

    # @measuretime
    def sph_callback(self, client, userdata, message):
        """This method takes Sphensor MQTT message, extrapolates measures in Collectief format according to configurations,
         and save them into the internal database"""
        try:
            topic = HubCoreTopic.create_from_string(message.topic)
            # Grouped Inst + Inst
            if topic["message_type"] in ["grouped_inst", "inst"]:
                entity = self._registry.get_entity(driver="sph_p", field_id=topic['sph_id'])  # type: SphensorEntity
                if entity:
                    entity.unsol_msg += 1
                    if entity.enabled:
                        getLogger().info(f"Received message from sphensor {topic['sph_id']}")
                        entity.status = EntityStatus.ALIVE
                        errors_in_measures = False
                        if len(entity.measures) > 0:
                            saved_meas = 0
                            measures = []
                            for meas in entity.measures:  # type: Measure
                                meas_data, failed = extract_data_from_payload(meas, message.payload)
                                # type: HubCoreMeasureData
                                if meas_data:
                                    last_saved_ts = meas.additional_cfg.get("last_saved_ts")
                                    period = meas.additional_cfg.get("period", 0)
                                    fmt = "%Y-%m-%d %H:%M:%S"
                                    if last_saved_ts is None or datetime.strptime(last_saved_ts, fmt) + \
                                            timedelta(minutes=period) <= datetime.strptime(meas_data.dt, fmt):
                                        self._registry.save_new_measure_data(meas_data)
                                        # update context if the measure is correctly saved
                                        meas.additional_cfg["last_saved_ts"] = meas_data.dt
                                        saved_meas += 1
                                        if self.send_saved_msg:
                                            msg = meas_data.to_dict()
                                            msg["tag"] = meas.tag
                                            measures.append(msg)
                                    else:
                                        # TODO: al posto di scartare il dato va usato per creare media mobile
                                        if self.send_unsaved_msg:
                                            msg = meas_data.to_dict()
                                            msg["tag"] = meas.tag
                                            measures.append(msg)
                                elif failed:
                                    errors_in_measures = True
                            if len(measures) > 0:
                                topic = self.send_topic % (self._mqtt.name, entity.field_id)
                                self._mqtt.publish(topic, measures)
                            entity.meas_count += saved_meas
                            if errors_in_measures:
                                entity.errors += 1
                        else:
                            getLogger().warning(f"This sphensor has no measure associated ({str(entity)})")
                    else:
                        getLogger().info(f"Received message from sphensor {topic['sph_id']} (disabled)")
                else:
                    self._diag.add_unregistered_entity(topic.get('sph_id'), "sph_p")
                    getLogger().info(f"Received message from sphensor {topic['sph_id']} (not registered)")

            # Diagnostic
            elif topic["message_type"] == "diagnostic":
                # getLogger().debug(f"Sph msg: {message.payload} - topic: {message.topic}")
                # es -> b'{"battery": 100, "memory_used": 0, "error_rate": 28, "uptime": "7 days, 0:04:05",
                #  "radio": {"rloc": "EC09", "parent_rloc": "EC00", "in_quality": 3, "in_rssi": -50, "out_quality": 3,
                #  "out_rssi": -50, "tx_power": 0}}'
                pass

            # Visibility
            elif topic["message_type"] == "visibility":
                # es -> b'{"status": "missing", "timestamp": "2023-03-30 08:37:28"}'
                entity = self._registry.get_entity(driver="sph_p", field_id=topic['sph_id'])  # type: SphensorEntity
                if entity:
                    entity.unsol_msg += 1
                    if entity.enabled:
                        sph_status = json.loads(message.payload)
                        sph_status = sph_status.get("status")
                        if sph_status == "active":
                            entity.status = EntityStatus.ALIVE
                        elif sph_status == "missing":
                            entity.status = EntityStatus.MISSING
                        elif sph_status == "lost":
                            entity.status = EntityStatus.LOST
                        elif sph_status == "dead":
                            entity.status = EntityStatus.DEAD
                # getLogger().debug(f"Sph msg: {message.payload} - topic: {message.topic}")

            # Status
            elif topic["message_type"] == "status":
                # getLogger().debug(f"Sph msg: {message.payload} - topic: {message.topic}")
                if topic["sph_id"] == "hub":
                    getLogger().debug(f"Sph msg: {message.payload} - topic: {message.topic}")
                    status = message.payload.decode("utf-8")
                    if status != "connected":
                        getLogger().warning(f"Sphensor Gateway status: {status}")
                        # TODO inviare msg MQTT di diag -> come notifico che torna connected?
                else:
                    # es -> b'{"battery": 100, "rssi": -64, "link_quality_in": 3, "link_quality_out": 3,
                    #  "battery_voltage": 5.0}'
                    pass
            else:
                # getLogger().debug(f"Sph msg: {message.payload} - topic: {message.topic}")
                getLogger().warning(f"Unhandled message: sph_id '{topic['sph_id']}', data type '{topic['message_type']}'")
        except Exception as exc:
            getLogger().error(f"sph_itf: {type(exc).__name__} - {exc.args[0]}")
            getLogger().error(f"Traceback\n{traceback.format_exc()}")
            # TODO: inviare messaggio MQTT di unhandled error


def extract_data_from_payload(measure, sph_payload) -> tuple[HubCoreMeasureData, bool]:
    """This method creates "HubCoreMeasureData" objects extracting data from the sphensor JSON payload.
    Payload is filtered by sensor_type and channel_index according to "Measure" object tag
    It returns the extrapolated list of HubCoreMeasureData"""
    measure_data = None
    sph_dict = json.loads(sph_payload)
    if type(sph_dict) is not list:  # Convert sph_dict in a list of dicts
        sph_dict = [sph_dict]
    # Search by measure tag into sphensor data. E.g: tag = co2_0
    item = next((itm for itm in sph_dict if f"{itm['sensor_type']}_{itm['channel_index']}" == measure.tag), None)
    error = False
    if item and item["result"] == 'ok':
        measure_data = HubCoreMeasureData(measure_id=measure.id, dt=item["timestamp"], value=item["value"])
    else:
        error = True
    return measure_data, error

