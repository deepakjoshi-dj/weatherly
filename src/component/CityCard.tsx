import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeatherCity } from "../store/features/weatherCitySlice";

interface CityCardProps {
    cityName: string;
    setSearchParam: Dispatch<SetStateAction<string>>;
}
const CityCard : React.FC<CityCardProps> = ({cityName, setSearchParam} ) => {

    const dispatch:Dispatch<any> = useDispatch();
    

    function addCity(e:React.MouseEvent<HTMLElement>){
        dispatch(fetchWeatherCity(e?.currentTarget?.id));
        setSearchParam('');

    }

    return(
        <>
            <div className="city-list">
                <p>{cityName}</p>
                <p>
                    {cityName !== "No Data Found" && <i className="fa-regular fa-square-plus" id={cityName} onClick={addCity}></i>}
                </p>
            </div>
            
        </>

    )
}

export default CityCard;