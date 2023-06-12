import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { setLoading } from "./loaderSlice";
import { toast } from 'react-toastify';

export interface WeatherData {
  city_name: string;
  secondary_city_name: string;
  temp: number;
  feelsLike: number;
  weather_main: string;
  weather_description: string;
  humidity: number;
  pressure: number;
  temp_min: number;
  temp_max: number;
  sunrise: number;
  sunset: number;
  wind_speed: number;
  lat: number;
  lon: number;
}

interface WeatherState {
  cityWeatherData: WeatherData[];
}

const initialState: WeatherState = {
  cityWeatherData: [],
};

export const fetchWeatherCity = createAsyncThunk(
  "weatherCity/fetch",
  async (city: string, { dispatch }) => { // Destructure the `dispatch` function
    let message = '';
    try {
      dispatch(setLoading(true)); // Dispatch the action from the loaderSlice

      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=a5f7db8da80fb3c4a26b0c18a6a6bbb1`
      );

      const location: { lat: number; lon: number }[] = response?.data;
      const lat: number = location[0]?.lat;
      const lon: number = location[0]?.lon;

      const weatherData = async (lat: number, lon: number): Promise<WeatherData> => {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=a5f7db8da80fb3c4a26b0c18a6a6bbb1`
        );
        const data: any = response?.data;
        let tempData: WeatherData = {
          city_name: city,
          secondary_city_name: data?.name,
          temp: data?.main?.temp,
          feelsLike: data?.main?.feels_like,
          weather_main: data?.weather[0]?.main,
          weather_description: data?.weather[0]?.description,
          humidity: data?.main?.humidity,
          pressure: data?.main.pressure,
          temp_min: data?.main?.temp_min,
          temp_max: data?.main?.temp_max,
          sunrise: data?.sys?.sunrise,
          sunset: data?.sys?.sunset,
          wind_speed: data?.wind?.speed,
          lat: data?.coord?.lat,
          lon: data?.coord?.lon
        };
        return tempData;
      };
      const data = await weatherData(lat, lon);
      message = 'added in your cities list';
      toast.dismiss();
      toast.success(`${city} ${message}`,{
        position:toast.POSITION.TOP_CENTER,
        autoClose:3000,
        hideProgressBar: true,
      });
      return data;
      
    } catch (error) {
        console.error("Error fetching weather data:", error);
        message = 'not added something went wrong';
        toast.dismiss();
        toast.error(`${city} ${message}`,{
          position:toast.POSITION.TOP_CENTER,
          autoClose:3000,
          hideProgressBar: true,
        });
      throw error;
    } finally {
        dispatch(setLoading(false));
    }
  }
);

export const weatherCitySlice = createSlice({
  name: "weatherCity",
  initialState,
  reducers: {
    removeFromCitiesList: (state,action:PayloadAction<string>) =>{
      state.cityWeatherData = state.cityWeatherData.filter(
        city => city.city_name !== action.payload
      )
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWeatherCity.fulfilled, (state, action: PayloadAction<WeatherData>) => {
      const newVal = action?.payload;
      if(state.cityWeatherData[0]?.city_name !== newVal?.city_name){
        state.cityWeatherData.unshift(action.payload);
      }
    });
  },
});

export const { reducer: weatherCityReducer } = weatherCitySlice;
export const { removeFromCitiesList } = weatherCitySlice.actions;
export const selectWeatherData = (state: RootState) => state.weatherCity.cityWeatherData;
