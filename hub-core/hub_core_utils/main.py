from hub_core_wrapper import HubCoreWrapper
import argparse
import json
import os

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-b', '--brig_id', type=str, default=None)
    parser.add_argument('-e', '--extra_entity', type=str, default=None)
    args = parser.parse_args()

    brig_id = args.brig_id
    extra_entities = args.extra_entities
    config_folder = '/app/conf' if os.path.exists('/.dockerenv') else "../hub_core/config"

    # import the broker information
    with open(f"{config_folder}/mqtt.json", "r") as f:
        mqtt_file = json.load(f)

    broker_ip = mqtt_file.get("broker_ip")
    broker_pwd = mqtt_file.get("mqtt_client_pwd")

    if brig_id is None:
        with open(f"{config_folder}/hub_core.json") as f:
            brig_id = json.load(f).get("FactorySN")

    hc = HubCoreWrapper(brig_id=brig_id, broker_ip=broker_ip, broker_pwd=broker_pwd)
    hc.connect("localhost", 1883)
    # hubcore.client.subscribe("#")
    entities = json.loads(extra_entities)
    entities = [entities] if isinstance(entities, dict) else entities

    for entity in entities:
        hc.add_entity(
            field_id=entity.get('field_id'),
            driver=entity.get('driver'),
            zone_id=entity.get('zone_id'),
            cfg=entity.get('cfg'),
            name=entity.get('name')
        )
