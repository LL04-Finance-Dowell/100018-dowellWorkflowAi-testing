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

export const deleteFavoriteForUser = async (itemId, itemType, loggedInUsername) => {
  return await httpFavourite.delete(`/favourites/delete/${itemId}/${itemType}/${loggedInUsername}/`)
}
