from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import pytest
import json
import random


@pytest.fixture
def db_url():
    # TODO this is a functional test rather than a unit test case. Should be marked somehow
    with open('../hub-core/hub_core/config/mariadb.json', 'r') as f:
        db_creds = json.load(f)

    return f"mariadb+mariadbconnector://{db_creds['user']}:{db_creds['pwd']}@localhost:{db_creds['port']}/{db_creds['db_name']}"
    return "mariadb+mariadbconnector://root:collectief@localhost:3306/collectief_db"


@pytest.fixture
def session_factory(db_url):
    engine = create_engine(db_url)
    # models.ExtendedBase.metadata.create_all(engine)
    session_factory = sessionmaker(bind=engine)
    return session_factory


@pytest.fixture
def asset_dict_correct():
    random_latitude = round(180 * random.random() - 90, 6)
    random_longitude = round(360 * random.random() - 180, 6)
    return {
        "brigId": "73566346",
        "building_name": "dummy",
        "coordinates": [
            random_latitude,
            random_longitude
        ],
        "zones": {
            "A": {
                "zoneName": "a",
                "zoneType": "office",
                "zoneCategory": 2,
                "sensors": {
                    "a": {
                        "a": [
                            "1",
                            "2",
                            "3"
                        ],
                        "b": [
                            "1",
                            "2",
                            "3"
                        ]
                    },
                    "b": {
                        "a": [
                            "1",
                            "2",
                            "3"
                        ],
                        "b": [
                            "1",
                            "2",
                            "3"
                        ]
                    }
                },
                "actuators": {
                    "h": {
                        "a": {
                            "1hvac": {
                                "actuatorType": "HVAC_setpoint",
                                "settings": {
                                    "values": {
                                        "default": 20.0,
                                        "min": 18,
                                        "max": 25
                                    },
                                    "features": {
                                        "changeStep": 0.5,
                                        "changePerTimestep": 2,
                                        "biDirectional": False,
                                        "engagementSignal": 1,
                                        "operationMode": "Heating"
                                    }
                                }
                            }
                        }
                    },
                    "c": {
                        "a": {
                            "1hvac": {
                                "actuatorType": "HVAC_setpoint",
                                "settings": {
                                    "values": {
                                        "default": 25.0,
                                        "min": 23,
                                        "max": 28
                                    },
                                    "features": {
                                        "changeStep": 0.5,
                                        "changePerTimestep": 2,
                                        "biDirectional": False,
                                        "engagementSignal": 1,
                                        "operationMode": "Cooling"
                                    }
                                }
                            }
                        }
                    }
                },
                "indicators": {
                    "optTemp": "a/a/1",
                    "energy": {
                        "energy_method": "energy_test",
                        "args": {
                            "arg1": "a/b/1",
                            "arg2": "a/b/2",
                            "arg3": "b/b/1"
                        }
                    }
                }
            },
            "B": {
                "zoneName": "b",
                "zoneType": "guest room",
                "zoneCategory": 2,
                "sensors": {
                    "a": {
                        "a": [
                            "1",
                            "2",
                            "3"
                        ],
                        "b": [
                            "1",
                            "2",
                            "3"
                        ]
                    },
                    "b": {
                        "a": [
                            "1",
                            "2",
                            "3"
                        ],
                        "b": [
                            "1",
                            "2",
                            "3"
                        ]
                    }
                },
                "actuators": {
                    "h": {
                        "a": {
                            "1hvac": {
                                "actuatorType": "HVAC_setpoint",
                                "settings": {
                                    "values": {
                                        "default": 20.0,
                                        "min": 18,
                                        "max": 25
                                    },
                                    "features": {
                                        "changeStep": 0.5,
                                        "changePerTimestep": 2,
                                        "biDirectional": False,
                                        "engagementSignal": 1,
                                        "operationMode": "Heating"
                                    }
                                }
                            }
                        }
                    },
                    "c": {
                        "a": {
                            "1hvac": {
                                "actuatorType": "HVAC_setpoint",
                                "settings": {
                                    "values": {
                                        "default": 25.0,
                                        "min": 23,
                                        "max": 28
                                    },
                                    "features": {
                                        "changeStep": 0.5,
                                        "changePerTimestep": 2,
                                        "biDirectional": False,
                                        "engagementSignal": 1,
                                        "operationMode": "Cooling"
                                    }
                                }
                            }
                        }
                    }
                },
                "indicators": {
                    "optTemp": "a/a/1",
                    "energy": {
                        "energy_method": "energy_test",
                        "args": {
                            "arg1": "a/b/1",
                            "arg2": "a/b/2",
                            "arg3": "b/b/1"
                        }
                    }
                }
            }
        }
    }
