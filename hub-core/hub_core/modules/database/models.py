from sqlalchemy import Column, DateTime, Float, Index, String, text, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.mysql import INTEGER, TINYINT, JSON
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.exc import SQLAlchemyError
import enum
from sqlalchemy import Enum
import uuid
Base = declarative_base()
metadata = Base.metadata
from logging import getLogger
from traceback import format_exc


"""
Note:
    - se manca un campo obbligatorio, se la primary key o la foreign key non sono rispettate...
     -> pymysql.err.IntegrityError
    - se lascio vuoto un campo non nullable -> pymysql.err.OperationalError
    - se il tipo che provo a inserire a DB è sbagliato -> pymysql.err.DataError (se passo una stringa convertibile
     a intero, come ad esempio "34", funziona)
    - per datetime: se specifico solo il giorno parte dale 00:00
"""


class ExtendedBase(Base):
    """ Base model for ORM mappers.
    Gives a default implementation of save and remove methods.
    """
    __abstract__ = True

    def save(self, session):
        """ Utility used to insert the instance in the database.
        """
        try:
            session.add(self)
            session.commit()
            return True
        except SQLAlchemyError as e:
            session.rollback()
            getLogger().error(str(e))
            getLogger(f"extended reason\n{format_exc()}")
            return False

    def remove(self, session):
        """ Utility used to delete the instance from the database.
        """
        try:
            session.delete(self)
            session.commit()
            return True
        except SQLAlchemyError as e:
            session.rollback()
            getLogger().error(str(e))
            getLogger(f"extended reason\n{format_exc()}")
            return False

    def update(self, session):
        """
        Utility used to update the instance.
        """
        try:
            session.commit()
            return True
        except SQLAlchemyError as e:
            session.rollback()
            getLogger().error(str(e))
            getLogger(f"extended reason\n{format_exc()}")
            return False

    @property
    def columns(self):
        return self.__table__.columns.keys()

    def to_dict(self):
        return {a: getattr(self, a) for a in self.columns}

    def __repr__(self):
        class_name = self.__class__.__name__
        attrs = ', '.join(f'{attr}={getattr(self, attr)!r}' for attr in self.__dict__)
        return f'{class_name}({attrs})'




# Column\('([a-z_]+)', (.+), (.+)\)(,*)$
# t_hc_db_diagno = Table(
#     'hc_db_diagno', metadata,
#     Column('dt', DateTime, nullable=False, server_default=text('utc_timestamp()')),
#     Column('start_dt', DateTime, nullable=False),
#     Column('db_size', INTEGER(11), nullable=False),
#     Column('meas_data_num', INTEGER(11), nullable=False)
# )


class HubCoreDbDiagno(ExtendedBase):
    __tablename__ = 'hc_db_diagno'

    dt = Column(DateTime, nullable=False, server_default=text('utc_timestamp()'), primary_key=True)
    start_dt = Column(DateTime, nullable=False, primary_key=True)
    db_size = Column(INTEGER(11), nullable=False)
    meas_data_num = Column(INTEGER(11), nullable=False)

    def __init__(self, dt, start_dt, db_size, meas_data_num):
        super().__init__()
        self.dt = dt
        self.start_dt = start_dt
        self.db_size = db_size
        self.meas_data_num = meas_data_num


# come posso gestire le entità 
class HubCoreEntity(ExtendedBase):
    __tablename__ = 'hc_entities'

    id = Column(INTEGER(11), primary_key=True, autoincrement=True)
    driver = Column(String(16), nullable=False)
    field_id = Column(String(64), nullable=False)
    cfg = Column(JSON, nullable=False, server_default='{}')
    enabled = Column(TINYINT(1), nullable=False, server_default=text('1'))
    name = Column(String(64))
    zone_id = Column(String(8), nullable=False)
    UniqueConstraint(field_id, driver, name="uc_field_id_driver")
    hc_entity_data_groups = relationship('HubCoreEntityDataGroup', back_populates='entity')

    # sql_entity = HubCoreEntity(driver, field_id, cfg, params.get("zone_id"), params.get("name"))
    def __init__(self, driver, field_id, cfg, zone_id, name, enabled=1):
        super().__init__()
        self.driver = driver
        self.field_id = field_id
        self.cfg = cfg
        self.enabled = enabled
        self.name = name
        self.zone_id = zone_id


