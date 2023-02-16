from threading import Thread


def threaded(fn):
    """To use as decorator to make a function call thread."""
    def wrapper(*args, **kwargs):
        thread = Thread(target=fn, args=args, kwargs=kwargs)
        thread.start()
        return thread
    return wrapper
