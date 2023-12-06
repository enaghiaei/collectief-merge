"""Hub Core Measures module"""
from modules.database.models import HubCoreMeasure


class Measure:
    """ This class describes a Measure object """
    def __init__(self, meas_id=None, edg_id=None, name=None, unmis=None, decimals=None, tag=None, additional=None):
        self.id = meas_id                   # Measure ID automatically assigned by database
        self.edg_id = edg_id                # Entity Data Group which the Measure belongs to
        self.name = name                    # Name of the measure (optional)
        self.unmis = unmis                  # Measure unit (optional)
        self.decimals = decimals            # Measure decimals (optional)
        self.tag = tag                      # Measure tag
        self.sql_obj = None                 # SQL ORM object
        self.additional_cfg = additional    # Additional configurations
        self.last_dt = None

    def __str__(self):
        return f"id {self.id}, tag {self.tag}"

    @staticmethod
    def create_from_sql_obj(sql_obj: HubCoreMeasure):
        """Create a measure object starting from the SQL ORM object"""
        meas = Measure(sql_obj.id, sql_obj.edg_id, sql_obj.name, sql_obj.unmis, sql_obj.decimals, sql_obj.tag)
        meas.sql_obj = sql_obj
        return meas
