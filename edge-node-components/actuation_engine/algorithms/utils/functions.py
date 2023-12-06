import numpy as np
from datetime import datetime, timedelta

from meteostat import Stations, Hourly

from actuation_engine.algorithms.utils.data import flatten_item, filter_flat_keys
from actuation_engine.algorithms.assets import Asset
from math import ceil


# Sending the setpoints
# TODO modify this to include the case of logging
# from send_set_points.api.configuration import INI_FILE, LOG, TIME, IP_ADDRESS, DATAFRAME
# from send_set_points.api.sginterop import SGINTEROP
# from meteostat import Hourly, Stations

# %% RL-DSM functions

# def get_pilot_builidng_weather_data(lat, lon, date_start, date_end):
#
#     '''
#
#
#     Parameters
#     ----------
#     lat: float
#         Latitute of the building
#     log: float
#         Logitute of the building
#     date_start: datetime
#         Initial date of the selected period
#     date_end: datetime
#         Final date of the selected period
#
#
#     Returns
#     -------
#     datax: weather data in xarray format
#     station: info of the nearest station
#
#     '''
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#

# TODO export this to a result table that can be used
# def results_csv(results, fileName, mainPath, method, buildingList, t):
#     '''
#     In forward method, this function append the monitored/simulated results into a csv file
#     in data folder named "resutlsHistory.csv".
#     The instantanous values are stored in "results.csv" for furhter process
#     in the algorithm. This will be overwritten at each run.
#     The columns in the csv file are all the sensor variables within all the zones.
#     In backward method, this function makes a result dictionary from the stored
#     csv file from the previous timestep values.
#
#     Parameters
#     ----------
#     results : dict
#         The latest results dictionary.
#     fileName : str
#         csv file name without the extension.
#     mainPath : str
#         working directory path.
#     method : str
#         forward: write to csv
#         backward: read from csv and make the dictionary.
#
#     Returns
#     -------
#     A csv file/append a row to a csv file.
#
#     '''
#
#     if method == 'forward':
#         flattenResults = {}
#         flattenResults['timestamp'] = t.timestamp()
#         flattenResults['Signal'] = results['Signal']
#         flattenResults['totalEnergy'] = results['totalEnergy']
#
#         for building in results.keys():
#             if building in buildingList:
#                 for zone in results[building].keys():
#                     for item in results[building][zone].keys():
#                         flattenResults[item] = results[building][zone][item]
#
#         path = mainPath + '/data/'
#         if f'{fileName}Historic.csv' in os.listdir(path):
#             pd.DataFrame.from_dict(flattenResults, orient='index').transpose().to_csv(path + f'{fileName}Historic.csv',
#                                                                                       mode='a', header=None, index=None)
#             pd.DataFrame.from_dict(flattenResults, orient='index').transpose().to_csv(path + f'{fileName}.csv',
#                                                                                       index=None)
#         else:
#             pd.DataFrame([], columns=flattenResults.keys()).to_csv(path + f'{fileName}Historic.csv', index=None)
#     if method == 'backward':
#         path = mainPath + '/data/'
#         previousResults = deepcopy(results)
#         if f'{fileName}.csv' in os.listdir(path):
#             resultsFile = pd.read_csv(path + f'{fileName}.csv')
#             for building in previousResults.keys():
#                 if building in buildingList:
#                     for zone in previousResults[building].keys():
#                         for item in previousResults[building][zone].keys():
#                             previousResults[building][zone][item] = resultsFile[item].iloc[0]
#             previousResults['Signal'] = float(resultsFile['Signal'].iloc[0])
#             previousResults['totalEnergy'] = float(resultsFile['totalEnergy'].iloc[0])
#         else:
#             pass
#
#         return previousResults


