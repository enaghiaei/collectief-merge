"""Sphensor Entity driver"""
from logging import getLogger
from modules.database.measure import Measure
from modules.database.models import HubCoreMeasureData
from modules.database.entity_abstract import MeasureEntity
from modules.mqtt.payload import HubCoreException, HubCoreError


class SphensorEntity(MeasureEntity):
    """Driver class managing sphensor devices"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._period = 0
        self.entity_init()

    def entity_init(self):  # TODO rivedere
        """Driver specific initialization.
        If _period is 0 (default): every received measure is saved
        if _period is N: every measure received in N minutes from last saved one is discarded
        _period is generic for every measure in sphensor entity. Each measure can have an internal period attribute
         which overrides this one"""
        self._period = self._cfg.get("period", 0)

    def read_measure(self, meas_obj: Measure) -> HubCoreMeasureData:
        """unused"""
        raise NotImplementedError

# TODO -> da dove lo prende il periodo di undersampling?
    # def driver_specific_measure_cfg(self, measure: Measure):
    #     # If the measure period is not specified, the entity default period is considered
    #     if measure.additional_cfg.get("period") is None:
    #         measure.additional_cfg["period"] = self._period

    @staticmethod
    def cfg_is_valid(config):  # TODO rivedere
        """This method checks if the configuration provided is valid for the Sphensor entity"""
        measures = config.get("measures")
        if measures is None:
            getLogger().warning("'measures' field not found in config...")  # TODO: questo non viene già controllato dal check generico delle entities?
        else:
            if type(measures) is list and len(measures) > 0:
                for measure in measures:
                    # Tag is the only mandatory key to add a valid measure
                    if "tag" not in measure:
                        raise HubCoreException(HubCoreError.INV_PARAM, f"Tag param not found for measure in cfg")
            else:
                getLogger().warning("No measures set in sphensor configuration...")  # TODO: questo non viene già controllato dal check generico delle entities?
        return True

