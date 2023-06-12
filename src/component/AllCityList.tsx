import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { WeatherData, removeFromCitiesList, selectWeatherData } from "../store/features/weatherCitySlice";
import { Dispatch, SetStateAction, useEffect } from "react";
import { removeFromFavorites } from "../store/features/favouriteCitySlice";
import {  toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface AllCityListProps {
    ChooseCityClicked: any;
    setSelectedCity: Dispatch<SetStateAction<string>>;
}

const AllCityList: React.FC<AllCityListProps> = ({ ChooseCityClicked, setSelectedCity}) => {
    const weatherData = useSelector<RootState, WeatherData[]>(selectWeatherData);
    const dispatch = useDispatch();
    const favouriteCityList = useSelector(
        (state: RootState) => state.favouriteCities.favouriteCityList
    );

    function cityCardClicked(e: React.MouseEvent<HTMLDivElement>) {
        if (!elementContainsClass(e.target as HTMLElement, "fa-xmark")) {
            setSelectedCity(e?.currentTarget?.id);
        }
    }

    function elementContainsClass(element: HTMLElement, className: string): boolean {
        if (element.classList.contains(className)) {
            return true;
        }
        return false;
    }

    const selectedCity = useSelector(
        (state: RootState) => state.selectedCity.selectedCity
    );

    function removeCityClicked(city: string) {
        confirmAlert({
            customUI: ({ onClose }) => (
              <div className="confirmation-container">
                <h2>Remove City</h2>
                <div className="confirmation-icon">
                    <img width="80" height="80" src="https://img.icons8.com/color/96/delete-forever.png" alt="delete-forever"/>
                </div>
                <div>
                    <p style={{fontSize:'1.2rem'}}>Are you sure you want to proceed?</p>
                    {   favouriteCityList.includes(city) &&
                        <p style={{fontSize:'1.2rem'}}>It will remove from favourite list also.</p>
                    }
                </div>
                <div>
                    <button className="confirmation-button" style={{backgroundColor:'rgba(255, 0, 0, 0.581)'}} onClick={ () => {
                        if (favouriteCityList.includes(city)) {
                            dispatch(removeFromFavorites(city));
                        }
                        dispatch(removeFromCitiesList(city));
                        toast.dismiss();
                        toast.success(`${city} removed from your cities list`,{
                            position:toast.POSITION.TOP_CENTER,
                            autoClose:3000,
                            hideProgressBar: true,
                        });
                        if(selectedCity === city){
                            if(weatherData[0]?.city_name !== city){
                                setSelectedCity(weatherData[0]?.city_name);
                            }else{
                                setSelectedCity(weatherData[1]?.city_name);
                            }
                        }
                        onClose();
                    }}>Remove</button>
                    <button className="confirmation-button" onClick={onClose}>Cancel</button>
                </div>
                
              </div>
            ),
        });
    }

    return (
        <>  
            <div className="city-containt">
                <div className="city-containt-header">
                    <div className="card-header">
                        <p>Cities</p>
                        <i className="fa-regular fa-square-plus" onClick={ChooseCityClicked}></i>
                    </div>
                </div>
                {weatherData.length > 0 ? (
                    weatherData?.map((city, index) => (
                        <>
                            <div
                                className="city-card"
                                style={{
                                    backgroundColor: `${selectedCity === city?.city_name
                                            ? "rgb(232, 122, 26)"
                                            : "initial"
                                        }`,
                                }}
                                key={index}
                                id={city?.city_name}
                                onClick={cityCardClicked}
                            >
                                <div className="city-card-header">
                                    <p style={{ fontSize: "1.6rem" }}>{city?.city_name}</p>
                                    <i
                                        className="fa-solid fa-xmark"
                                        onClick={() => removeCityClicked(city?.city_name)}
                                    ></i>
                                </div>
                                <p>{(city?.temp - 273.15).toFixed(2)}°C</p>
                            </div>
                        </>
                    ))
                ) : (
                    <div className="city-card" onClick={ChooseCityClicked}>
                        <p style={{ fontSize: "1.6rem" }}>No City Added</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default AllCityList;