# TODO define a data structure to store the controls of the DSM
# def command_csv(command, mainPath, t):
#     '''
#     This function append the control/command values into a csv file
#     in data folder named "commandHistory.csv".
#     The instantanous values are stored in "command.csv" for furhter process
#     in the algorithm. This will be overwritten at each run.
#     The columns in the csv file are all the control variables within all the zones.
#     Parameters
#     ----------
#     command : Dict
#         The latest command.control values after decision-making.
#
#     Returns
#     -------
#     A csv file/append a row to a csv file.
#
#     '''
#
#     flattenCommand = {}
#     flattenCommand['timestamp'] = t.timestamp()
#
#     for building in command.keys():
#         for zone in command[building]:
#             for item in command[building][zone].keys():
#                 flattenCommand[item] = command[building][zone][item]
#
#     path = mainPath + '/data/'
#     if 'commandHistoric.csv' in os.listdir(path):
#         pd.DataFrame.from_dict(flattenCommand, orient='index').transpose().to_csv(path + 'commandHistoric.csv',
#                                                                                   mode='a', header=None, index=None)
#         # pd.DataFrame.from_dict(flattenCommand, orient='index').transpose().to_csv(path+'command.csv', index=None)
#     else:
#         pd.DataFrame([], columns=flattenCommand.keys()).to_csv(path + 'commandHistoric.csv', index=None)


# it requires a complete list of building "objects", which the edge node may not need to know about
# Function deprecated by latest data retrieval method in the RLDSM class
# function could be expunged if it becomes functional

# def generate_results_dict(buildingList, zoneList, sensorList, sphensorList):
#     '''
#     Generate result dictionary including the latest values of each sensor
#
#     Parameters
#     ----------
#     buildingList : array
#         A list contains the buildings names in the algorithm.
#     zoneList : list
#         A list contains the zones names in the algorithm.
#     actuatorList : TYPE
#         A list contains the available actuators in the algorithm.
#
#     Returns
#     -------
#     resultHistory : dict
#         A dictionary containing the last timestep monitored/simulated values.
#
#     '''
#
#     resultHistory = dict.fromkeys(buildingList)
#     for building in buildingList:
#         resultHistory[building] = dict.fromkeys([z for z in zoneList if building in z])
#         for zone in zoneList:
#             if building in zone:
#                 resultHistory[building][zone] = dict.fromkeys([a for a in sensorList if zone in a] + [a for a in sphensorList if zone in a] + [zone+'_energy'])
#     resultHistory['Signal'] = 1


def get_weather_data(latitude: float, longitude: float, n_days: int = 7):
    """
    This function returns data from the nearest weather station given building coordinates (lat, lom)
    :param latitude: latitude of the location
    :type latitude: float
    :param longitude: longitude of the location
    :type longitude: float
    :param n_days: latest timeframe of the request
    """

    endDate = datetime.today().date()  # strptime(ds_sph[arr.all()[0]].timestamp.values[0], '%Y-%m-%d %H:%M:%S')
    startDate = endDate - timedelta(days=7)  # strptime(ds_sph[arr.all()[0]].timestamp.values[-1], '%Y-%m-%d %H:%M:%S')

    ################# API for retriving local weather data (meteostat)  #####################
    stations = Stations()
    stations = stations.nearby(latitude, longitude)
    station = stations.fetch(1)
    print(station)
    start = datetime.fromordinal(startDate.toordinal())
    end = datetime.fromordinal(startDate.toordinal())
    data = Hourly(station, start=start, end=end)
    data = data.normalize()
    data = data.fetch()
    # Here is the dataset of the weather data
    datax = data.to_xarray()
    return datax, station

    datax, station = get_pilot_builidng_weather_data(lat, lon, startDate, endDate)


    OutAir = datax.temp.to_dataframe()

    return OutAir


def generate_library_dict(assets: Asset):
    ''' 
    Making a dictionary containing arrays of ations/rewards. 8 3-hours per season.

    '''
    t = datetime.now()
    months = [str(m) for m in [ceil(t.month / 3)]]
    signals = [str(i) for i in range(1, 6)]
    hour_fractions = [str(i) for i in range(8)]
    library = dict.fromkeys(assets.zones)
    for zone, zonelib in library.items():
        actuatorlib = filter_flat_keys(flatten_item(assets.get_item('zones', zone, 'actuators')), "default")
        defaults = [i for f, i in actuatorlib.items()]
        zonelib = {
            month: {signal: {hour: dict(reward=[1.], action=[defaults]) for hour in hour_fractions} for signal in signals}
            for month in months}
        library[zone] = zonelib

    return library


