import { httpFavourite } from "../httpCommon/httpCommon";

export class FavoriteServices {
  addFavorite = (data) => {
    
  };

  getFavorites = () => {
    
  };
}

export const getFavoritesForUser = async (companyId) => {
  return await httpFavourite.get(`/favourites/org/${companyId}/`);
}

export const addNewFavoriteForUser = async (data) => {
  return await httpFavourite.post(`/favourites/`, data);
}

export const deleteFavoriteForUser = async (itemId, itemType) => {
  return await httpFavourite.get(`/delete/${itemId}/${itemType}/`)
}
