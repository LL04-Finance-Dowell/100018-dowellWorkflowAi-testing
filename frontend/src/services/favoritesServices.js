import { httpFavourite } from "../httpCommon/httpCommon";

export class FavoriteServices {
  addFavorite = (data) => {
    
  };

  getFavorites = () => {
    
  };
}

export const getFavoritesForUser = async (companyId) => {
  return await httpFavourite.get(`/org/${companyId}/`);
}

export const addNewFavoriteForUser = async (data) => {
  return await httpFavourite.post(`/`, data);
}

export const deleteFavoriteForUser = async (itemId, itemType, loggedInUsername) => {
  return await httpFavourite.delete(`/delete/${itemId}/${itemType}/${loggedInUsername}/`)
}