class HubCoreSgDiagno(ExtendedBase):
    __tablename__ = 'hc_sg_diagno'
    dt = Column(DateTime, nullable=False, server_default=text('utc_timestamp()'), primary_key=True)
    start_dt = Column(DateTime, nullable=False, primary_key=True)
    unsol_msgs = Column(INTEGER(11), nullable=False)
    reqs = Column(INTEGER(11), nullable=False)
    anss = Column(INTEGER(11), nullable=False)
    errors = Column(INTEGER(11), nullable=False)

    def __init__(self, dt, start_dt, unsol_msgs, reqs, anss, errors):
        super().__init__()
        self.dt = dt
        self.start_dt = start_dt
        self.unsol_msgs = unsol_msgs
        self.reqs = reqs
        self.anss = anss
        self.errors = errors


class HubCoreSystemDiagno(ExtendedBase):
    """TODO"""
    __tablename__ = 'hc_system_diagno'
    dt = Column(DateTime, nullable=False, server_default=text('utc_timestamp()'), primary_key=True)
    start_dt = Column(DateTime, nullable=False)
    db_size = Column(INTEGER(11), nullable=False)
    meas_recs = Column(INTEGER(11), nullable=False)
    ents = Column(INTEGER(11), nullable=False)
    en_ents = Column(INTEGER(11), nullable=False)
    retr_ents = Column(INTEGER(11), nullable=False)
    unreach_ents = Column(INTEGER(11), nullable=False)
    unreg_ents = Column(INTEGER(11), nullable=False)
    sys_errors = Column(INTEGER(11), nullable=False)

    def __init__(self, dt, start_dt, db_size, meas_recs, ents, en_ents, retr_ents, unreach_ents, unreg_ents, sys_errors):
        super().__init__()
        self.dt = dt
        self.start_dt = start_dt
        self.db_size = db_size
        self.meas_recs = meas_recs
        self.ents = ents
        self.en_ents = en_ents
        self.retr_ents = retr_ents
        self.unreach_ents = unreach_ents
        self.unreg_ents = unreg_ents
        self.sys_errors = sys_errors


class HubCoreEntitiesDiagno(ExtendedBase):
    """TODO"""
    __tablename__ = 'hc_entities_diagno'
    dt = Column(DateTime, nullable=False, server_default=text('utc_timestamp()'), primary_key=True)
    start_dt = Column(DateTime, nullable=False)
    entity_id = Column(INTEGER(11), ForeignKey("hc_entities.id", name="fk_diag_entity_id", onupdate="CASCADE",
                                               ondelete="CASCADE"), nullable=False, primary_key=True)
    unsol_msgs = Column(INTEGER(11), nullable=False)
    rdns = Column(INTEGER(11))
    reqs = Column(INTEGER(11), nullable=False)
    anss = Column(INTEGER(11), nullable=False)
    status = Column(String(3), nullable=False)
    errors = Column(INTEGER(11), nullable=False)

    def __init__(self, dt, start_dt, entity_id, unsol_msgs, rdns, reqs, anss, status, errors):
        super().__init__()
        self.dt = dt
        self.start_dt = start_dt
        self.entity_id = entity_id
        self.unsol_msgs = unsol_msgs
        self.rdns = rdns
        self.reqs = reqs
        self.anss = anss
        self.status = status
        self.errors = errors


# t_hc_sg_diagno = Table(
#     'hc_sg_diagno', metadata,
#     Column('dt', DateTime, nullable=False, server_default=text('utc_timestamp()')),
#     Column('start_dt', DateTime, nullable=False),
#     Column('unsol_msgs', INTEGER(11), nullable=False),
#     Column('reqs', INTEGER(11), nullable=False),
#     Column('anss', INTEGER(11), nullable=False),
#     Column('errors', INTEGER(11), nullable=False)
# )

# posso usare questo come storico per i segnali precedenti
class HubCoreEntityDataGroup(ExtendedBase):
    __tablename__ = 'hc_entity_data_groups'
    __table_args__ = (
        Index('entity_id', 'entity_id', 'start_dt'),
    )

    id = Column(INTEGER(11), primary_key=True, autoincrement=True)
    entity_id = Column(INTEGER(11), ForeignKey('hc_entities.id', ondelete='CASCADE', onupdate='CASCADE',
                                               name='fk_entity_id'), nullable=False)
    start_dt = Column(DateTime, nullable=False)
    UniqueConstraint(entity_id, start_dt, name="uc_entity_id_start_dt")

    def __init__(self, entity_id: int, start_dt):
        super().__init__()
        self.entity_id = entity_id
        self.start_dt = start_dt

    entity = relationship('HubCoreEntity', back_populates='hc_entity_data_groups')
    hc_measures = relationship('HubCoreMeasure', back_populates='edg')


