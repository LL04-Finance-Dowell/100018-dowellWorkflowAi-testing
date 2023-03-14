from threading import Thread

from app.utils.favourites import remove_favorite, save_as_favorite
from .algolia import save_to_algolia, update_from_algolia


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
    def __init__(self, item_id, item_type, username):
        self.id = item_id
        self.type = item_type
        self.username = username
        Thread.__init__(self)

    def run(self):
        save_as_favorite(self.id, self.type, self.username)


class DeleteFavoriteThread(Thread):
    def __init__(self, item_id, item_type):
        self.id = item_id
        self.type = item_type
        Thread.__init__(self)

    def run(self):
        remove_favorite(self.id, self.type)
