#!/usr/bin/python
#
# Sphensor MQTT client to SQLite data logger
#
# By Virtual Manufacturing Sweden AB
# Author: Daniel Nilsson, (Daniel.Nilsson@lnu.se)
# 
# Based on the script:
# "Sphensor Python Client Tutorial" created by LSI Lastem - 2022, Paolo Treu (paolo.treu@lsi-lastem.com)

import datetime
import os
from argparse import ArgumentParser
from json import loads
from os import mkdir
from os.path import join, isdir, isfile
from threading import Lock
import time
import json
from paho.mqtt.client import Client, MQTTMessage

# import sqlite3
from models import Sphensor
# import .env
from dotenv import load_dotenv

# measure lookup table
SENSOR_CHANNEL_LOOKUP_TABLE = [
    # sensor_type,    channel,   name,          var,         kind,     is_external,  is_calibrated
    ['battery',       '0',       'Battery (V)', 'Battery_V', 'Voltage', 0,           0],
    ['uva', '0', 'UVA (V)', 'UVA_V', 'Voltage', 0, 0],
    ['uva', '1', 'UVA', 'UVA', 'Count', 0, 1],
    ['press', '0', 'Cell temperature', 'Cell_temperature', 'Temperature', 0, 0],
    ['press', '1', 'Atm. pressure', 'Atm_pressure', 'Pressure', 0, 0],
    ['t_rh', '0', 'Air temperature', 'Air_temperature', 'Temperature', 0, 0],
    ['t_rh', '1', 'Relative humidity', 'Relative_humidity', 'Humidity', 0, 0],
    ['lux1', '0', 'Lux 1', 'Lux_1', 'Lux', 0, 1],
    ['lux2', '0', 'Lux 2', 'Lux_2', 'Lux', 0, 1],
    ['lux3', '0', 'Lux 3', 'Lux_3', 'Lux', 0, 1],
    ['lux4', '0', 'Lux 4', 'Lux_4', 'Lux', 0, 1],
    ['lux5', '0', 'Lux 5', 'Lux_5', 'Lux', 0, 1],
    ['ticks', '0', 'Boot seconds', 'Boot_seconds', 'Time', 0, 0],
    ['ticks', '1', 'Work seconds', 'Work_seconds', 'Time', 0, 0],
    ['t_ext_1', '0', 'Ext. temperature 1', 'Ext_temperature_1', 'Temperature', 1, 0],
    ['t_ext_1', '0', 'Ext. temperature 1', 'Ext_temperature_1', 'Temperature', 1, 0],
    ['co2', '0', 'BAR', 'BAR', 'Pressure', 0, 0],
    ['co2', '1', 'CO2', 'CO2', 'CO2', 0, 0],
    ['tvoc', '0', 'CO2-EQ', 'CO2EQ', 'CO2', 0, 0],
    ['tvoc', '1', 'TVOC', 'TVOC', 'TVOC', 0, 0],
    ['pm', '0', 'PM 1 (MASS)', 'PM_1_MASS', 'Mass', 0, 0],
    ['pm', '1', 'PM 2.5 (MASS)', 'PM_25_MASS', 'Mass', 0, 0],
    ['pm', '2', 'PM 4 (MASS)', 'PM_4_MASS', 'Mass', 0, 0],
    ['pm', '3', 'PM 10 (MASS)', 'PM_10_MASS', 'Mass', 0, 0],
    ['pm', '4', 'PM 0.5 (COUNT)', 'PM_05_COUNT', 'Count', 0, 0],
    ['pm', '5', 'PM 1 (COUNT)', 'PM_1_COUNT', 'Count', 0, 0],
    ['pm', '6', 'PM 2.5 (COUNT)', 'PM_25_COUNT', 'Count', 0, 0],
    ['pm', '7', 'PM 4 (COUNT)', 'PM_4_COUNT', 'Count', 0, 0],
    ['pm', '8', 'PM 10 (COUNT)', 'PM_10_COUNT', 'Count', 0, 0],
    ['pm', '9', 'TYP PART SIZE', 'TYP_PART_SIZE', 'Size', 0, 0],
]

sqldata = []

SENSOR_CHANNEL_LOOKUP_DICT = {}
for row in SENSOR_CHANNEL_LOOKUP_TABLE:
    row_measure_id = "%s/%s" % (row[0], row[1])
    SENSOR_CHANNEL_LOOKUP_DICT[row_measure_id] = row


def lookup_measure(sensor_type, channel_index):
    measure_id = "%s/%s" % (sensor_type, channel_index)
    if measure_id in SENSOR_CHANNEL_LOOKUP_DICT:
        return SENSOR_CHANNEL_LOOKUP_DICT[measure_id]
    else:
        return None


# we want to parse an input string in the format: host[|username[|password]]
def parse_host_info(host_info):
    print(host_info["host"])
    host = host_info["host"] if not "" or "none" or None else None
    username = host_info["username"] if not  "" or "none" or None else None
    password = host_info["password"] if not "" or "none" or None else None

    return host, username, password


