import { createAsyncThunk } from "@reduxjs/toolkit";
import { FavoriteServices } from "../../services/favoritesServices";

const favoriteServices = new FavoriteServices();

export const getFavorites = createAsyncThunk("favorites/get", async () => {
  try {
    const res = favoriteServices.getFavorites();

    return res.data;
  } catch (error) {
    console.log(error);
  }
});

export const handleFavorites = createAsyncThunk(
  "favorites/handle",
  async (data) => {
    try {
      const res =  favoriteServices.addFavorite(data);

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
