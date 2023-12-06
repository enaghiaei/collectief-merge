from sqlalchemy import create_engine, select, insert, delete, func, desc
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError, DisconnectionError
from paho.mqtt.client import Client
from actuation_engine.algorithms.utils.data import LIBRARY_SCHEMA
import numpy as np
import json
from db.models import *
from assets import Asset
from utils.data import path_merge, flatten_item, process_flat_keys, filter_flat_keys
from utils.functions import generate_library_dict, fanger_comfort_limits, generate_reward, generate_actuator_choices, deactivation_actuator
import importlib
from math import isnan
from pytz import utc
from math import ceil, floor
import jsonschema
import os
from functools import wraps
from time import sleep
from typing import Callable
from datetime import datetime, timedelta

class Library:
    # the approach of the library class is different
    _library_schema = LIBRARY_SCHEMA
    """
    Library class to manage import and export of the library as well as performing the queries

    Parameters
    ----------
    session_factory : sessionmaker
        Session factory, from SQLAlchemy, used for managing the data.
    assets : Asset, optional
        Asset dictionary to be used to generate the dictionary in case the library is empty.
    library : dict, optional
        Library dictionary to save to the database for making calls to the database.

    Returns
    -------
    None
        This function does not return any value.
    """
    def __init__(self, session_factory: sessionmaker, library: dict = None):
        self.session_factory = session_factory
        if library is None:
            library = {}
        self.library_table = library
        self.upload_library()

    @property
    def library_table(self):
        return self._library_table

    @library_table.setter
    def library_table(self, library):
        """

        """
        flat_library = flatten_item(library, flatten_list=True, max_level=5)

        # process the flattened library containing the action and reward values
        action_library = process_flat_keys(filter_flat_keys(flat_library, "action"),
                                           ["zone_id", "season_id", "signal_val", "hour", "type", "action"],
                                           prune="type")
        reward_library = process_flat_keys(filter_flat_keys(flat_library, "reward"),
                                           ["zone_id", "season_id", "signal_val", "hour", "type", "reward"],
                                           prune="type")

        # merge reward and action library ( they are ordered correctly automatically)
        library = [{**reward, **action} for reward, action in zip(reward_library, action_library)]

        # remove the doubles
        library = [json.loads(i) for i in set(json.dumps(lib) for lib in library)]

        for lib in library:
            lib['season_id'] = float(lib['season_id'])
            lib['hour'] = float(lib['hour'])
            lib['reward'] = lib['reward'] if not isnan(lib['reward']) else None

        self._library_table = library

    @library_table.deleter
    def library_table(self):
        del self._library_table

    def upload_library(self):
        with self.session_factory() as session:
            result = session.execute(select(DsmSignalLibrary)).first()
            if result:
                session.execute(text("""TRUNCATE TABLE dsm_signal_library"""))

            instances = [DsmSignalLibrary(**kwargs) for kwargs in self.library_table]
            session.add_all(instances)
            session.commit()

    def download_library(self, path: str):
        """
        download the library table as a complete file that contains all the data descriptions
        """
        with self.session_factory() as session:
            # obtain the zones
            zones = [row[0] for row in session.execute(select(DsmSignalLibrary.zone_id).distinct())]
            # generate the ranges according to season
            hours = list(range(0, 8))
            signals = list(range(1, 6))
            seasons = list(range(1, 5))
            # noinspection PyTypeChecker
            library = {
                zone: {
                    season: {
                        signal: {
                            hour: {
                                "reward": [row[0] for row in
                                           session.execute(select(DsmSignalLibrary.reward).where(
                                               DsmSignalLibrary.zone_id == zone,
                                               DsmSignalLibrary.season_id == season,
                                               DsmSignalLibrary.signal_val == signal,
                                               DsmSignalLibrary.hour == hour
                                           ))],
                                "action": [row[0] for row in
                                           session.execute(select(DsmSignalLibrary.action).where(
                                               DsmSignalLibrary.zone_id == zone,
                                               DsmSignalLibrary.season_id == season,
                                               DsmSignalLibrary.signal_val == signal,
                                               DsmSignalLibrary.hour == hour
                                           ))]
                            }
                            for hour in hours
                        }
                        for signal in signals
                    }
                    for season in seasons
                }
                for zone in zones
            }
            with open(path, "w") as j:
                json.dump(library, j)
            # query = select(DsmSignalLibrary).where(DsmSignalLibrary.zone_id == zones[0])
            # result = [row for row in session.execute(query)]

    @classmethod
    def library_dict_is_valid(cls, library: dict):
        """
        Check the validity of the library dictionary imported from local memory.

        Parameters
        ----------
        library : dict[str, dict[str, dict[dict[str, dict[str, dict[str, list[list|float]]]]]]]
            Library dictionary following the zone_name, season, signal, hour parameter.

        Returns
        -------
        True or False, depending on whether the schema is validated.
        """
        try:
            jsonschema.validate(instance=library, schema=cls._library_schema)
            # todo add check for equal length of action and rewards
            # todo check that the actions correspond to the values
            return True
        except jsonschema.exceptions.ValidationError as e:
            print(f"JSON data does not follow the schema: {e}")
            return False

    @classmethod
    def load_from_file(cls, session_factory: sessionmaker,
                       file_path):
        """
        Load from file_path. It also performs a check for absolute path vs relative path and finds a common path.

        Parameters
        ----------
        session_factory : sessionmaker
            Session parameter (preferable to use the Library instance's session_factory).
        file_path : str, optional
            Path from which to load the library. It usually goes in the config folder, but custom file paths can be
            available.

        Returns
        -------
        """
        abs_path = os.getcwd()
        path = path_merge(abs_path=abs_path, rel_path=file_path)

        with open(path, 'r') as f:
            library: dict = json.load(f)

        return cls(library=library, session_factory=session_factory)

    @classmethod
    def load_from_asset(cls, session_factory: sessionmaker, assets: Asset):
        library = generate_library_dict(assets)
        return cls(session_factory=session_factory, library=library)


