"""Collectief Project - Hub Core Module"""
from logging import getLogger, StreamHandler, DEBUG, Formatter
from traceback import format_exc
from modules.custom_formatter import CustomFormatter
from modules.hub_core import HubCore
from time import sleep
LOG_PATH = '/var/log/collectief/hub_core.log'


def main():
    """Hub Core main: initialize logger then create and activate HubCore object"""
    # Init arg parser -> TODO: utilizzare per il livello dei log
    # parser = ArgumentParser()
    # parser.add_argument(...)
    # args = parser.parse_args()

    # Init Logger
    getLogger().addHandler(StreamHandler())
    # getLogger().addHandler(RotatingFileHandler(LOG_PATH, maxBytes=1024 * 1024, backupCount=3)) # TODO
    getLogger().setLevel(DEBUG)
    # fmt = Formatter('%(asctime)s - %(levelname)s - %(message)s - %(funcName)s: %(filename)s:%(lineno)s')
    for h in getLogger().handlers:
        h.setFormatter(CustomFormatter())

    getLogger().info("Started")
    hub_core = HubCore()
    try:
        hub_core.activate()
        while True:
            sleep(1)
        # hub_core.deactivate("manual shutdown")
    except KeyboardInterrupt:
        hub_core.deactivate("manual shutdown")
    except BaseException as exc:
        msg = f"{type(exc).__name__} {str(exc.args)}"
        hub_core.deactivate(msg)
        getLogger().error("Extended Exception reason: \n" + format_exc())


if __name__ == '__main__':
    main()

