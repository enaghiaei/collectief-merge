import random
import pytest
from actuation_engine.algorithms.rldsm import RLDSM
from actuation_engine.algorithms.assets import Asset
from datetime import datetime, timedelta
from math import floor, ceil
from unittest.mock import patch
from unittest import mock


# pytestmark = pytest.mark.parametrize("filename,building",
#                          [(r"data\assets_France.json", "22040367"), (r"data\assets_Cyprus.json", "22040368"),
#                           (r"data\assets_Cyprus.json", "22040370"), (r"data\assets_Cyprus.json", "22040371"),
#                           (r"data\assets_Italy.json", "22040352"), (r"data\assets_Italy.json", "22040369"),
#                           (r"data\assets_Italy.json", "22040341"), (r"data\assets_Norway.json", "22040349"),
#                           (r"data\assets_Norway.json", "22040350"), (r"data\assets_Norway.json", "22040351"),
#                           (r"data\assets_Norway.json", "22040353"), (r"data\assets_Norway.json", "22040361"),
#                           (r"data\assets_Norway.json", "22040362"), (r"data\assets_Norway.json", "22040363")])
# do not use this unti you haven't mocked data from this
# pytestmark = pytest.mark.parametrize("filename,building", [(r"data\assets_France.json", "22040367")])


@pytest.fixture
def customTestFunctions():
    class testFunctionMock:
        energy_test = lambda arg1, arg2, arg3: arg1+arg2+arg3

    return testFunctionMock

@pytest.fixture(scope='function')
def rldsm_mock(asset_dict_correct):
    with patch('algorithms.rldsm.RLDSM') as mock_session:
        mock_session_instance = mock_session.return_value
        mock_session_instance.session = mock.MagicMock()
        # Configure the mock_session_instance as needed
        assets = Asset(assets=asset_dict_correct)
        rldsm = RLDSM(assets=assets, Session=mock_session_instance)
    return rldsm


@pytest.fixture(scope='function')
def test_fake_data():
    # output
    # [(1, '2023-09-01 16:03:33.624131', 0.14593402637052988), # tag="1"
    #  (1, '2023-09-01 16:02:33.624131', 0.7372798360484359), # tag="2"
    #  (2, '2023-09-01 16:03:33.624131', 0.5848332573680465),
    #  (2, '2023-09-01 16:02:33.624131', 0.11510856067776054),
    #  (2, '2023-09-01 16:03:33.624131', 0.5115440945818316),
    #  (2, '2023-09-01 16:02:33.624131', 0.9512631131623916),
    #  (3, '2023-09-01 16:03:33.624131', 0.24688918424484585), # tag="3"
    #  (3, '2023-09-01 16:02:33.624131', 0.7184343995753544),
    #  (3, '2023-09-01 16:03:33.624131', 0.8991704128170669),
    #  (3, '2023-09-01 16:02:33.624131', 0.5737368707057637),
    #  (3, '2023-09-01 16:03:33.624131', 0.12934322136564957),
    #  (3, '2023-09-01 16:02:33.624131', 0.9415589387710777),
    #  (5, '2023-09-01 15:03:33.624131', 0.06474458399506511), # tag="1"
    #  (5, '2023-09-01 15:02:33.624131', 0.8215980077609751)]

    data = [(i, datetime.now() - timedelta(minutes=k, hours=int(i/4)), random.random())
            for i in range(1, 6)
            for _ in range(i % 4)
            for k in range(14)]
    return data


@pytest.mark.usefixtures("rldsm_mock")
def test_set_signal_simple(rldsm_mock):
    # rldsm_mock.signal = (get_signal_from_cluster_node, {"ip_address": "4324523",
    #                                                     "port",
    #                                                     "username",
    #                                                     "password"})
    rldsm_mock.signal = (lambda x: x * 0.1, {"x": 20})
    assert rldsm_mock.signal


@pytest.mark.usefixtures("rldsm_mock")
def test_get_signal(rldsm_mock):
    assert rldsm_mock.signal == 1


@pytest.mark.usefixtures("rldsm_mock")
def test_hour(rldsm_mock):
    assert rldsm_mock.hour == floor(datetime.now().hour / 3)


@pytest.mark.usefixtures("rldsm_mock")
def test_season_id(rldsm_mock):
    assert rldsm_mock.season_id == ceil(datetime.now().month / 3)


