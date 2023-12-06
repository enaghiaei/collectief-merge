from dotenv import load_dotenv
import sqlalchemy
from db.models import *
import json
from mqtt.client import client_gen
from on_msg_conn.sphensor import sphensor_data_to_db #this is for training
import os

# import the configuration and get database parameters, keep in mind these are the database credentials
load_dotenv("../.env")

username = os.environ['USERNAME']
password = os.environ['PASSWORD']
hostname = os.environ['HOSTNAME']
port = os.environ['PORT']
database = os.environ['DATABASE']

# connect to the database
database_address = "mariadb+mariadbconnector://{username}:{password}@{hostname}:{port}/{database}".format(username=username, password=password, hostname=hostname, port=port, database=database)
#connect to database
engine = sqlalchemy.create_engine(database_address)
engine.connect()

# create session
Session = sqlalchemy.orm.sessionmaker(engine)
Session.configure(bind=engine)
session = Session()

# Client.loop_start()

# print(database_address)

if __name__=="__main__":
    iGateway = iGateway()
    iGateway.start()
