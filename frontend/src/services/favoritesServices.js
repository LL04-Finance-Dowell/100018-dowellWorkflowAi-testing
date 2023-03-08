import { httpFovorite, httpFovorites } from "../httpCommon/httpCommon";

export class FavoriteServices {
  addFavorite = (data) => {
    return httpFovorite.post(`/${data.id}/${data.type}`);
  };

  getFavorites = () => {
    return httpFovorites.post("/");
  };
}
