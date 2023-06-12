import { useSelector } from "react-redux";
import FavouriteCard from "../utility/FavouriteCard";
import { RootState } from "../store/store";
import { WeatherData, selectWeatherData } from "../store/features/weatherCitySlice";
import { useNavigate } from "react-router-dom";



const Homepage = () => {
    const navigate = useNavigate();
    const weatherData = useSelector<RootState, WeatherData[]>(selectWeatherData);
    const favouriteCityList = useSelector((state:RootState) => state.favouriteCities.favouriteCityList);

    return( 
        <>
            {
                (weatherData?.length === 0 || favouriteCityList?.length === 0) ? (<div className="no-weather-found">
                    <div>
                        <h1>Please Add City To Favourite</h1>
                        <button className="add-city-btn" onClick={()=>navigate('/cities')}>Add City</button>
                    </div>
                </div>)

                : (
                    <div className="card">
                        {
                            weatherData.map((cityData)=>
                                favouriteCityList.includes(cityData?.city_name) && (
                                    <FavouriteCard currentSelectedCity={cityData?.city_name} isMap={false} />
                                )
                            )
                        }
                    </div>
                )
            }
        
        </>
    )
}

export default Homepage;