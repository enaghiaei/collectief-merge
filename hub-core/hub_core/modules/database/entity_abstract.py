"""This module defines classes and methods to deal with Collectief entities"""
from abc import abstractmethod
from datetime import datetime, timezone
from enum import Enum
from logging import getLogger
from modules.database.measure import Measure
from modules.database.models import HubCoreEntity, HubCoreMeasureData


class EntityStatus(Enum):
    """Entity Status Enum"""
    UNDEFINED = 'und'
    ALIVE = 'alv'
    DISABLED = 'dis'
    UNREACHABLE = 'unr'
    MISSING = 'mis'
    LOST = 'lst'
    DEAD = 'dea'
    ABORTED = 'abr'


class EntityRetry(object):
    """Entity Retry context"""
    def __init__(self, max_retries=5, retry_period=1, retry_method="incremental"):
        self.retries = 0
        self.next_try_ts = datetime.now(timezone.utc)
        self.max_retries = max_retries
        self.retry_period = retry_period  # minutes
        self.retry_method = retry_method

    def get_wait_time(self):
        """Calculate wait time for next retry according to the current configuration"""
        if self.retry_period == "incremental":
            # Wait time is doubled for each new try (period * 2^retries)
            wait_time = self.retry_period * 2 ** self.retries
        else:
            wait_time = self.retry_period
        return wait_time


class GenericEntity(object):
    """This class describes a Collectief entity"""
    def __init__(self, buid=None, driver=None, _field_id=None, cfg=None, zone_id=None, name=None, enabled=1, edg=None,
                 db_obj: HubCoreEntity = None):
        self._buid = buid
        self._driver = driver
        self._field_id = _field_id
        self.db_obj = db_obj
        self.cfg = cfg
        self._zone_id = zone_id
        self._name = name
        self._enabled = enabled
        self._edg = edg


        self.status = EntityStatus.UNDEFINED
        self.has_measures = False
        self.use_polling = False
        self.has_controls = False
        # Diagnostic
        self.unsol_msg = 0
        self.req_msg = 0
        self.resp_msg = 0
        self.errors = 0
        # Retry
        self.request_timeout = 5  # seconds
        self.retry_ctx = EntityRetry(max_retries=5, retry_period=1, retry_method="incremental")
        # TODO: sostituire con le cfg

    @property
    def buid(self):
        """The buid is an entity unique id, assigned by mariadb when the entity is added"""
        return self._buid

    @buid.setter
    def buid(self, buid):
        self._buid = buid

    @property
    def driver(self):
        """The driver defines how the entity should be interfaced"""
        return self._driver

    @driver.setter
    def driver(self, drv):
        self._driver = drv
        self.db_obj.driver = drv

    @property
    def field_id(self):
        """The entity id is unique in driver context. Is the entity id in the outer world"""
        return self._field_id

    @field_id.setter
    def field_id(self, field_id):
        self._field_id = field_id
        self.db_obj.field_id = field_id

    @property
    def cfg(self):
        """The cfg contains all driver specific configurations. It could be JSON, plain text or whatever"""
        return self._cfg

    @cfg.setter
    def cfg(self, cfg):
        self._cfg = cfg  # TODO: extra check?
        self.db_obj.cfg = cfg

    @property
    def zone_id(self):
        """The zone id is used to group different entities"""
        return self._zone_id

    @zone_id.setter
    def zone_id(self, zone_id):
        self._zone_id = zone_id
        self.db_obj.zone_id = zone_id

    @property
    def name(self):
        """The name is provided externally and could also be null"""
        return self._name

    @name.setter
    def name(self, name):
        self._name = name
        self.db_obj.name = name

    @property
    def enabled(self):
        """The "enabled" field defines if the entity is activated or not"""
        return self._enabled

    @enabled.setter
    def enabled(self, enabled):
        self._enabled = enabled
        self.db_obj.enabled = enabled

    def __repr__(self):
        return f"buid: {self.buid}, drv: {self.driver}, fid: {self.field_id}"

    @staticmethod
    def cfg_is_valid(cfg):   # TODO: rivedere
        """This method checks if the configuration provided is valid for the specific entity.
        The derived classes can modify this method to add constraints and additional checks"""
        return cfg is not None

    def queueing_criteria(self, context, item_list):  # TODO: rivedere
        """Append criteria method used by ThreadPool when new item is added"""
        return None

    def update(self, params):
        """This method receives params in dict format, then update its properties according to key-value pair found
         into params"""
        self.driver = params.get("driver", self.driver)
        self.field_id = params.get("field_id", self.field_id)
        self.cfg = params.get("cfg", self.cfg)
        self.zone_id = params.get("zone_id", self.zone_id)
        self.name = params.get("name", self.name)
        self.entity_init()  # TODO: tenere così?

    def entity_init(self):
        """Entity initialization from cfg"""
        pass


