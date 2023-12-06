from actuation_engine.algorithms.rldsm import Library
from actuation_engine.algorithms.assets import Asset
import json
# third party
import pytest


@pytest.fixture
def library_test_file():
    return r"tests\test_files\library_.json"


@pytest.fixture
def asset_test_file() -> str:
    return r"tests\test_files\assets_.json"


def test_library_empty_generation(session_factory):
    library = Library(session_factory=session_factory, library={})
    assert library


def test_library_file_generation(library_test_file, session_factory):
    with open(library_test_file, "r") as f:
        library_dict = json.load(f)

    library = Library(library=library_dict, session_factory=session_factory)

    assert library


@pytest.mark.parametrize("filename,building", [(r"data\assets_France.json", "22040367"),
                                               (r"data\assets_Cyprus.json", "22040368"),
                                               (r"data\assets_Cyprus.json", "22040370"),
                                               (r"data\assets_Cyprus.json", "22040371"),
                                               (r"data\assets_Italy.json", "22040352"),
                                               (r"data\assets_Italy.json", "22040369"),
                                               (r"data\assets_Italy.json", "22040341"),
                                               (r"data\assets_Norway.json", "22040349"),
                                               (r"data\assets_Norway.json", "22040350"),
                                               (r"data\assets_Norway.json", "22040351"),
                                               (r"data\assets_Norway.json", "22040353"),
                                               (r"data\assets_Norway.json", "22040361"),
                                               (r"data\assets_Norway.json", "22040362"),
                                               (r"data\assets_Norway.json", "22040363")])
def test_library_asset_generation(filename, building):
    library = Asset.load_assets_from_file(path=filename, building=building, algorithm="rldsm")
    assert library
