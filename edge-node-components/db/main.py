from version_manager import VersionManager
from models import ExtendedBase
from sqlalchemy import create_engine
import os
import json
from time import sleep
from pathlib import Path
from logging import getLogger
import traceback
import argparse
import sys
from hub_core_wrapper import HubCoreWrapper

# def initialize_db():
#     pass

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument('-c', '--configuration', help="Basic Configuration Folder", default='/app/conf')
    ap.add_argument('-i', '--init_entities', help="Initialize BRIG for sphensor retrieval",
                    action=argparse.BooleanOptionalAction, default=True)
    ap.add_argument('-d', '--data', help="Entity Data Folder", default="/app/data")
    args = ap.parse_args()
    conf_folder: str = args.configuration
    data_folder: str = args.data
    init_entities: bool = args.init_entities

    if not os.path.exists("/.dockerenv"):
        from dotenv import load_dotenv
        dotenv_path = Path('../.env')
        load_dotenv(dotenv_path=dotenv_path)

    mqtt_password = os.environ.get("MQTT_PASSWORD")
    host = os.environ.get("DB_HOST") if os.path.exists("/.dockerenv") else "localhost"
    BRiG_serial = os.environ.get("BRIG_ID")

    driver = os.environ.get("DB_CONNECTOR", "mariadb+mariadbconnector")
    user = os.environ.get("ROOT_USERNAME")
    password = os.environ.get("MYSQL_ROOT_PASSWORD")
    port = os.environ.get("DB_PORT")
    dbname = os.environ.get("MYSQL_DATABASE")
    db_url = f'{driver}://{user}:{password}@{host}:{port}/{dbname}'

    getLogger().debug(db_url)
    print("Initializing engine and connection from the database")
    # engine = create_engine(db_url)
    #
    # ExtendedBase.metadata.create_all(engine)
    mqtt_host = os.environ.get("MQTT_HOST", 'localhost')
    mqtt_port = int(os.environ.get("MQTT_PORT", 1883))
    print("Initializing migration manager")
    versionmanager = VersionManager(db_url=db_url, brig_id=BRiG_serial,
                                    alembic_cfg='migration/alembic.ini', directory="migration/alembic_data")

    versionmanager.init_migration_environment()
    n = 1
    while True:
        try:
            versionmanager.connect(mqtt_host, mqtt_port, mqtt_password)
            break
        except TimeoutError:
            n *= 2
            sleep(n)
            print(f"retrying in {n} seconds")

    current_absolute_path = os.path.dirname(os.path.abspath(__file__))
    relative_split_path = ['migration', 'alembic_data']

    if sys.platform == 'linux':
        sep = '/'
    else:
        sep = '\\'

    current_absolute_split_path = current_absolute_path.split(sep)

    for i, folder in enumerate(current_absolute_split_path):
        try:
            if folder is relative_split_path[0]:
                folder = relative_split_path.pop()
                current_absolute_split_path = current_absolute_path[:i]
                current_absolute_split_path.append(folder)
        except IndexError:
            break

    if relative_split_path is not []:
        current_absolute_split_path = current_absolute_split_path + relative_split_path

    current_absolute_path = sep.join(current_absolute_split_path)

    print("Current path is", versionmanager.config.get_main_option('script_location'))
    versionmanager.config.set_main_option('script_location', current_absolute_path)

    print("Setting path to", versionmanager.config.get_main_option('script_location'))
    print("Connection to the database succeeded, upgrading to head version")

    is_not_updated = versionmanager.check_current_revision()
    if is_not_updated:
        print("UPDATING")
        versionmanager.migrate_actions["upgrade"](versionmanager.config, "head")

    if init_entities:
        data_folder = '/app/data' if os.path.exists("/.dockerenv") else \
            os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+"/data/sphensor_data"

        hc = HubCoreWrapper(brig_id=BRiG_serial, broker_ip=mqtt_host, broker_pwd=mqtt_password, data_folder=data_folder)
        hc.connect()
        sleep(30)  # FIXME find a way to detect whether the hub_core has started
        hc.initialize_brig()

    # try:
    #     versionmanager.subscribe()
    # except Exception as e:
    #     print(f"Exception found: {e}\nTraceback:\n{traceback.format_exc()}")

