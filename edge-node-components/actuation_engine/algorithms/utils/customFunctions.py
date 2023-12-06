import pandas as pd
import numpy as np


def calculate_energy(inlet_water_temperature: float = None,
                     outlet_water_temperature: float = None,
                     water_flow: float = None,
                     hvac_power: float = None):
    """
    method exclusive to G2ELab to calculate the energy
    This assumes two methods to calculate the energy flow of the heating systems:
    - know it directly from the hvac power consumption
    - know how water is being heated or cooled by the system by knowing the inlet and outlet water temperature
    """
    if hvac_power:
        return hvac_power
    else:
        if not (inlet_water_temperature and outlet_water_temperature and water_flow):
            return 0
        else:
            return float(-1.163 * water_flow * (outlet_water_temperature - inlet_water_temperature))

def calculate_ALD(temp_dataset, df_sp):
    """
    :param temp_dataset: historical data
    :type temp_dataset: list | pd.DataFrame | pd.Series
    :param df_sp:
    :type df_sp:
    """
    # retrieve air temperatures from sph_p/+/t_rh_0
    # Consider historical data, not just the latest datapoint
    temp = temp_dataset.actual_value.values  # ds_sph['Sphensor_'+df_rooms_sensor_ids_B08.sensor_id1[k]].Air_temperature.values
    dates = temp_dataset.timestamp.values  # ds_sph['Sphensor_'+df_rooms_sensor_ids_B08.sensor_id1[k]].timestamp.values

    d_sph = {"Date": dates, "T_sph": temp}
    df_sph = pd.DataFrame(
        data=d_sph
    )

    # df_sp, df_pma_out =adaptive_thermal_comfort_model()

    # DTop: offset from the ASHRAE optimal operative temperature
    ALD = [0] * len(df_sph)
    time_array = pd.to_datetime(temp_dataset.timestamp)
    d_ALD = {"Date": time_array, "ALD": ALD}
    df_ALD = pd.DataFrame(
        data=d_ALD
    )

    for j in range(0, len(df_sp.Date)):
        # % keep daily (single day) data
        temporary = df_sp.Date
        time_mask = np.where(
            time_array.dt.date == temporary[j].date())  # (time_array.dt.date == temporary[j].date())
        Top = df_sph.T_sph.loc[time_mask].values

        # Top = df_sph.T_sph.loc[np.where(time_array.dt.date == temporary[1].date())].values
        DTop = abs(list(map(float, Top.tolist())) - df_sp.Tsp[j])
        df_ALD.ALD.loc[time_mask] = np.exp(-3.057 + 0.419 * DTop + 0.007 * np.square(DTop)) / (
                    1 + np.exp(-3.057 + 0.419 * DTop + 0.007 * np.square(DTop))) * 100
    # todo find a way to write this to database as metrics
    return df_ALD
