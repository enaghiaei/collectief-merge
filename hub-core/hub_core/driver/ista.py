import requests
from modules.database.measure import Measure
from modules.configuration.cfg_abstract import AbstractConfig
from modules.database.models import HubCoreMeasureData
from modules.database.entity_abstract import MeasureEntity, ControlEntity
from modules.mqtt.payload import HubCoreException, HubCoreError
import time
from jsonschema import validate
from jsonschema.exceptions import ValidationError