@pytest.mark.usefixtures("rldsm_mock")
def test_operation_mode(rldsm_mock):
    current_month = datetime.now().month
    operation_mode = 'Cooling' if (current_month >= 4 or current_month <= 9) else 'Heating'
    assert rldsm_mock.operationMode == operation_mode


@pytest.mark.usefixtures("rldsm_mock")
def test_gather_sensor_credentials(rldsm_mock):
    expected_outcome = {'A':
        [
            {'driver': 'a', 'field_id': 'a', 'tags': ['1', '2', '3']},
            {'driver': 'a', 'field_id': 'b', 'tags': ['1', '2', '3']},
            {'driver': 'b', 'field_id': 'a', 'tags': ['1', '2', '3']},
            {'driver': 'b', 'field_id': 'b', 'tags': ['1', '2', '3']}
        ],
        "B":
            [
                {'driver': 'a', 'field_id': 'a', 'tags': ['1', '2', '3']},
                {'driver': 'a', 'field_id': 'b', 'tags': ['1', '2', '3']},
                {'driver': 'b', 'field_id': 'a', 'tags': ['1', '2', '3']},
                {'driver': 'b', 'field_id': 'b', 'tags': ['1', '2', '3']}
            ]
    }
    assert rldsm_mock.gather_sensor_credentials() == expected_outcome


def test_get_entity_data_groups(rldsm_mock):
    session_mock = mock.MagicMock()
    first_mock = mock.MagicMock()
    first_mock.first.return_value = (1,)
    edg_mocks = [mock.MagicMock(), mock.MagicMock(), mock.MagicMock()]
    vals = [1, 2, 3]
    for val, edg_mock in zip(vals, edg_mocks):
        edg_mock.HubCoreEntityDataGroup.id = val

    # Set up mock return values for the first and second execute calls
    session_mock.execute.side_effect = [first_mock,  # entity_id
                                        edg_mocks]  # edg_ids

    rldsm_mock.Session().__enter__.return_value = session_mock
    edgs = rldsm_mock._get_entity_data_groups(driver='a', field_id='a')

    # Assert the expected results
    assert edgs == vals


@pytest.mark.parametrize("tag,edg_ids,expected_data", [("1", [1,5], 28), ("2", [2], 28), ("3", [3], 42), ("4", [4], 0)])
def test_get_measurements(rldsm_mock, test_fake_data, tag, edg_ids, expected_data):
    session_mock = mock.MagicMock()
    session_mock.execute.return_value.fetchall.return_value = [(row[1], row[2]) for row in test_fake_data if
                                                               row[0] in edg_ids]


    rldsm_mock.Session().__enter__.return_value = session_mock
    rldsm_mock.latest_timestamp = datetime.now()
    result = len(rldsm_mock._get_measurements(tag,edg_ids))
    assert result == expected_data

def test_gather_metrics(rldsm_mock, customTestFunctions, test_fake_data):

    credentials = rldsm_mock.gather_metrics_credentials()
    rldsm_mock.custom_methods = customTestFunctions

    rldsm_mock.gather_metrics(sensor_results = )
    print(credentials)
    assert True

# @pytest.mark.parametrize("tag,edg_id", [("1", 1), ("2", [2]), ("3", [3]), ("4", [4])])
# def test_get_measurements_query(rldsm_mock, tag, edg_id):
#     rldsm_mock.latest_timestamp = datetime.now()
#     from sqlalchemy import select
#     from db.models import HubCoreMeasureData, HubCoreMeasure
#     query_test = select(HubCoreMeasureData.dt, HubCoreMeasureData.value).where(
#         HubCoreMeasureData.measure_id == select(HubCoreMeasure.id).where(
#             HubCoreMeasure.edg_id == edg_id,
#             HubCoreMeasure.tag == tag,
#             HubCoreMeasureData.dt > rldsm_mock.latest_timestamp - timedelta(minutes=rldsm_mock.cycle_cutoff)
#         )
#     )
#     query = rldsm_mock._get_measurements_query(edg_id, tag)
#
#     print("original query",query, sep="\n")
#     print("test query", query_test, sep="\n")
#
#     assert query_test == query


# def test_gather_metrics(rldsm_mock):
#     assert False
#     # rldsm.gather_metrics()
#
#
# def test_monitor(rldsm_mock):
#     # mock the monitor somehow
#     assert False
#
#
# def test_control(rldsm_mock):
#     # mock the control, send to an empty socket
#     assert False