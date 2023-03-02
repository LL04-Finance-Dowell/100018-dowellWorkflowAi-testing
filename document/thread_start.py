from threading import Thread
from .algolia import save_to_algolia,update_from_algolia


class ThreadAlgolia(Thread):
    def __init__(self, id, payload,func):
        self.id = id
        self.payload=payload
        self.func = func
        
        Thread.__init__(self)

    def run(self):
        save_to_algolia(self.id, self.func)

class UpdateThreadAlgolia(Thread):
    def __init__(self,payload):
        self.payload = payload
        Thread.__init__(self)
    def run(self):
        update_from_algolia(self.payload)