def operation_mode():
    '''
    Defines the seasonal operation mode based on the date
    Heating season: Oct-Mar
    Cooling season: Apr-Sep
    
    Parameters
    ----------
    SimulationPeriod : Datetime index
        Generated datetime range from simulation Start and End.

    Returns
    -------
    mode : str
        heeating or cooling

    '''

    t = datetime.now()
    if t.month < 4 or t.month > 9:
        Mode = 'Heating'
    else:
        Mode = 'Cooling'

    return Mode


def generate_actuators_features():
    '''
    This function generates actuators and their features.
    Basically the data here should be imported from an external source/file.
    At this stage it is defined here.

    Returns
    -------
    controls : Dict
        A dictionary containing controls. The keys are all the availble  actuators.

    '''
    # 
    actuatorFeature = dict.fromkeys(['thot', 'tcold', 'co2'])
    actuatorFeature['thot'] = {
        'values': {'min': 18,
                   'max': 25
                   },  # Setpoint temperature [C]
        'features': {
            'changeStep': .5,
            'changePerTimestep': 2,
            'biDirectional': False,
            'engagementSignal': 1,
            'operationMode': 'Heating'
        }
    }
    actuatorFeature['tcold'] = {
        'values': {'min': 23,
                   'max': 28
                   },  # Setpoint temperature [C]
        'features': {
            'changeStep': .5,
            'changePerTimestep': 2,
            'biDirectional': False,
            'engagementSignal': 1,
            'operationMode': 'Cooling'
        }
    }
    actuatorFeature['co2'] = {
        'values': {'min': 200,
                   'max': 900
                   },  # Ventilation Rate [m3/m2/s]
        'features': {
            'changeStep': 100,
            'changePerTimestep': 2,
            'biDirectional': True,
            'engagementSignal': 3,
            'operationMode': 'Both'
        }
    }

    return actuatorFeature


def generate_actuator_choices(action, operationMode, Signal,
                              actuatorFeature):  # AHMAD CHECK FOR GLOBALSSSS!!!!!!**********
    '''
    At each timestep/zone, this function generates a set of possible choices
    for the action to set the actuators values based on the current action
    and the actuatorFeature dictionary.

    Parameters
    ----------
    actuatorFeature : Dict/JSON
        A dictionary including the actuators and its features.
        Can be imported from a JSON file
    action : List
        A list represeting the values of the current actuator values in
        the same order as the assets dict.

    Returns
    -------
    actionChoices : List of Lists
        A list including possible choices for action within a zone/timestep.

    '''

    # Making possible controls for a zone based on each control parameter's features
    tempList = []
    counter = -1
    controlList = []
    for actuator in actuatorFeature:
        counter += 1
        if actuatorFeature[actuator]['features']['operationMode'] == operationMode or \
                actuatorFeature[actuator]['features']['operationMode'] == 'Both':
            if Signal >= actuatorFeature[actuator]['features']['engagementSignal']:
                if actuatorFeature[actuator]['features']['biDirectional']:
                    tempList = np.array(
                        [i + action[counter] for i in [j * actuatorFeature[actuator]['features']['changeStep'] \
                                                       for j in list(
                                range(1, actuatorFeature[actuator]['features']['changePerTimestep'] + 1))]] +
                        [action[counter]] +
                        [i + action[counter] for i in [j * -1 * actuatorFeature[actuator]['features']['changeStep'] \
                                                       for j in list(
                                range(1, actuatorFeature[actuator]['features']['changePerTimestep'] + 1))]])
                else:
                    tempList = np.array([action[counter]] + [i + action[counter] for i in
                                                             [j * actuatorFeature[actuator]['features']['changeStep'] \
                                                              for j in list(range(1,
                                                                                  actuatorFeature[actuator]['features'][
                                                                                      'changePerTimestep'] + 1))]])
                # Remove values out off bounds
                tempList = np.delete(tempList, np.where(tempList > actuatorFeature[actuator]['values']['max']))
                tempList = np.delete(tempList, np.where(tempList < actuatorFeature[actuator]['values']['min']))
                if len(tempList) == 0:  # If the current control value is min/max adds it to the list  
                    tempList = [action[counter]]
            else:
                tempList = [action[counter]]
        else:
            tempList = [action[counter]]
        controlList.append(tempList)
    if len(controlList) == 1:
        actionChoices = controlList
    if len(controlList) == 2:
        actionChoices = np.array(np.meshgrid(controlList[0], controlList[1])).T.reshape(-1, len(controlList))
    if len(controlList) == 3:
        actionChoices = np.array(np.meshgrid(controlList[0], controlList[1], controlList[2])).T.reshape(-1,
                                                                                                        len(controlList))
    if len(controlList) == 4:
        actionChoices = np.array(np.meshgrid(controlList[0], controlList[1], controlList[2], controlList[3])).T.reshape(
            -1, len(controlList))
    if len(controlList) == 5:
        actionChoices = np.array(
            np.meshgrid(controlList[0], controlList[1], controlList[2], controlList[3], controlList[4])).T.reshape(-1,
                                                                                                                   len(controlList))
    if len(controlList) == 6:
        actionChoices = np.array(
            np.meshgrid(controlList[0], controlList[1], controlList[2], controlList[3], controlList[4],
                        controlList[5])).T.reshape(-1, len(controlList))
    if len(controlList) > 6:
        print(
            'DSM ERROR>>> The number of actuators are more than 4. Please set the actionChoices manually in generate_actuator_choices.')

    return actionChoices


