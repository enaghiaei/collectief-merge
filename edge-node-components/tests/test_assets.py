import pytest
import sys
import json
sys.path.append("..")
from actuation_engine.algorithms.assets import Asset
import random

@pytest.fixture
def asset_dict_wrong():
    asset_dict = {
        "73566346": {
            "brigId": "73566346",
            "building_name": "dummy"
        }
    }
    return asset_dict


def test_asset_generation_success(asset_dict_correct):
    """
    test to import a plain asset
    """
    asset = Asset(assets=asset_dict_correct, algorithm="rldsm")
    assert asset


def test_asset_generation_failure(asset_dict_wrong):
    """
    general test to generate a plain asset object, general failure case (missing zone parameter)
    """
    from jsonschema.exceptions import ValidationError
    with pytest.raises(ValidationError):
        _ = Asset(assets=asset_dict_wrong)


@pytest.mark.parametrize("filename, building", [(r"data\assets_France.json", "22040367"),
                                                (r"data\assets_Cyprus.json", "22040368"),
                                                (r"data\assets_Cyprus.json", "22040370"),
                                                (r"data\assets_Cyprus.json", "22040371"),
                                                (r"data\assets_Italy.json", "22040352"),
                                                (r"data\assets_Italy.json", "22040369"),
                                                (r"data\assets_Italy.json", "22040341"),
                                                (r"data\assets_Norway.json", "22040349"),
                                                (r"data\assets_Norway.json", "22040350"),
                                                (r"data\assets_Norway.json", "22040351"),
                                                (r"data\assets_Norway.json", "22040353"),
                                                (r"data\assets_Norway.json", "22040361"),
                                                (r"data\assets_Norway.json", "22040362"),
                                                (r"data\assets_Norway.json", "22040363")])
def test_asset_pilots_import_success(filename, building):
    assets = Asset.load_assets_from_file(path=filename, algorithm="rldsm", building=building)
    assert isinstance(assets, Asset)


def test_asset_text_dumping():
    random_latitude = round(180 * random.random() - 90, 6)
    random_longitude = round(360 * random.random() - 180, 6)
    asset_dict = {
        "brigId": "73566346",
        "building_name": "dummy",
        "coordinates": [random_latitude, random_longitude],
        "zones": {
            "A": {
                "zoneName": "a",
                "zoneType": "office",
                "zoneCategory": 2,
                "sensors": {
                    "dummya": {"dummya1": ["tag1", "tag2", "tag3"], "dummya2": ["tag1", "tag2", "tag3"],
                               "dummya3": ["tag1", "tag2", "tag3"]},
                    "dummyalfa": {"dummyalfa1": ["tag1"], "dummyalfa2": ["tag1", "tag2", "tag3", "tag4", "tag5"]}
                },
                "actuators": {
                    "dummya": {"dummya1": {"dummya1a": {"actuatorType": "HVAC_setpoint",
                                                        "settings": {"values": {"default": 20.0, "min": 18, "max": 25},
                                                                     "features": {"changeStep": 0.5,
                                                                                  "changePerTimestep": 2,
                                                                                  "biDirectional": False,
                                                                                  "engagementSignal": 1,
                                                                                  "operationMode": "Heating"}}},
                                           "dummya2b": {"actuatorType": "HVAC_setpoint",
                                                        "settings": {"values": {"default": 20.0, "min": 18, "max": 25},
                                                                     "features": {"changeStep": 0.5,
                                                                                  "changePerTimestep": 2,
                                                                                  "biDirectional": False,
                                                                                  "engagementSignal": 1,
                                                                                  "operationMode": "Heating"}}}}}
                },
            },
            "B": {
                "zoneName": "b",
                "zoneType": "guest room",
                "zoneCategory": 2,
                "sensors": {"dummyb": {"dummyb1": ["tag1", "tag2", "tag3"], "dummyb2": ["tag1", "tag2", "tag3"],
                                       "dummyb3": ["tag1", "tag2", "tag3"]}, "dummybeta": {"dummybeta1": ["tag1"],
                                                                                           "dummybeta2": ["tag1",
                                                                                                          "tag2",
                                                                                                          "tag3",
                                                                                                          "tag4",
                                                                                                          "tag5"]}},
                "actuators": {},
            },
        }
    }
    asset = Asset(assets=asset_dict)
    assert isinstance(json.loads(str(asset)),dict)

# def test_asset_db_retrieval():
#     assert True
#
# def test_asset_db_dumping():
#     assert True
