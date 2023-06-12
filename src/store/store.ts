import { Action, ThunkAction, configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { persistStore, persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';

// Import your feature slices
import { CitySlice } from "./features/citySlice";
import { weatherCitySlice } from "./features/weatherCitySlice";
import favouriteCitySlice from "./features/favouriteCitySlice";
import selectedCitySlice from "./features/selectedCitySlice";
import loaderSlice from "./features/loaderSlice";


// Create a custom storage adapter for session storage
const sessionStorageAdapter = {
  getItem: (key: string) => sessionStorage.getItem(key),
  setItem: (key: string, item: string) => sessionStorage.setItem(key, item),
  removeItem: (key: string) => sessionStorage.removeItem(key),
};

// Create the persist configuration
const persistConfig = {
  key: 'root',
  storage: sessionStorageAdapter, // Use session storage adapter
  blacklist: ["loader"],
};

// Combine your reducers
const rootReducer = combineReducers({
  city: CitySlice.reducer,
  weatherCity: weatherCitySlice.reducer,
  favouriteCities: favouriteCitySlice,
  selectedCity: selectedCitySlice,
  loader: loaderSlice
});

// Create the persisted reducer and store
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

// Define types for dispatch, state, and thunks
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Custom hook for useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
