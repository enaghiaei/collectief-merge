"""
this is the class implementation for the edge node,
taking the functions previously implemented for the g2elab test and generalizing
them for working in tandem with the edge node database and a mixed number
of sensors

==============================================================================
RL-DSM [Ver 12-EN - April 2023]
Initial implementation, generalization and adaptation of what has already been done

==============================================================================

PEP8 (https://pep8.org/)
Naming style: 1> lowercase (for single word names)
              2> mixedCase (by initial lowercase character!) Priority!
              3> CapitalizedWords (or CapWords, CamelCase5) If neccessary!
              4> lower_case_with_underscores (function names)

Types of data:
    1. Monitored Data: Input of the algorithm from sesors/simulation
    2. Control Data: Output of the algorithm to apply flexibility
    3. Stored Data: Historic measured/simulated values as the reference
"""
import json
import jsonschema
import os

from sqlalchemy import select
from sqlalchemy.orm.session import sessionmaker

from db.models import *


class Asset:
    curr_path = os.getcwd()

    _SENSOR_LEVELS = ['zone', 'type', 'driver', 'field_id', 'tag']  # TODO add the kwargs for getting all levels
    _ACTUATOR_LEVELS = ['zone', 'type', 'driver', 'field_id', 'tag', 'type']  # TODO handle it directly

    # Avoid hardcoding the schema for ease of maintenance if possible. keep it separate from the rest of the code
    _ASSETS_SCHEMA = ASSET_SCHEMA

    def __init__(self, algorithm: str = "rldsm", assets: dict = None):
        self.algorithm = algorithm
        result = self.check_asset_validity(assets)
        if result[0]:
            self.assets = assets
        else:
            raise jsonschema.exceptions.ValidationError(f"Please review the json schema, following error found:\n\n{result[1]}")
        # TODO determine if it useful for querying assets more easily instead of using static methods

    def __str__(self):
        return json.dumps(self.assets)

    def __eq__(self, other):
        return self.assets == other.assets

    def __repr__(self) -> str:
        return f'Asset(BrigID={self.assets.get("brigId")},' \
               f'building name={self.assets.get("building_name", "")},' \
               f'zones={[k for k in self.zones]}, algorithm={self.algorithm})'

    @classmethod
    def load_assets_from_file(cls, path: str, building: str, algorithm: str):
        """
        Constructor method to load the assets from the file, given a path for the methods
        :param path: file location of the asset, to be used on deployment stage
        :type path: str | Path
        :param building: building Id following the project
        :type building: str
        :param algorithm:
        :type algorithm:
        """
        with open(path) as f:
            assets = json.load(f).get(building, False)
        if assets:
            return cls(algorithm=algorithm, assets=assets)
        else:
            raise Exception("Missing building, please review the name")

    @classmethod
    def load_assets_from_dumped_json(cls, json_str: str, algorithm: str):
        """apply this in case of receiving remote json settings"""
        assets = json.loads(json_str)
        return cls(algorithm=algorithm, assets=assets)

    @classmethod
    def load_assets_from_db(cls, Session: sessionmaker, algorithm: str, *args):
        """
        session: sqlalchemy sessionmaker variable, alternative startup for already enstablished asset dictionary

        """
        with Session() as session:
            query = select(AlgoAssets).where(AlgoAssets.algo_type==algorithm)
            result = session.execute(query)
            result = [row for row in result]

    def seek_zone_by_name(self, zone_name: str):
        """
        seeks a zone by its full alphabetic name
        """
        for zone in self.zones:
            zone_assets = self.get_item('zones', zone)
            if zone_assets.get('zoneName', None) == zone_name:
                return zone_assets
            else:
                continue
        return False

    def upload_assets_to_db(self, session):
        """
        to upload the assets to the database, used for handling deployment
        """
        with session.Session() as session:
            # todo deal with "zoneless" assets
            assets = []
            for zone, item in self.assets.get("zones"):
                assets.append(AlgoAssets(zone_id=zone, zone_type=item["zoneType"], algo_type=self.algorithm, cfg=item))
            session.add_all(assets)
            session.commit()

    def flatten_item(self, *item_path, **kwargs):
        """
        flatten an item selection to a nested key format and its values
        """
        # create a copy of the item
        item = self.get_item(*item_path)
        flattened_item = flatten_item(item, **kwargs)
        return flattened_item

    @classmethod
    def check_asset_validity(cls, assets: dict):
        """
        this checks only if the schema is valid, it does not perform any query
        Recommended to hold off this functionality until the system is defined
        """
        try:
            jsonschema.validate(instance=assets, schema=cls._ASSETS_SCHEMA)
            return True, "OK"
        except jsonschema.exceptions.ValidationError as e:
            print(f"JSON data does not follow the schema: {e}")
            return False, e

    @property
    def zones(self):
        return list(self.assets.get("zones"))

    def get_item(self, *keys) -> Any:
        """
        get any item at any level following the structure
        zone/[sensors | actuators | indicator]/driver/serial/measure
        :param *keys: string
        """
        item = self.assets
        for key in keys:
            item = item.get(key, {})
        return item

    def _edit_item(self, item: Any, last_key: str = None, *keys, **kwkeys):
        """
        append or modify a generic item to the Asset object, it assumes that the added keys re correct
        :param item: parent in which the item will be added, follows the MQTT naming conventions
            zones/driver/[sensors|actuators]/serial/tag (in case of tag, item must be none
        :param last_key: key of the new item to append, omitted if the thing being appended is a dictionary
        :param item: item to append, it can be a dictionary to extend the dataset or an item
        keys: args to append the data on
        kwkeys: not implemented, structured way to add items according to the given level
            - zone (at which zone, in case of top level insertion the data remains out)
            - sensor/actuator (whether it is a sensor or an actuator)
        """
        dictionary = self.assets

        for key in keys:
            if key not in dictionary:
                raise KeyError("Provide the full path to the existing dictionary key")
            elif not isinstance(dictionary, dict):
                raise KeyError("The reached level is not a dictionary")
            else:
                dictionary = dictionary[key]

        # Change the value at the final key in the path
        if isinstance(dictionary, dict):
            if not last_key:
                raise ValueError("In case of dictionaries provide a key as well as an item")
            dictionary[last_key] = item
        elif isinstance(dictionary, list):
            dictionary.append(item)
            # this performs a change in the state, add handle the data externally

    def _del_item(self, last_key: str = None, *keys, **kwkeys):
        """
        deletes an item from the string
        """
        item = self.assets.get('zones')
        for key in keys:
            item = item.get(key, {})

        del item[last_key]

        return True