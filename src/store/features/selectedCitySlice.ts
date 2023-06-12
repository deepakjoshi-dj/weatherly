import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface SelectedCityState {
    selectedCity : string;
}

const initialState:SelectedCityState = {
    selectedCity : ''
}

const selectedCitySlice = createSlice({
    name:'selectedCity',
    initialState,
    reducers: {
        setCurrentSelectedCity:(state,action:PayloadAction<string>) => {
            state.selectedCity = action.payload;
        }
    }
});

export const {setCurrentSelectedCity} = selectedCitySlice.actions;
export default selectedCitySlice.reducer;