# common instance to receive data from every client
class SphManager(object):
    def __init__(self):
        self.skip_errors = False
        self.debug = True
        self.filter_hub = []
        self.filter_sensor = []
        self.clients = []  # type: list[SphClient]  # list of clients
        self.data_lock = Lock()  # global lock to avoid writing the same file at the same time (could be improved in different ways)

    def add_client(self, host, username=None, password=None):
        if (username and password) != (None or 'none'):
            client = SphClient(self, host, username, password)
        else:
            client = SphClient(self, host)
        self.clients.append(client)
        return client

    def start(self):
        for client in self.clients:
            client.start()

    def stop(self):
        for client in self.clients:
            client.stop()

    def on_data_received(self, timestamp, hub_serial, sensor_serial, grouped_inst):

        if len(self.filter_hub) != 0 and hub_serial not in self.filter_hub:
            return  # skip message

        if len(self.filter_sensor) != 0 and sensor_serial not in self.filter_sensor:
            return  # skip message

        '''Get the data base path relative to the current directory,
         from te enviroment variable & pass it to the instance of the db class.'''
        db_path = os.getenv('DB_PATH')
        db_table_name = os.getenv('TABLE_NAME')
        db = Sphensor(db_path, db_table_name)

        # print("filter list:", self.filter_hub, self.filter_sensor)
        # print('Message from %s/%s' % (hub_serial, sensor_serial))
        
        # we expect here only data messages of type grouped_inst (grouped instantaneous data)
        with self.data_lock:  # enter mutex to sync incoming messages
            for item in grouped_inst:
                if self.skip_errors and item['result'] != 'ok':
                    continue  # skip errors - save only correct values
                measure_info = lookup_measure(item['sensor_type'], item['channel_index'])
                if measure_info is not None:
                    sensor_type, channel, measure_name, measure_var, measure_kind, is_external, is_calibrated = measure_info
                    measure_value = item['value'] if item['result'] == 'ok' else 'ERROR'
                    sensor_data = (item['timestamp'], sensor_type, channel, measure_name, measure_var, measure_kind, is_external, is_calibrated, measure_value, int(sensor_serial))
                    sqldata.append(sensor_data)
                    if self.debug:
                        print('\t%s\t%s\t%s' % (item['timestamp'], measure_name, measure_value))
            # print("SQL_Data: ", sqldata) #Uncomment to print the data on arrival
            db.insert_many(sqldata) #Inserts multiple rows into the db
            db_row_limit = os.getenv('TABLE_MAX_ROWS') #Gets the row limit from the .env file
            db.limit_table_trigger(db_row_limit) #Sets the maximum allowed number of rows in the table
            db.close()


# one client for each connection string
class SphClient(object):
    def __init__(self, manager=None, host=None, username=None, password=None):
        self.manager = manager  # type: SphManager
        self.host = host
        self.username = username
        self.password = password
        self.active = False
        if manager and host != None or 'none':
            self.client = Client()
            self.client.on_connect = self.on_connect
            self.client.on_disconnect = self.on_disconnect
            self.client.on_message = self.on_message

    def on_connect(self, client, userdata, flags, rc):
        self.client.subscribe('sphensor/#', qos=1)
        if self.manager.debug:
            print("Connected to %s" % self.host)

    def on_disconnect(self, client, userdata, rc):
        if self.manager.debug:
            print("Disconnected from %s" % self.host)
        if self.active:
            self.client.reconnect()

    def on_message(self, client, userdata, message):
        """

        :type message: MQTTMessage
        """

        try:
            timestamp = time.time() # when the message was received
            # topic is something like this: sphensor/22040368/22050342/grouped_inst
            chunks = message.topic.split('/')
            hub_serial = chunks[1]  # serial number of the border router
            sensor_serial = chunks[2]  # serial number of the sensor or 'hub' if the message arrives from the border router
            action = "/".join(chunks[3:])  # type of message

            message_payload = message.payload.decode('utf8')  # messages are all in JSON or plain text format (utf8 encoding)

            if action == 'grouped_inst':
                #print('Grouped_inst recieved!', message_payload)
                self.manager.on_data_received(timestamp, hub_serial, sensor_serial, loads(message_payload))


        except:
            print('err, on message')

    def start(self):
        if not self.active:
            self.active = True
            if self.username:
                self.client.username_pw_set(self.username, self.password)
            self.client.connect_async(self.host)
            self.client.loop_start()

    def stop(self):
        if self.active:
            self.active = False
            self.client.disconnect()
            self.client.loop_stop()

def loop():
    # Load the enviroment variables from the .env file and make them accessible
    load_dotenv()

    # we use a centralized instance to converge all data in the same place
    manager = SphManager()

    # pass parameters to instance
    print(os.getenv('FILTERS'))
    filters = json.loads(os.getenv('FILTERS')) # Load Data filter
    if filters['hubs'][0] != 'none': 
        manager.filter_hub = filters['hubs']
    print("manager.filter_hub: ", manager.filter_hub)
    if filters['sensors'][0] != 'none':     
        manager.filter_sensor = filters['sensors']
    print("manager.filter_sensor: ", manager.filter_sensor)
    manager.debug = os.getenv('DEBUG')
    print("Debug: ", os.getenv('DEBUG'))
    manager.skip_errors = os.getenv('SKIP_ERRORS')

    # for each connection string we parse client info and create a new client
    print(os.getenv('HOST'))
    brokers = json.loads(os.getenv('HOST'))
    for host_info in brokers:
        host, username, password = parse_host_info(host_info)
        manager.add_client(host, username, password)

    # start all the instances
    manager.start()

    # wait user to stop
    try:
        input('Press ENTER to stop\n')
    except:
        pass
    
    # stop all the instances
    manager.stop()

if __name__ == "__main__":
    loop()