# noinspection PyTypeChecker
class RLDSM(object):
    """
    RLDSM class for performing the algorithm functionality. The reason for the class choice is given from the
    necessity of preserving state for some parameters that are constant.

    Attributes
    ----------
    assets : Asset
        Asset object to be used to retrieve the data of a given zone or multiple zones, as well as perform specialized
        methods called into question.
    randomness : float, optional
        Randomness hyperparameter of the model, by default None.
    library : str | dict | Library, optional
        Initial library. It can be empty in case of dealing with an uninitialized RLDSM execution, by default None.
    libraryLength: int
        Maximum length of a library for each zone/hour/season/signal
    cycle_cutoff : int, optional
        Maximum time cutoff in minutes for each case, defaults to 15.
    """
    def __init__(self, assets: Asset, db_url: str = None, Session: sessionmaker = None,
                 randomness: float = 0.9, library: str | dict | Library = None, libraryLength: int = 20,
                 cycle_cutoff = 15):
        self.result_df = None
        if db_url:
            self.engine = create_engine(db_url)
            self.Session = sessionmaker(bind=self.engine)
        elif Session:
            self.Session = Session
        else:
            raise ValueError("Neither database URL nor sessionmaker object passed")
        self.latest_timestamp = None
        self.cycle_timestamp = None
        self.mqtt_client = Client(client_id="RLDSM at edge node")
        self._history = None
        self._signal = 1
        self.assets = assets
        self.randomness = randomness
        self.custom_methods = importlib.import_module('.customFunctions', 'algorithms.utils')
        # self.historical_demand = historicDemand = pd.read_csv(path+'/data/monitoredValuesHistoric.csv')['totalEnergy']

        if library and isinstance(library, str) and os.path.exists(library):
            self.library = Library.load_from_file(session_factory=self.Session, file_path=library)

        elif library and isinstance(library, dict):
            self.library = Library(session_factory=self.Session, library=library)

        elif library and isinstance(library, Library):
            self.library = library
        else:
            self.library = Library.load_from_asset(session_factory=self.Session, assets=self.assets)

        self.libraryLength = libraryLength
        self.cycle_cutoff = cycle_cutoff
        self.resultPre = None
        self.result = None

    @property
    def signal(self):
        return self._signal

    @property
    def hour(self):
        return floor(datetime.now().hour/3)

    @property
    def season_id(self):
        return ceil(datetime.now().month/3)

    @signal.setter
    def signal(self, other: tuple[Callable, dict]):
        """
        Set the signal property.

        Parameters
        ----------
        other : tuple[Callable, dict]
            Tuple to perform the call. It includes the method parameter as well as the kwargs,
            in order to retrieve the data necessary to perform the functions.
        """
        method, kwargs = other
        self._signal = method(**kwargs)

    @property
    def operationMode(self):
        """
        calculate the operation mode depending on the current timestamp, no arguments
        """
        t = datetime.now()
        if t.month < 4 or t.month > 9:
            operationMode = 'Heating'
        else:
            operationMode = 'Cooling'

        return operationMode

    @staticmethod
    def transaction_check(retry_seconds: int):
        """
        Decorator factory for initializing new sessions
        """
        def wrapper(function):
            @wraps(function)
            def decorator(*args, **kwargs):
                retry_count = 0
                self = args[0]
                with self.Session() as session:
                    while True:
                        try:
                            response = function(session=session, *args, **kwargs)
                            session.commit()
                            return response
                        except IntegrityError as e:
                            print(e, "check the input...")
                            session.rollback()
                        except DisconnectionError as e:
                            # handle disconnection and retry again later
                            session.rollback()
                            print(e, f"\nretrying again in {retry_seconds} seconds...")
                            sleep(retry_seconds)
                            retry_seconds = retry_seconds * 2
            return decorator
        return wrapper

    @transaction_check(10)
    def _get_measurements(self, tag, edg_ids, session=None):
        # edg_ids are already queried before from _get_entity_data_groups
        if session is None:
            print("No session passed, new session being created")
            session_check = True
            session = self.Session()
        else:
            session_check = False
        queries = [self._get_measurements_query(edg_id, tag) for edg_id in edg_ids]

        if len(edg_ids) > 1:
            query = queries[0].union(*queries[1:])
        elif len(edg_ids) == 1:
            query = queries[0]
        else:
            return
        # print(query)

        result = [{"dt": row[0], "value": row[1]} for row in session.execute(query).fetchall()]
        if session_check:
            session.close()

        return result

    def _get_measurements_query(self, edg_id: int, tag: str, alt_timestamp: datetime = None):
        if alt_timestamp:
            datetime_limit = alt_timestamp
        else:
            datetime_limit = self.latest_timestamp
        query = select(HubCoreMeasureData.dt, HubCoreMeasureData.value).where(
            HubCoreMeasureData.measure_id == select(HubCoreMeasure.id).where(
                                        HubCoreMeasure.edg_id == edg_id,
                                        HubCoreMeasure.tag == tag,
                                        HubCoreMeasureData.dt > datetime_limit - timedelta(minutes=self.cycle_cutoff)
                                    )
                                )
        return query

    @transaction_check(2)
    def _get_entity_data_groups(self, driver: str, field_id: str, session=None):
        if session is None:
            print("No session passed, new session being created")
            session_check = True
            session = self.Session()
        else:
            session_check = False

        entity_q = select(HubCoreEntity.id).where(
            HubCoreEntity.driver == driver,
            HubCoreEntity.field_id == field_id
        )

        entity_id = session.execute(entity_q).first()
        print(entity_id)
        entity_id = entity_id[0] if entity_id else None
        print(entity_id)
        # print(f"the obtained session id is {entity_id}")
        # retrieve all entity data groups for a given entity_id
        # noinspection PyTypeChecker
        edg_q = select(HubCoreEntityDataGroup) \
            .where(HubCoreEntityDataGroup.entity_id == entity_id) \
            .order_by(HubCoreEntityDataGroup.start_dt.desc())
        edg_query_result = session.execute(edg_q)
        print(edg_query_result)
        edg_ids = [row.HubCoreEntityDataGroup.id for row in edg_query_result]
        # print(f"the edg_ids found are {edg_ids}")

        if session_check:
            session.close()

        return edg_ids

    def _gather_sensor_data(self, driver, field_id, tags):
        # make test for this function
        edg_ids = self._get_entity_data_groups(driver=driver, field_id=field_id)
        # print("entity data groups:", edg_ids)
        result = dict()
        for tag in tags:
            result[f"{driver}/{field_id}/{tag}"] = self._get_measurements(tag, edg_ids)
        return result

    def gather_sensor_credentials(self):
        return {zone: process_flat_keys(self.assets.flatten_item("zones", zone, "sensors"),
                                            ["driver", "field_id"], "tags") for zone in self.assets.zones}

    def gather_sensors_data(self, cycle_cutoff: float = None):
        if cycle_cutoff:
            cc_old = self.cycle_cutoff
            self.cycle_cutoff = cycle_cutoff
        self.latest_timestamp = datetime.now(tz=utc)
        sensor_credentials = self.gather_sensor_credentials()
        sensor_results = dict.fromkeys(self.assets.zones)
        for zone in self.assets.zones:
            for s in sensor_credentials[zone]:
                zone_sensor_data = self._gather_sensor_data(**s)
                print(zone_sensor_data)
                sensor_results[zone] = {**sensor_results[zone], **zone_sensor_data}\
                    if isinstance(sensor_results[zone], dict) else zone_sensor_data
                print(sensor_results[zone])
        if cycle_cutoff:
            self.cycle_cutoff = cc_old
        return sensor_results

    def gather_metrics_credentials(self):
        metrics = dict.fromkeys(self.assets.zones)
        for zone in self.assets.zones:
            metrics[zone] = process_flat_keys(
                filter_flat_keys(self.assets.flatten_item('zones',zone, max_level=1), 'indicators'),
                ['indicator', 'tag'],
                element_key_name='description',
                prune=['indicator']
                )
        return metrics

    def _calculate_metric(self, sensor_results, args: dict[str, str], energy_method: str | Callable):
        if isinstance(energy_method, str):
            try:
                method = getattr(self.custom_methods, energy_method)
            except AttributeError:
                raise AttributeError("The method has not yet been added, please review the customFunctions.py file")

        elif isinstance(energy_method, Callable):
            method = energy_method
        else:
            raise TypeError("The energy method must either be a string or a")

        try:
            arguments = {arg: sensor_results[address][-1] for arg, address in args.items()}
            result = method(**arguments)
            return result
        except KeyError as e:
            raise KeyError(f"Key is missing, please review the asset dictionary and fix its functioning {e}")

    def gather_metrics(self, sensor_results):
        self.resultPre = self.result
        indicator_dict = self.gather_metrics_credentials()
        indicator_results = dict.fromkeys(self.assets.zones, dict())
        # todo manipulate the result data in a way that the indicators can be easily calculated from within this
        for zone, indicators in indicator_dict.items():
            print(indicator_dict)
            for indicator in indicators:
                description = indicator.get('description')
                if isinstance(description, dict):
                    indicator_result = self._calculate_metric(sensor_results[zone],
                                                              **indicator.get())
                    indicator_results[zone][indicator.get('tag')] = indicator_result
                elif isinstance(description, str):
                    indicator_results[zone][indicator.get('tag')] = sensor_results[zone][indicator.get('description')]
        self.result = indicator_results
        return indicator_results

    def _monitor(self, sensor_results, indicator_results, action):
        """
        Monitoring functions to determine the reward value, handles the logic between calculating the reward function
        locally or relying on external components (e.g. the CLuster node)

        Parameters
        ----------
        sensor_results : dict
            result of the latest measurements
        indicator_results: dict
            results of the indicators
        resultsPre: dict
            result of the previous measurements
        action: list
            previous set-points for each actuator

        Returns
        -------
        totalEnergy: float
            estimated total energy expenditure of the system
        action:
            resulting action given the previous one
        reward:
            reward of the new action
        ____
        move the scope of adding new actions to an outside function
        """
        for zone in self.assets.zones:
            zoneCategory = self.assets.get_item('zones', zone, 'zoneCategory')
            OPTTempUpper, OPTTempLower = fanger_comfort_limits(zoneCategory, self.signal)
            OptTemp = indicator_results[zone]['optTemp']
            energy = indicator_results

    @transaction_check(5)
    def _count_librarylength(self, zone, session=None):
        if session is None:
            print("No session passed, new session being created")
            session_check = True
            session = self.Session()
        else:
            session_check = False

        count_query = select(func.count(DsmSignalLibrary.reward)).where(
            DsmSignalLibrary.signal_val == self.signal,
            DsmSignalLibrary.hour == self.hour,
            DsmSignalLibrary.season_id == self.season_id,
            DsmSignalLibrary.zone_id == zone
        )

        result = session.execute(count_query).first()
        length = int(result[0]) if result else 0

        if session_check:
            session.close()

        return length

    @transaction_check(10)
    def _delete_redundant_memory(self, zone, session=None):
        if session is None:
            print("No session passed, new session being created")
            session_check = True
            session = self.Session()
        else:
            session_check = False

        subquery_min_reward = select(DsmSignalLibrary.reward).where(
            DsmSignalLibrary.signal_val == self.signal,
            DsmSignalLibrary.hour == self.hour,
            DsmSignalLibrary.season_id == self.season_id,
            DsmSignalLibrary.zone_id == zone
        ).order_by(desc(DsmSignalLibrary.reward)).limit(1).subquery()

        # Create the delete query using the SELECT and DELETE constructs
        query = delete(DsmSignalLibrary).where(
            DsmSignalLibrary.signal_val == self.signal,
            DsmSignalLibrary.hour == self.hour,
            DsmSignalLibrary.season_id == self.season_id,
            DsmSignalLibrary.zone_id == zone,
            DsmSignalLibrary.reward == subquery_min_reward
        )
        session.execute(query)

        if session_check:
            session.close()

    @transaction_check(2)
    def _insert_new_library_item(self, action, reward, zone, session = None):
        query = insert(DsmSignalLibrary).values(signal_val=self.signal, hour=self.hour, zone_id=zone,
                                                season_id=self.season_id, reward=float(reward),
                                                action=action)
        session.execute(query)
        session.commit()

    def _calculate_total_energy(self, results):
        """
        this is valid for both previous and current results
        """
        return sum([results.get(zone, {"energy": 0})["energy"] for zone in self.assets.zones])


    def monitor(self, results, resultsPre, action):
        totalEnergy = 0
        for zone in self.assets.zones:
            zoneCategory = self.assets.get_item('zones', zone, 'zoneCategory')

            OPTTempUpper, OPTTempLower = fanger_comfort_limits(zoneCategory, self.signal)
            # handle result from the call of the system+
            OPTTemp_t = results[zone][zone+'_t_rh']

            energyCurrent = results[zone]['energy']
            energyPre = resultsPre[zone]['energy']
            if type(energyPre) != int or float:
                energyPre = 0
            reward = generate_reward(energyCurrent, energyPre, OPTTemp_t, OPTTempUpper, OPTTempLower, zoneCategory,
                                     self.signal)
            # action is the combination of actuators within a zone

            # include the code to generate actions
            # latestAction = [command[building][zone][i] for i in command[building][zone]]
            if self.signal > 0:
                with self.Session() as session:
                    # drop the action with the lowest reward
                    # noinspection PyTypeChecker
                    count_query = select(func.count(DsmSignalLibrary.reward)).where(
                        DsmSignalLibrary.signal_val == self.signal,
                        DsmSignalLibrary.hour == self.hour,
                        DsmSignalLibrary.season_id == self.season_id,
                        DsmSignalLibrary.zone_id == zone
                    )

                    result = session.execute(count_query).first()
                    length = int(result[0]) if result else 0

                    if length > self.libraryLength:
                        subquery_min_reward = select(DsmSignalLibrary.reward).where(
                            DsmSignalLibrary.signal_val == self.signal,
                            DsmSignalLibrary.hour == self.hour,
                            DsmSignalLibrary.season_id == self.season_id,
                            DsmSignalLibrary.zone_id == zone
                        ).order_by(desc(DsmSignalLibrary.reward)).limit(1).subquery()

                        # Create the delete query using the SELECT and DELETE constructs
                        query = delete(DsmSignalLibrary).where(
                            DsmSignalLibrary.signal_val == self.signal,
                            DsmSignalLibrary.hour == self.hour,
                            DsmSignalLibrary.season_id == self.season_id,
                            DsmSignalLibrary.zone_id == zone,
                            DsmSignalLibrary.reward == subquery_min_reward
                        )
                        session.execute(query)
                    # insert the new element
                    query = insert(DsmSignalLibrary).values(signal_val=self.signal, hour=self.hour, zone_id=zone,
                                                            season_id=self.season_id, reward=float(reward),
                                                            action=action)
                    session.execute(query)
                    session.commit()
            totalEnergy += energyCurrent

        return totalEnergy

    def control(self, results, OPTTempUpper, OPTTempLower, actionSet, activeControl: bool = False):
        # query the zones here after generating

        with self.Session as session:
            for zone in self.assets.zones:
                # if building in zone:
                actuatorFeatures = self.assets.get_item('zones', zone, 'actuators')
                if actuatorFeatures:
                    if self.signal == 0:
                        print('|RELAX|', end=' ')  # todo replace it with logging
                        action = deactivation_actuator(
                            action, actuatorFeatures, 2)
                    if self.signal > 0:
                        optTemp = results.get('optTemp')
                        if results["optTemp"] < OPTTempUpper and optTemp > OPTTempLower:  # optTemp within hte limits
                            actuatorChoices = generate_actuator_choices(
                                action, self.operationMode, self.signal, actuatorFeatures)
                            # Choose randomly or based on reward
                            if np.random.random() > self.randomness:  # Choose form library
                                # Check if the Memery contains enough records to choose from them
                                count_query = select(func.count(DsmSignalLibrary.action)).where(
                                    DsmSignalLibrary.signal_val == self.signal,
                                    DsmSignalLibrary.hour == self.hour,
                                    DsmSignalLibrary.season_id == self.season_id,
                                    DsmSignalLibrary.zone_id == zone
                                )

                                action_query = select(DsmSignalLibrary.action).where(
                                    DsmSignalLibrary.signal_val == self.signal,
                                    DsmSignalLibrary.hour == self.hour,
                                    DsmSignalLibrary.season_id == self.season_id,
                                    DsmSignalLibrary.zone_id == zone
                                ).order_by(DsmSignalLibrary.reward).limit(1)

                                result = session.execute(count_query).first()
                                count = int(result[0]) if result else 0
                                if count > 5:
                                    print('|WISE|', end=' ')
                                    action = session.execute(action_query).first()[0]
                                else:
                                    print('|LEARN|', end=' ')
                                    action = actuatorChoices[np.random.choice(
                                        np.arange(len(actuatorChoices)))]
                            else:  # Random choice with a chance of Randomness
                                print('|CURIOUS|', end=' ')
                                action = actuatorChoices[np.random.choice(
                                    np.arange(len(actuatorChoices)))]
                        else:
                            action = deactivation_actuator(
                                action, actuatorFeatures, 2)
