"""Periodic Task Scheduler module"""
import threading
import time
from logging import getLogger


class Task:
    """Task Class"""
    def __init__(self, period, func, **kwargs):
        self.period = period
        self.func = func
        self.kwargs = kwargs
        self.start_ts = int(time.time())


class PeriodicTaskScheduler:
    """Scheduler Class"""
    def __init__(self, sleep_time=1):  # TODO: sleeptime da cfg
        self._tasks = []
        self._sleep_time = sleep_time
        self._lock = threading.Lock()
        self._stop_event = threading.Event()
        self._thread = threading.Thread(target=self.run, name="Periodic Task Scheduler")
        self._thread.daemon = True

    @property
    def task_count(self):
        """Get the count of configured tasks"""
        return len(self._tasks)

    def reset(self):
        """Delete all the current tasks"""
        with self._lock:
            self._tasks.clear()

    def add_task(self, task: Task):
        """Add a new task"""
        with self._lock:
            self._tasks.append(task)

    def remove_tasks(self, tasks: list):
        """Remove one or more tasks"""
        with self._lock:
            for task in tasks:
                self._tasks.remove(task)

    def get_tasks(self):
        """Return task list"""
        return self._tasks

    def start(self):
        """Start Periodic Task Scheduler thread"""
        self._thread.start()

    def stop(self):
        """Stop Periodic Task Scheduler thread"""
        self._stop_event.set()
        self._thread.join()

    def run(self):
        """Periodic Task Scheduler thread handler"""
        while not self._stop_event.is_set():
            with self._lock:
                for task in self._tasks:
                    # getLogger().debug(f"TEST: {(int(time.time()) - task.start_ts) % (task.period * 60)}")
                    if (int(time.time()) - task.start_ts) % (task.period * 60) < 1:  # TODO -> attenzione che scatta anche quando start_ts è a 0
                        task.func(task.kwargs)
            time.sleep(self._sleep_time)


