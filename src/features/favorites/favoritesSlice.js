import { createSlice } from "@reduxjs/toolkit";
import { getFavorites, handleFavorites } from "./asyncThunks";

const initialState = {
  getFavoritesStatus: "pending",
  favoriteItems: [],
  singleFavorite: null,
  handleFavoritesStatus: "pending",
  errorMessage: null,
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  extraReducers: (builder) => {
    //getFavorites
    builder.addCase(getFavorites.pending, (state) => {
      state.getFavoritesStatus = "pending";
    });
    builder.addCase(getFavorites.fulfilled, (state, action) => {
      state.getFavoritesStatus = "succeeded";
      state.favoriteItems = action.payload;
    });
    builder.addCase(getFavorites.rejected, (state, action) => {
      state.getFavoritesStatus = "failed";
      state.errorMessage = action.payload;
    });

    //handleFavorites
    builder.addCase(handleFavorites.pending, (state) => {
      state.handleFavoritesStatus = "pending";
    });
    builder.addCase(handleFavorites.fulfilled, (state, action) => {
      state.handleFavoritesStatus = "succeeded";
      state.singleFavorite = action.payload;
    });
    builder.addCase(handleFavorites.rejected, (state, action) => {
      state.handleFavoritesStatus = "failed";
      state.errorMessage = action.payload;
    });
  },
});

export const {} = favoritesSlice.actions;

export default favoritesSlice.reducer;
