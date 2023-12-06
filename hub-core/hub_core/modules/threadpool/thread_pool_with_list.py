"""
This module define a ThreadPool with List. The List is used to stored items. These items are executed by the ThreadPool,
according to user-defined logics
"""
from logging import getLogger
from multiprocessing.pool import ThreadPool
from modules.threadpool.thread_safe_list import ThreadSafeList
from threading import Thread, Semaphore


class ThreadPoolItem:
    """ This is the item saved into List """
    def __init__(self, body, handler):
        """
        _id: internal identifier (do not modify externally!)
        body: item content, externally set
        handler: defines how the body has to be handled, externally set
        """
        self._id = id(self)
        self.body = body
        self.handler = handler

    def get_id(self):
        """ id getter """
        return self._id


class ThreadPoolWithList:
    """ This class manages the ThreadPool, the List and an internal and an internal thread (main_thread) """
    # The append_func tells the Thread Safe List how to deal new messages. In this way the list is manipulated in a
    #  thread safe way
    def __init__(self, remove_criteria_func=None, max_parallel_threads=3, max_list_len=100):  # TODO: da cfg
        """
        _main_thread: internal main thread
        _pool: internal ThreadPool
        _items: Thread Safe List containing ThreadPoolItem objects
        _item_in_progress: this list contains the ThreadPoolItem objects currently executed by ThreadPool
        _remove_criteria_func: defines the rules which allow to execute an item in the List
        """
        self._main_thread = Thread(target=self.list_watcher, name="ThrPool List Watcher")
        self._main_thread.daemon = True
        self._pool = ThreadPool(processes=max_parallel_threads)
        self._pool_semaphore = Semaphore(max_parallel_threads)  # used to block thread pool when all processes are busy
        self._items = ThreadSafeList(max_len=max_list_len)
        self._items_in_progress = []  # warning: not thread safe
        self._remove_criteria_func = remove_criteria_func

    def start(self):
        """ Start the main thread which controls Thread Pool and List"""
        self._main_thread.start()

    def list_watcher(self):
        """
        This method looks at the List waiting for executable ThreadPoolItem objects. When one is available, it is passed
         to the ThreadPool for the execution and added to _items_in_progress list
        """
        while True:
            # Blocking function
            if self._items.wait_for_items(self._remove_criteria_func, self._items_in_progress):
                # ThreadPool has an internal queue: even if no process is available, it takes the item. So, a semaphore
                # block the thread when all the processes are busy
                ready_items = self._items.remove_item_by_func(self._remove_criteria_func, self._items_in_progress)
                if ready_items:
                    next_item = ready_items.pop()
                    # Wait Thread Pool for available threads
                    self._pool_semaphore.acquire()
                    # Put item in progress...
                    self._items_in_progress.append(next_item)
                    self._pool.apply_async(handler_wrapper, args=[next_item], callback=self.update_in_progress_list)
                    self._items.notify_all()
                else:
                    getLogger().warning("No item founded...")  # This should never verify...

    def update_in_progress_list(self, item_id):
        """ This callback removes the ThreadPoolItem from _items_in_progress and releases the semaphore"""
        item = next((it for it in self._items_in_progress if it.get_id() == item_id), None)
        if item:
            self._items_in_progress.remove(item)
            getLogger().debug("Item in progress: " + str(len(self._items_in_progress)))
            self._pool_semaphore.release()
            self._items.notify_all()
        else:
            raise ValueError("Thread Pool error: received a unexpected item_id...")

    def add_item(self, body, item_handler, append_criteria):
        """
        The append_criteria_func is called from the list object in a thread safe way, so it can manipulate elements
        into the List
        """
        new_item = ThreadPoolItem(body, item_handler)
        return self._items.append_item_by_func(new_item, append_criteria, self._items_in_progress)

    def remove_item_by_func(self, remove_criteria_func, *args):
        """ This method removes items from List according to remove_criteria_func """
        return self._items.remove_item_by_func(remove_criteria_func, *args)


def handler_wrapper(item: ThreadPoolItem) -> int:
    """ This method wraps the ThreadPoolItem handler and returns its id when finished """
    item.handler(item.body)
    return item.get_id()
