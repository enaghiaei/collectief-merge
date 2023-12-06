from collections.abc import MutableMapping
from typing import Any

# handle the library in a sim

# %% Schema declaration for validation
LIBRARY_SCHEMA = {
    "type": "object",
    "minProperties": 1,
    "additionalProperties": {
        "type": "object",
        "minProperties": 1,
        "additionalProperties": {
            "type": "object",
            "patternProperties": {
                "^\\d$": {
                    "type": "object",
                    "minProperties": 1,
                    "patternProperties": {
                        "^\\d$": {
                            "type": "object",
                            "minProperties": 1,
                            "patternProperties": {
                                "^[0-7]$": {
                                    "type": "object",
                                    "properties": {
                                        "reward": {
                                            "type": "array",
                                            "items": {
                                                "type": "number"
                                            }
                                        },
                                        "action": {"type": "array",
                                                   "items": {
                                                       "type": "array",
                                                       "items": {
                                                           "type": "number"
                                                       }
                                                   }
                                                   }
                                    },
                                    "required": ["reward", "action"],
                                    "additionalProperties": False
                                }
                            },
                            "additionalProperties": False
                        }
                    },
                    "additionalProperties": False
                }
            },
            "additionalProperties": False
        }
    }
}

ASSET_SCHEMA = {
  "type": "object",
  "$comment": "at any level, comments on the schema are made in order to explain teh",
  "properties": {
    "_comment": {
      "type": "string"
    },
    "brigId": {
      "type": "string"
    },
    "building_name": {
      "type": "string"
    },
    "coordinates": {
      "type": "array",
      "prefixItems": [
        {"type": "number", "minimum": -90.0, "maximum":  90.0},
        {"type": "number", "minimum": -180.0, "maximum":  180.0}
      ]
    },
    "zones": {
      "type": "object",
      "patternProperties": {
        "^[-\\w]+$": {
            "type": "object",
            "properties": {
            "_comment": {
              "type": "string"
            },
            "zoneName": {
              "type": "string"
            },
            "zoneType": {
              "type": "string"
            },
            "zoneCategory": {
              "type": "number",
              "minimum": 1,
              "maximum": 3
            },
          "sensors": {
              "type": "object",
              "anyOf": [
              {
                "minProperties": 2,
                "required": [
                  "_comment"
                ]
              },
              {
                "minProperties": 1
              }
            ],
              "properties": {
                "_comment": {
                  "type": "string"
                }
              },
              "patternProperties": {
                "^[-\\w]+$": {
                  "type": "object",
                  "patternProperties": {
                    "^[-\\w]+$": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
          },
          "actuators": {
                "type": "object",
                "properties": {
                  "_comment": {
                    "type": "string"
                  }
                },
                "patternProperties": {
                  "^[-\\w]+$": {
                    "type": "object",
                    "properties": {
                      "_comment": {
                        "type": "string"
                      }
                    },
                    "patternProperties": {
                      "^[-\\w]+$": {
                        "type": "object",
                        "properties": {
                          "_comment": {
                            "type": "string"
                          }
                        },
                        "patternProperties": {
                          "^[-\\w]+$": {
                            "anyOf": [
                              {
                                "type": "object",
                                "properties": {
                                  "actuatorType": {
                                    "value": "HVAC_setpoint"
                                  },
                                  "_comment": {
                                    "type": "string"
                                  },
                                  "settings": {
                                    "type": "object",
                                    "properties": {
                                      "values": {
                                        "type": "object",
                                        "properties": {
                                          "min": {
                                            "type": "number"
                                          },
                                          "default": {
                                            "type": "number"
                                          },
                                          "max": {
                                            "type": "number"
                                          }
                                        },
                                        "required": ["min", "default", "max"]
                                      },
                                      "features": {
                                        "type": "object",
                                        "properties": {
                                          "changeStep": {
                                            "type": "number",
                                            "minimum": 0
                                          },
                                          "changePerTimestep": {
                                            "type": "number",
                                            "minimum": 0
                                          },
                                          "biDirectional": {
                                            "type": "boolean"
                                          },
                                          "engagementSignal": {
                                            "type": "number"
                                          },
                                          "operationMode": {
                                            "type": "string",
                                            "enum": [
                                              "Heating",
                                              "Cooling",
                                              "Both"
                                            ]
                                          }
                                        },
                                        "required": [
                                          "changeStep",
                                          "changePerTimestep",
                                          "biDirectional",
                                          "engagementSignal",
                                          "operationMode"
                                        ]
                                      }
                                    },
                                    "required": ["values", "features"]
                                  }
                                },
                                "required": ["settings"]
                              },
                              {
                                "type": "object",
                                "properties": {
                                  "_comment": {
                                    "type": "string"
                                  },
                                  "actuatorType": {
                                    "value": "boolean_setpoint"
                                },
                                  "settings": {
                                    "type": "object",
                                    "properties": {
                                      "features": {
                                        "type": "object",
                                        "properties": {
                                          "changeStep": {
                                            "type": "number",
                                            "minimum": 0
                                          },
                                          "engagementSignal": {
                                            "type": "number"
                                          }
                                        }
                                      }
                                    }
                                  }
                                },
                                "required": ["settings"]
                              }
                            ]
                          }
                        }
                      }
                    }
                  }
                }
          }
          }
        }
      },
      "minProperties": 1
    },
    "sensors": {
      "type": "object",
      "oneOf":[
        {
          "required": ["_comment"],
          "minProperties": 2
        },
        {
          "minProperties": 1
        }
      ],
      "properties": {
        "_comment": {
          "type": "string"
        }
      },
      "patternProperties": {
        "^[-\\w]+": {
          "type": "object",
          "properties": {
            "_comment": {
              "type": "string"
            }
          },
          "patternProperties": {
            "^[-\\w]+$": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      }
    },
    "actuators": {
      "type": "object",
      "properties": {
        "_comment": {
          "type": "string"
        }
      },
      "patternProperties": {
        "^[-\\w]+": {
          "type": "object",
          "properties": {
            "_comment": {
              "type": "string"
            }
          },
          "patternProperties": {
            "^[-\\w]+$": {
              "type": "object",
              "properties": {
                "_comment": {
                  "type": "string"
                }
              },
              "minProperties": 1,
              "patternProperties": {
                "^[a-zA-Z0-9_]+$": {
                  "oneOf": [
                    {
                      "type": "object",
                      "properties": {
                        "_comment": {
                          "type": "string"
                        },
                        "actuatorType": {
                          "type": "string",
                          "enum": [
                            "HVAC_setpoint",
                            "Boolean"
                          ]
                        },
                        "settings": {
                          "type": "object",
                          "properties": {
                            "values": {
                              "type": "object",
                              "properties": {
                                "min": {
                                  "type": "number"
                                },
                                "default": {
                                  "type": "number"
                                },
                                "max": {
                                  "type": "number"
                                }
                              },
                              "required": [
                                "min",
                                "default",
                                "max"
                              ]
                            },
                            "features": {
                              "type": "object",
                              "properties": {
                                "changeStep": {
                                  "type": "number",
                                  "minimum": 0
                                },
                                "changePerTimestep": {
                                  "type": "number",
                                  "minimum": 0
                                },
                                "biDirectional": {
                                  "type": "boolean"
                                },
                                "engagementSignal": {
                                  "type": "number"
                                },
                                "operationMode": {
                                  "type": "string",
                                  "enum": [
                                    "Heating",
                                    "Cooling",
                                    "Both"
                                  ]
                                }
                              },
                              "required": [
                                "changeStep",
                                "changePerTimestep",
                                "biDirectional",
                                "engagementSignal",
                                "operationMode"
                              ]
                            }
                          },
                          "required": [
                            "values",
                            "features"
                          ]
                        }
                      },
                      "required": [
                        "settings",
                        "actuatorType"
                      ]
                    },
                    {
                      "type": "object",
                      "properties": {
                        "_comment": {
                          "type": "string"
                        },
                        "settings": {
                          "type": "object",
                          "properties": {
                            "features": {
                              "type": "object",
                              "properties": {
                                "changeStep": {
                                  "type": "number",
                                  "minimum": 0
                                },
                                "engagementSignal": {
                                  "type": "number"
                                }
                              }
                            }
                          }
                        }
                      },
                      "required": [
                        "settings"
                      ]
                    }
                  ]
                }
              }
            }
          }
        }
      }
    }
  },
  "required": ["brigId", "building_name", "coordinates", "zones"]
}

ACTUATOR_SCHEMAS = {
  "HVAC_setpoint":{
    "type": "object",
    "properties": {
      "settings": {
        "type": "object",
        "properties": {
          "values": {
            "type": "object",
            "properties": {
              "min": {
                "type": "number"
              },
              "default": {
                "type": "number"
              },
              "max": {
                "type": "number"
              }
            },
            "required": ["min", "max"],
            "additionalProperties": False
          },
          "features": {
            "type": "object",
            "properties": {
              "changeStep": {
                "type": "number",
                "minimum": 0
              },
              "changePerTimestep": {
                "type": "integer",
                "minimum": 0
              },
              "biDirectional": {
                "type": "boolean"
              },
              "engagementSignal": {
                "type": "integer"
              },
              "operationMode": {
                "type": "string",
                "enum": ["Heating","Cooling","Both"]
              }
            },
            "required": ["changeStep", "changePerTimestep", "biDirectional", "engagementSignal", "operationMode"],
            "additionalProperties": False
          }
        },
        "required": ["values", "features"],
        "additionalProperties": False
      }
    },
    "required": ["settings"],
    "additionalProperties": False
  },
  "boolean_setpoint": {
    "type": "object",
    "properties": {
      "settings": {
        "type": "object",
        "properties": {
          "features": {
            "type": "object",
            "properties": {
              "changeStep": {
                "type": "number",
                "minimum": 0
              },
              "engagementSignal": {
                "type": "integer"
              }
            }
          }
        }
      }
    }
  }
}


# perhaps include these methods in a larger class so that they can be operated on
def flatten_item(item: dict | MutableMapping, parent_key: str = '', separator : str = "/", **kwargs):
    """
    Credit: https://stackoverflow.com/questions/6027558/flatten-nested-dictionaries-compressing-keys

    A recursive method to flatten the dictionary. By performing the flattening of the resources, it is possible
    to perform further operations.

    Parameters
    ----------
    item : dict or MutableMapping
        Item to flatten, received from the flatten_item method.
    parent_key : str, optional
        Initial key, set to an empty string, by default ''
    separator : str, optional
        Ubiquitous separator for the keys, by default '/'
    current_level : int, optional
        Not actually used, used to keep track of the state of the level for max_level, by default 0
    max_level : int, optional
        Max level of the flattening, by default None
    flatten_list : bool, optional
        Whether to flatten lists, where keys are integers in that case, by default False

    Returns
    -------
    item_list : dict
        A flattened dictionary that can be further processed with parse_flat_keys to obtain a list of dictionaries with
        the keys.
    """
    # todo Evaluate removing kwargs
    item_list = []
    current_level = kwargs.get("current_level", 0)  #
    max_level = kwargs.get("max_level", 1000)  # arbitrary big number
    if max_level:
        current_level += 1

    flatten_list_bool = kwargs.get("flatten_list", False)
    for key, value in item.items():
        new_key = separator.join([str(parent_key), key]) if parent_key else key
        if isinstance(value, MutableMapping) and current_level <= max_level:
            # recursively adds the keys
            item_list.extend(flatten_item(value, new_key, separator, flatten_list=flatten_list_bool,
                             current_level=current_level, max_level=max_level).items())
        elif isinstance(value, list) and current_level <= max_level:
            if flatten_list_bool:
                for k, v in enumerate(value):
                    item_list.extend(flatten_item({str(k): v}, new_key, flatten_list=flatten_list_bool,
                                                  current_level=current_level, max_level=max_level).items())
            else:
                item_list.append((new_key, value))
        else:
            item_list.append((new_key, value))

    return dict(item_list)


def filter_flat_keys(flat_item: dict, positive_keyword: str | list = '', negative_keyword: str | list = ''):
    """
    Filter keys according to a given keyword(s).

    Parameters
    ----------
    flat_item : dict
        Flattened item from flatten_item.
    positive_keyword : str or list, optional
        Positive keyword for selecting the keys, by default ''.
    negative_keyword : str or list, optional
        Negative keyword for removing said keys, by default ''.
    """
    is_in_keyword = lambda x, keyword: keyword in x

    if negative_keyword:
        return {key: item for key, item in flat_item.items() if is_in_keyword(key, positive_keyword) and
                                                                not is_in_keyword(key, negative_keyword)}
    else:
        return {key: item for key, item in flat_item.items() if is_in_keyword(key, positive_keyword)}


def process_flat_keys(flat_item: dict | MutableMapping,
                      item_key_names: list[str],
                      element_key_name: str = "",
                      **kwargs):
    """
    Method to parse flat keys. It is assumed that all items of the dictionary are filtered to the same level
    in order to ease the key management.

    Parameters
    ----------
    flat_item : dict or MutableMapping
        Flattened item from flatten_item.
    item_key_names : list[str]
        Names of the keys.
    element_key_name : str, optional
        Name of the final key, by default "".
    **kwargs
        Optional keyword arguments.

    Returns
    -------
    parsed_key
        The parsed key.

    Other Parameters
    ----------------
    prune : Optional
        Keys to remove keys among the element_key_name.
    """
    key_level = len(item_key_names)
    prune_keys = []
    item = {k: i for k, i in flat_item.items() if len(k.split("/")) == key_level}

    if "prune" in kwargs:
        prune_keys = kwargs["prune"]
        if isinstance(kwargs["prune"], str):
            prune_keys = [prune_keys]
        if element_key_name and element_key_name in prune_keys:
            raise Exception("Selected key is among the pruned elements")

    if element_key_name:
        processed_keys = [{**{k: v for k, v in zip(item_key_names, key.split('/')) if k not in prune_keys},
                           **{element_key_name: item}} for key, item in item.items()]
    else:
        processed_keys = [{**{k: v for k, v in zip(item_key_names[0:-1], key.split('/')) if k not in prune_keys},
                           **{item_key_names[-1]: item}} for key, item in item.items()]

    return processed_keys


def path_split(path: str) -> list:
    path = path.split("/") if "/" in path else path.split("\\")
    return path


def path_merge(abs_path: str, rel_path: str) -> str:
    """
    Merge between absolute and relative paths. It expects at least a degree of overlap,
    used in case relative paths don't cut it and using ".." is not sure to work.

    Parameters
    ----------
    abs_path : str
        Absolute path of the machine or "less relative" path.
    rel_path : str
        Relative path of the file or folder to make absolute.

    Returns
    -------
    str
        The merged absolute path.

    """
    rel_path = path_split(rel_path)
    curr_path = path_split(abs_path)

    for lvl in rel_path:
        if lvl in curr_path:
            continue
        else:
            curr_path.append(lvl)

    return "\\".join(curr_path)


def edit_item(dictionary, item: Any, *keys, last_key: str = None):
    """
    Append or modify a generic item to an object. It assumes that the added keys are correct.

    Parameters
    ----------
    dictionary: dict
        Dictionary to edit
    item : Any
        item that will be added, follows the MQTT naming conventions:
        zones/driver/[sensors|actuators]/serial/tag (in case of tag, item must be none).
    last_key : str, optional
        Key of the new item to append. Omitted if the thing being appended is a dictionary.
    keys : tuple
        Args to append the data on.

    Returns
    -------
    None
        This function does not return any value.
    """
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
