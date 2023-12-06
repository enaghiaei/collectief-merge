
import requests
import paho.mqtt.client as mqtt
import json
import argparse
from time import time
from itertools import combinations
from enum import Enum

ANAGRAPHICS = ['ID','ZoneLetter','Description1','Description2']


RELEVANT_DATA = {
    'T': ANAGRAPHICS + ['DeltaTemperature','OutdoorTemperature'],
    'M': ANAGRAPHICS + ["MeasureType","MesureTypePerHour","Consumption_Last2min","Consumption_CurrentHour","Consumption_LastHour", "Current_MaxValue"],
    'A': ANAGRAPHICS + ["AlarmActive"]
}

class ValidDescStrings(Enum):
    Description1 = "Description1"
    Description2 = "Description2"

class ValidZones(Enum):
    A = "A"
    T = "T"
    M = "M"


def getzone(zone: ValidZones):
    url = "https://v2.emportal.no/api/2/Service/GetMany/{a}".format(a=zone)
    data = requests.get(url, headers={}, data={})
    return data.json()


def dataforzones(data):
    zon = RELEVANT_DATA[data['ZoneLetter']]


    trial = {att: data[att] if type(data[att]) != float else round(data[att], 3) for att in zon}

    # trial = {att: data[att] for att in zon}
    return trial

def on_connect(client, userdata, flags, rc):
    """ Called when the Connector connects to the MQTT broker. Required by paho-mqtt.
    """

    client = mqtt.Client()
    client.on_connect = on_connect
    client.connect(args.mqtt_host, args.port, args.keep_alive)
    print("Connected with result code " + str(rc))

# TODO generate spatial distinctions to retrieve the necessary rooms case by case. Share it by confidential channels to preserve privacy

if __name__=="__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument('--mqtt_host',
                        default='93.41.220.38',
                        help='Host where the MQTT broker has been installed')
    parser.add_argument('--port',
                        default=1883,
                        help='Port exposed by the MQTT broker service')
    parser.add_argument('--keep_alive',
                        default=45,
                        help='Keep alive value for MQTT messages')
    parser.add_argument('--pub_topic',
                        default='test',
                        help='Topic on which MQTT messages will be published')
    parser.add_argument('--delay',
                        default=5,
                        help='Delay between the generation of two messages')
    parser.add_argument('--qos',
                        default=0,
                        help='Desired QoS achieved by the MQTT service')
    parser.add_argument("--zoness", type=list, default=['T', 'M/1'])

    args = parser.parse_args()


    client = mqtt.Client()
    client.on_connect = on_connect
    client.connect(args.mqtt_host, args.port, args.keep_alive)
    #print(bool(args.zoness))
    if args.zoness:
        while True:
            for zone in args.zoness:
                trial = getzone(zone)
                # letter = zone[0]
                result = args.pub_topic + '/' + zone[0]
                # print(result)
                # result = "/".join([args.pub_topic,letter])
                # print(result)
                for data in trial:
                    instance = dataforzones(data)
                    client.publish(result,
                              json.dumps(instance),
                              qos=args.qos,
                              retain=False)
                    print(json.dumps(instance, indent=2))
            time.sleep(2)

