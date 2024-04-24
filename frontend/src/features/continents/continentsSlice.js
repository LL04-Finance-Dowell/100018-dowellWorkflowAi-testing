import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  continents: [],
  continentsLoaded: false,
}

export const continentSlice = createSlice({
    name: 'continent',
    initialState,
    reducers: {
        setContinents: (state, action) => {
            state.continents = action.payload;
        },
        setContinentsLoaded: (state, action) => {
            state.continentsLoaded = action.payload;
        },
    }
})

export const {
    setContinents,
    setContinentsLoaded,
} = continentSlice.actions;

export default continentSlice.reducer;