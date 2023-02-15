from threading import Thread
from .algolia import save_to_algolia
class ThreadAlgolia(Thread):
    def __init__(self, id,func):
        self.id=id
        self.func=func
        Thread.__init__(self)
    
    def run(self):
        save_to_algolia(self.id,self.func)

