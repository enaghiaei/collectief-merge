"""Database module: it manages database using SQL Alchemy"""
from logging import getLogger
from sqlalchemy import create_engine, text, event
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.orm import sessionmaker, Session
from modules.configuration.cfg_mariadb import MariadbConfig
from modules.database.models import ExtendedBase


class Database:
    """Database Class"""
    _instance = None

    def __init__(self):
        if Database._instance is not None:
            raise Exception("Database object already created")
        Database._instance = self
        self._db_cfg = MariadbConfig()
        self._usr = self._db_cfg.user
        self._pwd = self._db_cfg.pwd
        self._name = self._db_cfg.name
        self._host = self._db_cfg.host
        self._port = self._db_cfg.port
        self._session = None
        self._engine = None
        self._active = False
        self._reconnecting = False

    @staticmethod
    def get_instance() -> "Database":
        """Return the Database instance"""
        return Database._instance

    def get_session(self) -> Session:
        """Return database session"""
        return self._session()

    @property
    def active(self):
        """Get the database connection status"""
        return self._active

    def connect(self):
        """Open database connection"""
        self._engine = create_engine(f"mysql+pymysql://{self._usr}:{self._pwd}@{self._host}:{self._port}/{self._name}")
        if not database_exists(self._engine.url):
            getLogger().info(f"Creating new database with name '{self._name}'...")
            create_database(self._engine.url)
            getLogger().info("...done!")
        event.listen(self._engine, 'connect', self.on_connect)
        event.listen(self._engine, 'close', self.on_disconnect)
        self._session = sessionmaker(bind=self._engine, expire_on_commit=False)
        ExtendedBase.metadata.create_all(self._engine)

    def disconnect(self):
        """Close database connection"""
        if self._active:
            self._engine.dispose()

    def on_connect(self, dbapi_con, con_record):
        self._active = True
        if self._reconnecting:
            self._reconnecting = False
            getLogger().warning("Reconnected to mariadb database")
        else:
            getLogger().info("Connected to mariadb database")

    # SQLAlchemy has default automatic reconnection
    def on_disconnect(self, dbapi_con, con_record):
        self._active = False
        self._reconnecting = True
        getLogger().warning("Lost connection to mariadb database")

    def get_db_size(self):
        """Get the database size in MB"""
        session = self.get_session()
        stmt = f"SELECT SUM(data_length + index_length) / 1024 / 1024 FROM information_schema.TABLES" \
               f" WHERE table_schema = '{self._name}'"
        db_size = session.execute(text(stmt))
        session.close()
        return db_size.scalars().first()

    def get_table_row_count(self, table_name, type="estimated"):
        """Get row count for a specific table into database"""
        session = self.get_session()
        # Note: the 'precise' stmt gives the precise row count, but it takes a lot of time. For example, with
        # approximately 3 million rows, the 'information_schema' takes 60ms, while 'count' takes more than 900ms (15
        # times slower).
        # On the other hand, 'precise' method returns 2'808'000 rows, while the 'estimated' one returns
        # 2'802'500 rows. Since the error is about 0.2%, the 'estimated' method has been chosen as default one
        if type == "precise":
            stmt = f"SELECT COUNT(*) FROM {table_name}"
        else:
            stmt = f"SELECT TABLE_ROWS FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '{self._name}'" \
                   f" AND TABLE_NAME = '{table_name}'"
        row_count = session.execute(text(stmt))
        session.close()
        return row_count.scalars().first()