def deactivation_actuator(action, actuatorFeature, step):
    '''
    This function tends to move the actuators toward the defualt values.

    Parameters
    ----------
    action : list
        A list containing the current values of the actuators.
    actuatorFeature : dict
        The dictionary containing the actuator features from the system setup.
    step : int
        Steps from the current actuator value and the default values.

    Returns
    -------
    list
        A list of actuators between the current and default values.

    '''

    # actuator types:
    # HVAC setpoint is the only one for now

    def find_nearest(array, value):
        idx = (np.abs(array - value)).argmin()

        return array[idx]

    Deactiveaction = []
    for i, tpl in enumerate(actuatorFeature.items()):
        key, item = tpl
        settings = item.get('settings')
        values = item.get('values')
        if settings and item.get('actuatorType') == 'HVAC_setpoint':
            changeStep = settings.get('changeStep')
            # absolute value instead of doing an if
            Range = np.arange(values['min'], values['max']+1, abs(changeStep))
            # Range = np.arange(values['max'], values['min']+1, changeStep)
            avg_action = (action[i] + values['default']) / step
            Deactiveaction.append(find_nearest(Range, avg_action))
    # for i, actuator in enumerate(actuatorFeature):
    #     if actuatorFeature[actuator]['features']['changeStep'] > 0:
    #         Range = np.arange(actuatorFeature[actuator]['values']['min'],
    #                           actuatorFeature[actuator]['values']['max'] + 1,
    #                           actuatorFeature[actuator]['features']['changeStep'])
    #     if actuatorFeature[actuator]['features']['changeStep'] < 0:
    #         Range = np.arange(actuatorFeature[actuator]['values']['max'],
    #                           actuatorFeature[actuator]['values']['min'] - 1,
    #                           actuatorFeature[actuator]['features']['changeStep'])
    #
    #     Deactiveaction.append(find_nearest(Range, Averageaction[i]))

    return Deactiveaction


def fanger_comfort_limits(category, signal):
    '''
    This function calculates the upper and lower limits for indoor
    temperaure based on Fanger Comfort Model according to EN 16798.

    Parameters
    ----------
    category : int
        Building category according to EN 16798: catI (1), catII (2), catIII (3).
    signal : int
        Current signal in the system.
    
    Returns
    -------
    upper_limit: Fanger model upper limit
    lower_limit: Fanger model lower limit

    '''
    if signal > 3:
        s = 1
    else:
        s = 0
    if category == 1:
        OPTTemp_upper = 25.5 + s
        OPTTemp_lower = 21 - s
    elif category == 2:
        OPTTemp_upper = 26 + s
        OPTTemp_lower = 20 - s
    elif category == 3:
        # TODO ask @Panayiotis and @Mohammad to add the category three??
        OPTTemp_upper = 26 + s
        OPTTemp_lower = 20 - s

    return OPTTemp_upper, OPTTemp_lower


