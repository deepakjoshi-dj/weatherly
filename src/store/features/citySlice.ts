import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

interface CityState {
  city: string[];
}

const initialState: CityState = {
  city: [],
}

export const fetchCity = createAsyncThunk<string[], void>(
  'city/fetch',
  async () => {
    const response = await axios.post(
      'https://countriesnow.space/api/v0.1/countries/cities',
      { country: 'india' }
    );
    const data = response.data.data;
    return data;
  }
);

export const CitySlice = createSlice({
  name: "city",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCity.fulfilled, (state, action) => {
      state.city = action.payload;
    });
  }
});

export const selectCity = (state: RootState) => state.city.city;

export default CitySlice.reducer;
