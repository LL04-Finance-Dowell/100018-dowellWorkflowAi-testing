import { createSlice } from '@reduxjs/toolkit';
import { getFavorites, handleFavorites } from './asyncThunks';

const initialState = {
  getFavoritesStatus: 'pending',
  favoriteItems: [],
  singleFavorite: null,
  handleFavoritesStatus: 'pending',
  errorMessage: null,
};

const setStatus = (state, action, statusKey) => {
  state[statusKey] = action.payload ? 'succeeded' : 'failed';
  state.errorMessage = action.payload;
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  extraReducers: (builder) => {
    const createAsyncReducer = (thunk, statusKey, stateKey) => {
      builder
        .addCase(thunk.pending, (state) => {
          state[statusKey] = 'pending';
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state[statusKey] = 'succeeded';
          state[stateKey] = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state[statusKey] = 'failed';
          state.errorMessage = action.payload;
        });
    };

    createAsyncReducer(getFavorites, 'getFavoritesStatus', 'favoriteItems');
    createAsyncReducer(handleFavorites, 'handleFavoritesStatus', 'singleFavorite');
  },
});

export default favoritesSlice.reducer;