# is this implemented on edge or cluster node?
def generate_signal(demandTotal, demandLowerBound=1, demandHigherBound=5):
    '''
    Generate signal based on the typical demand.

    Parameters
    ----------
    demandTtoal : int
        Total energy demand at time t.
    demandLowerBound : float
        A percentile of the seasonal historic measured electricity represetning
        the lower boundary of generating signal. (Signal 1)
    demandHigherBound : float
        A percentile of the seasonal historic measured electricity represetning
        the higher boundary of generating signal. (Signal 5)

    Returns
    -------
    An integer representing the signal from 0 to 5.

    '''

    if demandTotal < demandLowerBound:
        signal = 0
    else:
        signal = min(int(((demandTotal - demandLowerBound) * 4) / (demandHigherBound - demandLowerBound)) + 1, 5)

    return int(signal)


# def generate_reward (Et, Et0, OPTTemp_t, OPTTempUpper, OPTTempLower):
#     '''
#     Generate reward based on the demand and operative temperature. If aggreegated demand for several
#     zones are used, operative temperatures for the zones has to be imported as a list.

#     Parameters
#     ----------
#     Et : float
#         Agreegated electricity demand at time t.
#     Et0 : float
#         Agreegated electricity demand at time t-1.
#     OPTTemp_t : float or list of float
#         Zone operative temperature at time t.
#     OPTTemp_upper : float or list of float
#         Zone operative temperature upper threshold based on adaptive comfort model at time t.
#         This value comes from adaptive_comfort_limits function
#     OPTTemp_lower : float or list of float
#         Zone operative temperature lower threshold based on adaptive comfort model at time t.
#         This value comes from adaptive_comfort_limits function

#     Returns
#     -------
#     reward : float
#         A numeric value represeting reward for the current conditions.

#     '''

#     if Et0 - Et > 0: E = True
#     else: E = False

#     if OPTTemp_t > OPTTempLower and OPTTemp_t < OPTTempUpper: C = True
#     else: C = False

#     if C and E:
#         reward = 1
#     elif C or E:
#         reward = 0
#     if C == False and E == False:
#         reward = -1

#     return reward

def generate_reward(Elec_t, Elec_tPre, OPTTemp_t, OPTTemp_upper, OPTTemp_lower, Category, Signal):
    '''
    Generate reward based on the demand and operative temperature. If aggreegated demand for several
    zones are used, operative temperatures for the zones has to be imported as a list.

    Parameters
    ----------
    Elec_t : float
        Agreegated electricity demand at time t.
    Elec_tPre : float
        Agreegated electricity demand at time t-1.
    OPTTemp_t : float or list of float
        Zone operative temperature at time t.
    OPTTemp_upper : float or list of float
        Zone operative temperature upper threshold based on adaptive comfort model at time t.
        This value comes from adaptive_comfort_limits function
    OPTTemp_lower : float or list of float
        Zone operative temperature lower threshold based on adaptive comfort model at time t.
        This value comes from adaptive_comfort_limits function
    Category : int or list of int
        Zone category based on EN 16798. The value can be an integer between 1, 2, 3, and 4 correspnding
        to categry I, II, III, and IV.
    Signal : int
        The current signal in the system

    Returns
    -------
    Reward : float.
        A numeric value represeting reward for the current conditions.

    '''

    if Signal == 5:
        ComfortWeight = 0.15
    else:
        ComfortWeight = 0.50

    try:
        CoeffElec = (Elec_t - Elec_tPre) / Elec_t
    except ZeroDivisionError:
        CoeffElec = 1

    if CoeffElec < 0: CoeffElec = 0
    if type(OPTTemp_t) == list and type(OPTTemp_upper) == list and type(OPTTemp_lower) == list and type(
            Category) == list:
        CoeffComfort = []
        for i in range(len(OPTTemp_t)):
            if OPTTemp_lower[i] < OPTTemp_t[i] < OPTTemp_upper[i]:
                CoeffComfort.append(1)
            else:
                CoeffComfort.append(Category[i] / 4)
        AverageCoeffComfort = sum(CoeffComfort) / len(CoeffComfort)
        Reward = round((1 - ComfortWeight) * CoeffElec + ComfortWeight * AverageCoeffComfort, 2)

    else:
        if OPTTemp_lower < OPTTemp_t < OPTTemp_upper:
            CoeffComfort = 1
        else:
            CoeffComfort = Category / 4
        Reward = round((1 - ComfortWeight) * CoeffElec + ComfortWeight * CoeffComfort, 2)

    return Reward
