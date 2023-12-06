"""SQL Alchemy Tables: Base objects used in ORM mapping are defined here"""
from logging import getLogger
from sqlalchemy import ForeignKey, DateTime, Float, String, text, Column, UniqueConstraint, PrimaryKeyConstraint
from sqlalchemy.dialects.mysql import TINYINT, JSON, INTEGER
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

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
    """TODO"""
    __abstract__ = True

    def save(self, session):
        """Utility used to insert the instance in the database"""
        try:
            session.add(self)
            session.commit()
            return True
        except SQLAlchemyError as err:
            session.rollback()
            getLogger().error(err.args)
            # getLogger().warning(SQLAlchemyError.__dict__)
            return False

    def remove(self, session):
        """Utility used to delete the instance from the database"""
        try:
            session.delete(self)
            session.commit()
            return True
        except SQLAlchemyError:
            session.rollback()
            getLogger().warning(SQLAlchemyError.__dict__)
            return False

    def update(self, session):
        """Utility used to update the instance"""
        try:
            session.commit()
            return True
        except SQLAlchemyError:
            session.rollback()
            getLogger().warning(SQLAlchemyError.__dict__)
            return False

    def to_dict(self):
        """Return the object converted in dictionary"""
        attributes = {}
        for column in self.__table__.columns:
            attributes[column.name] = getattr(self, column.name)
        return attributes

    def __repr__(self):
        class_name = self.__class__.__name__
        attrs = ', '.join(f'{attr}={getattr(self, attr)!r}' for attr in self.__dict__)
        return f'{class_name}({attrs})'


class HubCoreEntity(ExtendedBase):
    """ Hub Core Entities """
    __tablename__ = "hc_entities"
    id = Column(INTEGER(11), primary_key=True, autoincrement=True)
    driver = Column(String(16), nullable=False)
    field_id = Column(String(64), nullable=False)
    cfg = Column(JSON, nullable=False, server_default='{}')
    enabled = Column(TINYINT(1), nullable=False, server_default=text('1'))
    name = Column(String(64))
    zone_id = Column(String(8), nullable=False)
    UniqueConstraint(field_id, driver, name="uc_field_id_driver")

    def __init__(self, driver, field_id, cfg, zone_id, name=None, enabled=1):
        super().__init__()
        self.driver = driver
        self.field_id = field_id
        self.cfg = cfg
        self.enabled = enabled
        self.name = name
        self.zone_id = zone_id


class HubCoreEntityDataGroup(ExtendedBase):
    """ Hub Core Entities """
    __tablename__ = "hc_entity_data_groups"
    # TODO: a cosa serve?
    # __table_args__ = (
    #     Index('entity_id', 'entity_id', 'start_dt'),
    #     ForeignKeyConstraint(['entity_id'],['hc_entities.id'], ondelete='CASCADE', onupdate='CASCADE', name='fk_entity_id'),
    # )
    id = Column(INTEGER(11), primary_key=True, autoincrement=True)
    entity_id = Column(INTEGER(11), ForeignKey("hc_entities.id", name="fk_entity_id", onupdate="CASCADE",
                                               ondelete="CASCADE"), nullable=False)
    start_dt = Column(DateTime, nullable=False)
    UniqueConstraint(entity_id, start_dt, name="uc_entity_id_start_dt")

    def __init__(self, entity_id: int, start_dt):
        super().__init__()
        self.entity_id = entity_id
        self.start_dt = start_dt

    # entity = relationship('HubCoreEntity', back_populates='hc_entity_data_groups')  # TODO: a cosa serve?
    # hc_measures = relationship('HubCoreMeasure', back_populates='edg')


class HubCoreMeasure(ExtendedBase):
    """ Hub Core Entities """
    __tablename__ = "hc_measures"
    # TODO: a cosa serve?
    # __table_args__ = (
    #     ForeignKeyConstraint(['edg_id'], ['hc_entity_data_groups.id'], ondelete='CASCADE', onupdate='CASCADE', name='fk_edg_id'),
    #     Index('edg_id', 'edg_id')
    # )

    id = Column(INTEGER(11), primary_key=True, autoincrement=True)
    edg_id = Column(INTEGER(11), ForeignKey("hc_entity_data_groups.id", name="fk_edg_id", onupdate="CASCADE",
                                            ondelete="CASCADE"), nullable=False)
    name = Column(String(32))
    unmis = Column(String(32))
    decimals = Column(TINYINT(4))
    tag = Column(String(32), nullable=False)
    UniqueConstraint(edg_id, tag, name="uc_edg_id_tag")

    # edg = relationship('HubCoreEntityDataGroup', back_populates='hc_measures')  # TODO: a cosa serve?

    def __init__(self, edg_id: str, tag: str, name: str, unmis: str, decimals: float):
        super().__init__()
        self.edg_id = edg_id
        self.tag = tag
        self.name = name
        self.unmis = unmis
        self.decimals = decimals


class HubCoreMeasureData(ExtendedBase):
    """ Hub Core Entities """
    __tablename__ = "hc_measure_data"
    # TODO: a cosa serve?
    # __table_args__ = (
    #     Index('measure_id', 'measure_id', 'dt'),
    #     ForeignKeyConstraint(['measure_id'],['hc_measures.id'], ondelete='CASCADE', onupdate='CASCADE')
    # )
    measure_id = Column(INTEGER(11), ForeignKey("hc_measures.id", name="fk_measure_id", onupdate="CASCADE",
                                                ondelete="CASCADE"), primary_key=True, nullable=False)
    dt = Column(DateTime, primary_key=True, nullable=False)
    value = Column(Float, nullable=False)

    def __init__(self, measure_id, dt, value: float):
        super().__init__()
        self.measure_id = measure_id
        self.dt = dt
        self.value = value


class HubCoreDbDiagno(ExtendedBase):
    """TODO"""
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


class HubCoreSgDiagno(ExtendedBase):
    """TODO"""
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
