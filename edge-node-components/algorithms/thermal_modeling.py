from pythermalcomfort.models import pmv_ppd
from pythermalcomfort.utilities import v_relative, clo_dynamic
from pythermalcomfort.utilities import met_typical_tasks
from pythermalcomfort.utilities import clo_individual_garments
import numpy as np
import os
from time import time
import requests

BASIC_AUTH = 'Y29sbGVjdGllZjoyV1MjdVhMMUs4NjA='

def obtain_weather_data(weather_id):
    url = f"https://it-collectief.it.ntnu.no/api/Mqtts/weather_data?building={weather_id}"
    # FIXME wait for new temp data
    payload = {}
    headers = {
        'Authorization': f'Basic {BASIC_AUTH}'
    }

    response = requests.get(url, headers=headers, data=payload).json()

    return response

# def calculate_fanger_model(rh):
#     # input variables
#     tdb = np.arange(10, 40, 0.1)  # dry bulb air temperature, [$^{\circ}$C]
#     tr = tdb  # mean radiant temperature, [$^{\circ}$C] 26
#     v = 0.01  # average air speed, [m/s]
#     # rh = 40  # relative humidity, [%]
#     activity = "Filing, standing"  # "Typing"  # participant's activity description
#     garments = ["Sweatpants", "T-shirt", "Shoes or sandals", "Men's underwear", "Knee socks (thick)"]
#
#     met = met_typical_tasks[activity]  # activity met, [met]
#     icl = sum(
#         [clo_individual_garments[item] for item in garments]
#     )  # calculate total clothing insulation
#
#     # calculate the relative air velocity
#     vr = v_relative(v=v, met=met)
#     print("relative air velocity", vr)
#     # calculate the dynamic clothing insulation
#     clo = clo_dynamic(clo=icl, met=met)
#     print("dynamic clothing insulation", clo)
#
#     lst = {i: pmv_ppd(tdb=tdb[i], tr=tr[i], vr=vr, rh=rh, met=met, clo=clo, standard="ASHRAE") for i in range(len(tdb))}
#
#
#     df = pd.DataFrame(lst)
#
#     T_sp_optimal = tdb[int(np.argmin(df.T['ppd']))]
#
#     return T_sp_optimal


def adaptive_comfort_limits(weather_id, category, t, signal, alpha=0.8, d=7):
    '''
    This function calculates the upper and lower limits for indoor operative
    temperaure based on Adaptive Comfort Model according to EN 16798.

    Parameters
    ----------
    weather_id : weather ID of the system
        Time series of the previous days outdoor air temperature.
    category : str
        Building category according to EN 16798: catI, catII, catIII.
    t : datetime/timestamp
        The current time step.
    signal : int
        The signal value at the current timestep.
    alpha : float, optional
        Constant discount coefficient between 0 and 1. The default is 0.8.
    d : int, optional
        Number of the previous days in outdoor running mean temperature
        calculation. The default is 7.

    Returns
    -------
    t_rm: Outdoor running mean temperature at the current timestep.
    status: 'In_range', 'Overheating', 'Undercooling'

    '''

    # Assigning the categories limits
    limits = {
        'cat1_up': +2,
        'cat1_lo': -3,
        'cat2_up': +3,
        'cat2_lo': -4,
        'cat3_up': +4,
        'cat3_lo': -5,
        't_cmf': 0
    }
    # Measured outdoor air temperature
    # OutAirTemp = get_outdoor_air_temp_bypilot('Grenoble') # TODO make this an API call for the specific pilot weather data
    api_response = obtain_weather_data(weather_id)
    # convert to celsius from kelvin
    OutAirTemp = api_response["main"]["temp"] - 273.15
    # Daily mean outdoor temperature
    td_mean = OutAirTemp.resample('d').mean().fillna(method='ffill')
    # Daily mean outdoor air tempereture for the past d days (by default 7 days)
    td_mean_recent = list(td_mean.loc[pd.to_datetime(t) - pd.Timedelta(d + 1, 'd'):t].iloc[:-1].loc[::-1])
    # Outdoor running mean temperature
    t_rm = (1 - alpha) * sum([(alpha ** i) * (td_mean_recent[i]) for i in range(d)])
    # Since En 16798 is applicable when 10 < t_rm < 30, here the out of range
    # values are corrected to avoid fail results.
    if t_rm < 10:
        t_rm = 10
    elif t_rm > 30:
        t_rm = 30
    # Finding the corelated category and limits
    for limit in limits:
        if str(category) in limit and 'up' in limit:
            upper_limit = limits[limit]
        elif str(category) in limit and 'lo' in limit:
            lower_limit = limits[limit]
    # Applying the impact of signal on hte limits: {S4: -+1 C, S5: -+2C}
    if signal == 4:
        upper_limit += 1;
        lower_limit -= 1
    elif signal == 5:
        upper_limit += 2;
        lower_limit -= 2

    return 0.33 * t_rm + 18.8 + upper_limit, 0.33 * t_rm + 18.8 + lower_limit


def calculate_fanger_model(relative_humidity: float, v: float = 0.01):
    """
    TODO ask if the POE will be needed for the calculations
    :param relative_humidity: relative humidity
    :type relative_humidity: float
    :param v: average wind speed, [m/s]
    :type v: float
    """
    # input variables
    tdb = np.arange(10, 40, 0.1)  # dry bulb air temperature, [$^{\circ}$C]
    tr = tdb  # mean radiant temperature, [$^{\circ}$C] 26
    activity = "Filing, standing"  # "Typing"  # participant's activity description
    garments = ["Sweatpants", "T-shirt", "Shoes or sandals", "Men's underwear", "Knee socks (thick)"]

    met = met_typical_tasks[activity]  # activity met, [met]
    icl = sum(
        [clo_individual_garments[item] for item in garments]
    )  # calculate total clothing insulation

    # calculate the relative air velocity
    vr = v_relative(v=v, met=met)
    print("relative air velocity", vr)
    # calculate the dynamic clothing insulation
    clo = clo_dynamic(clo=icl, met=met)
    print("dynamic clothing insulation", clo)

    lst = [pmv_ppd(tdb=tdb[i], tr=tr[i], vr=vr, rh=rh, met=met, clo=clo, standard="ASHRAE") for i in range(len(tdb))]
    vvv_PPD = [v['ppd'] for v in lst]

    T_sp_optimal = tdb[vvv_PPD.index(min(vvv_PPD))]

    return T_sp_optimal


if __name__ == "__main__":
    rh = np.arange(10, 90, 5)
    times = []
    result = []

    for r in rh:
        # calculate times and result
        start = time()
        T_sp_optimal = calculate_fanger_model(r)
        end = time() - start

        times.append(end)
        result.append(T_sp_optimal)

    for k in range(len(rh)):
        end = times[k] * 1000
        T_sp_optimal = result[k]

        relative_hum = f"|relative humidity: {rh[k]}|"
        print("_" * len(relative_hum))
        print(relative_hum)
        print("_" * len(relative_hum))

        time_str = f"|time of execution: {end} ms|"
        optimal_value = f"result: {T_sp_optimal}"
        optimal_value = f"|{optimal_value}{' '*(len(time_str) - len(optimal_value) - 2)}|"
        print("_" * len(time_str))
        print(time_str)
        print("|"+"_" * (len(time_str) - 2)+"|")
        print(optimal_value)
        print("|"+"_" * (len(time_str) - 2)+"|")

