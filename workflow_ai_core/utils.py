from threading import Thread

class ThreadService:
    def __init__(self, id, func):
        self.id = id
        self.func = func
        Thread.__init__(self)

    def run(self):
        save_to_algolia(self.id, self.func)
def threaded(fn):
    """To use as decorator to make a function call thread."""
    def wrapper(*args, **kwargs):
        thread = Thread(target=fn, args=args, kwargs=kwargs)
        thread.start()
        return thread
    return wrapper
