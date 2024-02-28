import { httpApiUrl, httpApiUrlV2, httpFavourite } from '../httpCommon/httpCommon';

export class FavoriteServices {
  addFavorite = (data) => {};

  getFavorites = () => {};
}

export const getFavoritesForUser = async (companyId, dataType) => {
  return await httpApiUrlV2.get(`/bookmarks/${companyId}/organisations/`);
  // https://100094.pythonanywhere.com/v2/bookmarks/65ad8a28c9038ff4498672c9/organisations/
  // return await httpApiUrl.get(`/companies/${companyId}/favourites/`);
};

export const addNewFavoriteForUser = async (data) => {
  return await httpFavourite.post(`/`, data);
};

export const deleteFavoriteForUser = async (
  // itemId,
  // itemType,
  // loggedInUsername,
  bookmarkId
) => {
  return await httpFavourite.delete(
    `/${bookmarkId}/`
    // `/${itemId}/${itemType}/${loggedInUsername}/`
  );
};
