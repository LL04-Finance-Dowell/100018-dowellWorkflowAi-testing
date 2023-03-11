import { httpFovorite, httpFovorites } from "../httpCommon/httpCommon";

export class FavoriteServices {
  addFavorite = (data) => {
    return httpFovorite.post(`/${data.id}/${data.type}`);
  };

  getFavorites = () => {
    return httpFovorites.post("/");
  };
}

export const getFavoritesForUser = async (data) => {
  return await httpFovorites.post("/", data);
}

export const addNewFavoriteForUser = async (itemId, itemType) => {
  return await httpFovorite.get(`/favorite/${itemId}/${itemType}/`);
}

export const deleteFavoriteForUser = async (itemId, itemType) => {
  return await httpFovorite.get(`/delete/${itemId}/${itemType}/`)
}
