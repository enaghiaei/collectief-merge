"""Thread Safe List module"""
from threading import Condition


class ThreadSafeList:
    """Thread Safe List class"""
    def __init__(self, max_len=None):
        self._list = []
        self._max_len = max_len
        self._access_condition = Condition()

    def append(self, item):
        """Append new element to the list"""
        with self._access_condition:
            self._list.append(item)
            self._access_condition.notify_all()

    def pop(self):
        """Pop an element from the list"""
        with self._access_condition:
            res = self._list.pop()
            self._access_condition.notify_all()
            return res

    def get(self, index):
        """Get the element at the given index"""
        with self._access_condition:
            return self._list[index]

    def length(self):
        """Get list length"""
        with self._access_condition:
            return len(self._list)

    def wait_for_items(self, wait_criteria, args=None):
        """Wait (blocking) for processable items. An item is considered processable according to the 'wait_criteria'
         function"""
        with self._access_condition:
            # Timeout is needed to manage retry logic (expressed in seconds)
            return self._access_condition.wait_for(lambda: len(wait_criteria(self._list, args)) > 0, timeout=10)

    def append_item_by_func(self, new_item, func, args=None):
        """Append new items in a thread safe condition"""
        with self._access_condition:
            if len(self._list) < self._max_len:
                res = func(self._list, new_item, args)
                self._access_condition.notify_all()
            else:
                raise MemoryError("List is full")
            return res

    def remove_item_by_func(self, func, *args):
        """Remove items in a thread safe condition"""
        with self._access_condition:
            items = func(self._list, *args)
            for item in items:
                self._list.remove(item)
            self._access_condition.notify_all()
            return items

    def notify_all(self):
        """Access Condition Lock notify all"""
        with self._access_condition:
            self._access_condition.notify_all()
