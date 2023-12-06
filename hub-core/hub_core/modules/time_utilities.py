"""Time utilities module"""
import errno
import os
import signal
import time
from functools import wraps


# def timeout(seconds=10, error_message=os.strerror(errno.ETIME)):
#     """Add a timeout"""
#     def decorator(func):
#         """Func decorator"""
#         def _handle_timeout(signum, frame):
#             raise TimeoutError(error_message)
#
#         @wraps(func)
#         def wrapper(*args, **kwargs):
#             """Func wrapper"""
#             signal.signal(signal.SIGALRM, _handle_timeout)
#             signal.alarm(seconds)
#             try:
#                 result = func(*args, **kwargs)
#             finally:
#                 signal.alarm(0)
#             return result
#         return wrapper
#     return decorator


def measuretime(func):
    """Measure time elpased in 'func' execution"""
    @wraps(func)
    def measuretime_wrapper(*args, **kwargs):
        """Func wrapper"""
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        total_time = end_time - start_time
        # first item in the args, ie `args[0]` is `self`
        # print(f'Function {func.__name__} took {total_time*1000:.1f} ms')
        return result
    return measuretime_wrapper


def delaytest(func):
    """Add a delay before 'func' execution"""
    @wraps(func)
    def delaytest_wrapper(*args, **kwargs):
        """Func wrapper"""
        delay = 1
        print(f"Adding delay for testing: {delay}sec")
        time.sleep(delay)
        result = func(*args, **kwargs)
        return result
    return delaytest_wrapper