class MeasureEntity(GenericEntity):
    """This class describes a Collectief entity with associated measures. A "measure" is an object of the class
     "Measure", which describes how the measure can be read"""
    DEFAULT_POLLING_PERIOD = 1  # Minutes  # TODO: da cfg

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.has_measures = True
        self.active_polling_task = []
        self._measures = []
        self._meas_count = 0

    @property
    def measures(self):
        """List of "Measure" objects"""
        return self._measures

    @measures.setter
    def measures(self, measures):
        # check input validity
        if type(measures) is list:
            if len(measures) <= 0:
                getLogger().warning(f"Empty measure config passed to set_measures ({str(self)})")
            for meas in measures:  # type: Measure
                if type(meas) is not Measure:
                    raise Exception(f"measures setter: get type {type(meas).__name__} instead of Measure")
                if meas.tag is None:
                    getLogger().warning(f"Measure configured without tag is not valid... ({str(self)})")
                    # TODO: dovrei generare un messaggio di warning nella resp?
                    break
                meas.additional_cfg = self._get_meas_additional_cfg(meas.tag)
                if meas.additional_cfg.get("polling"):
                    self.use_polling = True
            self._measures = measures

    @property
    def meas_count(self):
        """Count how many measure data the entity has generated"""
        return self._meas_count

    @meas_count.setter
    def meas_count(self, meas):
        self._meas_count = meas

    def _get_meas_additional_cfg(self, tag):
        """TODO"""
        configs = self._cfg.get("measures")
        additional_cfg = {}
        if configs is not None:
            meas_cfg = next((config for config in configs if config.get("tag") == tag), None)
            if meas_cfg is not None:
                additional_cfg = meas_cfg.copy()
                for meas_attr in ["tag", "unit", "decimals", "name"]:
                    additional_cfg.pop(meas_attr, None)  # Remove attribute from meas dict
        return additional_cfg

    @abstractmethod
    def read_measure(self, meas_obj: Measure) -> HubCoreMeasureData:
        """This method allows to read new value for the measure identified by meas_id. The meas_id is automatically
         assigned from mysql when the measure is added to hc_measures table"""
        raise NotImplementedError

    @staticmethod
    def meas_cfg_is_valid(meas_cfg):
        """This method checks if the configuration provided is valid for the specific entity.
        The derived classes can modify this method to add constraints and additional checks"""
        return meas_cfg is not None


class ControlEntity(GenericEntity):  # TODO -> da rivedere
    """This class describes a Collectief entity with associated controls.
    A "control" is an object of the class "Control", which describes how to send commands to an entity TODO """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.has_controls = True
        self._controls = []

    @abstractmethod
    def send_ent_cmd(self, drv_context):
        """This method allows to send a command to a specific entity (self)"""
        raise NotImplementedError

    @staticmethod
    def ctrl_cfg_is_valid(ctrl_cfg):
        """This method checks if the configuration provided is valid for the specific entity.
        The derived classes can modify this method to add constraints and additional checks"""
        return ctrl_cfg is not None

    def set_controls(self):
        """Set the list of controls directly from cfg"""
        self._controls = self._cfg.get("controls")
