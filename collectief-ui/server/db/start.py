# importing Python multiprocessing module
import multiprocessing
import Mqtt_data_collector
import fast_api.fast_api as fastAPI

if __name__ == "__main__":
    # creating multiple processes
    proc1 = multiprocessing.Process(target=Mqtt_data_collector.run)
    proc2 = multiprocessing.Process(target=fastAPI.run)
    # Initiating process 1
    proc1.start()

    # Initiating process 2
    proc2.start()


    # wait user to stop
    try:
        input('Press ENTER to stop\n')
    except:
        pass