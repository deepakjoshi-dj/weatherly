import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FavouriteCityState {
  favouriteCityList: string[];
}

const initialState: FavouriteCityState = {
  favouriteCityList: [],
};

const favouriteCitiesSlice = createSlice({
  name: 'favouriteCities',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<string>) => {
      state.favouriteCityList.unshift(action.payload);
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favouriteCityList = state.favouriteCityList.filter(
        city => city !== action.payload
      );
    },
  },
});

export const { addToFavorites, removeFromFavorites } = favouriteCitiesSlice.actions;

export default favouriteCitiesSlice.reducer;