class HubCoreMeasure(ExtendedBase):
    __tablename__ = 'hc_measures'

    id = Column(INTEGER(11), primary_key=True, autoincrement=True)
    edg_id = Column(INTEGER(11), ForeignKey("hc_entity_data_groups.id", name="fk_edg_id",
                                            ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    tag = Column(String(32), nullable=False)
    name = Column(String(32))
    unmis = Column(String(32))
    decimals = Column(TINYINT(4))
    UniqueConstraint(edg_id, tag, name="uc_edg_id_tag")
    # measure = relationship('HubCoreMeasureData', back_populates='hc_measures')
    edg = relationship('HubCoreEntityDataGroup', back_populates='hc_measures')
    measure_data = relationship('HubCoreMeasureData', back_populates='measure', cascade='all, delete-orphan')

    def __init__(self, edg_id: str, tag: str, name: str = None, unmis: str = None, decimals: float = 5):
        super().__init__()
        self.edg_id = edg_id
        self.tag = tag
        self.name = name if name else tag
        self.unmis = unmis if unmis else tag
        # TODO find a way to include the decimal precision on call
        self.decimals = decimals


class HubCoreMeasureData(ExtendedBase):
    __tablename__ = 'hc_measure_data'
    measure_id = Column(INTEGER(11), ForeignKey("hc_measures.id", name="fk_measure_id", onupdate="CASCADE",
                                                ondelete="CASCADE"), primary_key=True, nullable=False)
    dt = Column(DateTime, primary_key=True, nullable=False)
    value = Column(Float, nullable=False)

    measure = relationship('HubCoreMeasure', back_populates='measure_data')

    def __init__(self, dt, value: float, measure_id: int):
        super().__init__()
        self.measure_id = measure_id
        self.dt = dt
        self.value = value


class AlgoTypeEnum(enum.Enum):
    """
    RLDSM : reinforcement learning demand side management
    TC: thermal comfort
    NODA: noda solution
    """
    RLDSM = "rldsm"
    NODA = "noda"


class AlgoAssets(ExtendedBase):
    __tablename__ = 'algo_assets'
    zone_id = Column(String(8), primary_key=True, nullable=False)
    zone_type = Column(String(64))
    algo_type = Column(Enum(AlgoTypeEnum))
    zone_name = Column(String(64))
    cfg = Column(JSON, nullable=False)

    def __init__(self, zone_id: str, cfg: dict, algo_type: str, zone_type: str = '', zone_name: str = ''):
        super().__init__()
        self.zone_id = zone_id
        self.cfg = cfg
        self.algo_type = algo_type
        self.zone_name = zone_name
        self.zone_type = zone_type


class AlgoItemEnum(enum.Enum):
    """
    SENSOR: for sensor items
    ACTUATOR: for actuator items
    INDICATOR: for indicator items
    """
    SENSOR = "sensor"
    ACTUATOR = "actuator"
    INDICATOR = "indicator"


class AlgorithmHistoryItems(ExtendedBase):
    __tablename__ = "algo_history_items"
    id = Column(INTEGER(11), primary_key=True, autoincrement=True)
    zone_id = Column(String(16))
    algo_type = Column(String(8))
    item_type = Column(Enum(AlgoItemEnum))
    item_path = Column(String(64))


class AlgorithmHistoryData(ExtendedBase):
    __tablename__ = "algo_history_data"
    dt = Column(DateTime, primary_key=True)
    item_id = Column(INTEGER(11), ForeignKey('algo_history_items.id', name='item_id_fk',
                                             onupdate='CASCADE', ondelete='CASCADE'), nullable=False)
    value = Column(Float)


# table type one, the json is limited to actions and rewards
class DsmSignalLibrary(ExtendedBase):
    __tablename__ = 'dsm_signal_library'
    id = Column(INTEGER(11),primary_key=True,autoincrement=True)
    zone_id = Column(String(16), nullable=False)
    season_id = Column(TINYINT(8), nullable=False)
    signal_val = Column(TINYINT(8), nullable=False)
    hour = Column(TINYINT(8), nullable=False)
    reward = Column(Float, nullable=False, default=0.0)
    action = Column(JSON, nullable=False, default=[])

    def __init__(self, zone_id, season_id, signal_val, hour, reward, action):
        self.zone_id = zone_id
        super().__init__()
        self.season_id = season_id
        self.signal_val = signal_val
        self.hour = hour
        self.reward = reward
        self.action = action


class IgEntities(ExtendedBase):
    __tablename__ = 'ig_uuid_identification'
    uuid = Column(String(36), primary_key=True, nullable=False, default=uuid.uuid4)
    parent = Column(String(36), nullable=True, default=None)
    reference = Column(String(64)) # it connects to each reference according to data structure, it provides a platform for all solutions that are not sphensor
