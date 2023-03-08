from threading import Thread
from .algolia import save_to_algolia, update_from_algolia
from .models import save_as_favorite,remove_favorite


class ThreadAlgolia(Thread):
    def __init__(self, id, func):
        self.id = id
        self.func = func
        Thread.__init__(self)

    def run(self):
        save_to_algolia(self.id, self.func)


class UpdateThreadAlgolia(Thread):
    def __init__(self, payload):
        self.payload = payload
        Thread.__init__(self)

    def run(self):
        update_from_algolia(self.payload)


class FavoriteThread(Thread):
    def __init__(self, item_id, item_type):
        self.id = item_id
        self.type = item_type
        Thread.__init__(self)

    def run(self):
        save_as_favorite(self.id, self.type)

class DeleteFavoriteThread(Thread):
    def __init__(self, item_id, item_type):
        self.id = item_id
        self.type = item_type
        Thread.__init__(self)

    def run(self):
        remove_favorite(self.id, self.type)