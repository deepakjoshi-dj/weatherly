import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { RootState } from "../store/store";
import { WeatherData, selectWeatherData } from "../store/features/weatherCitySlice";
import { useSelector, useDispatch } from "react-redux";
import { addToFavorites,removeFromFavorites } from "../store/features/favouriteCitySlice";
import { toast } from "react-toastify";

interface FavouriteCardProps {
    currentSelectedCity : string,
    isMap : boolean
}

const FavouriteCard:React.FC<FavouriteCardProps> = ({currentSelectedCity, isMap}) => {
    const dispatch = useDispatch();
    const weatherData = useSelector<RootState, WeatherData[]>(selectWeatherData);
    const favouriteCityList = useSelector((state:RootState) => state.favouriteCities.favouriteCityList);
    const selectedCity = useSelector((state:RootState) => state.selectedCity.selectedCity);

    const cityData = weatherData?.find((city) => {
        if (city?.city_name === currentSelectedCity || city?.secondary_city_name === currentSelectedCity) {
          return city;
        }
        if(isMap){
            if(city?.city_name === selectedCity){
                return city;
            }
        }
    });
          
    enum Images {
        ATMOSPHERE = require('./images/atmosphere.jpg'),
        CLEAR = require('./images/clear.jpg'),
        CLOUDS = require('./images/clouds.jpg'),
        DRIZZLE = require('./images/drizzle.jpg'),
        RAIN = require('./images/rain.jpg'),
        SNOW = require('./images/snow.jpg'),
        THUNDERSTORM = require('./images/thunderstorm.jpg'),
        HAZE = require('./images/haze.jpg'),
        NONE = require('./images/img.jpg')
    }

    const [imgType, setImgType] = useState<{ [prop: string]: string }>({ backgroundImage: '' });

    useEffect(() => {
        switch(cityData?.weather_main?.toUpperCase()){
            case 'ATMOSPHERE':
                setImgType({
                    backgroundImage: `url(${Images.ATMOSPHERE})`,
                });
                break;
            case 'CLEAR':
                setImgType({
                    backgroundImage: `url(${Images.CLEAR})`,
                });
                break;
            case 'CLOUDS':
                setImgType({
                    backgroundImage: `url(${Images.CLOUDS})`,
                });
                break;
            case 'DRIZZLE':
                setImgType({
                    backgroundImage: `url(${Images.DRIZZLE})`,
                });
                break;
            case 'RAIN':
                setImgType({
                    backgroundImage: `url(${Images.RAIN})`,
                });
                break;
            case 'SNOW':
                setImgType({
                    backgroundImage: `url(${Images.SNOW})`,
                });
                break;
            case 'THUNDERSTORM':
                setImgType({
                    backgroundImage: `url(${Images.THUNDERSTORM})`,
                });
                break;
            case 'HAZE':
                setImgType({
                    backgroundImage: `url(${Images.HAZE})`,
                });
                break;
            default:
                cityData?.city_name && 
                setImgType({
                    backgroundImage: `url(${Images.HAZE})`,
                });
                break;
        }
        if(!cityData?.city_name){
            setImgType({
                backgroundImage: `url(${Images.NONE})`,
            });
        }
        
    }, [cityData?.city_name]);

    function getTimeFromTimestamp(timeStamp:number):string{
        let date = new Date(timeStamp*1000);

        var sunriseHours = date.getHours();
        // Minutes part from the timestamp
        var sunriseMinutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var sunriseSeconds = "0" + date.getSeconds();

        return sunriseHours + ':' + sunriseMinutes.substr(-2) + ':' + sunriseSeconds.substr(-2);
    }

    let sunriseTime = getTimeFromTimestamp(cityData?.sunrise ? cityData?.sunrise : 0);
    let sunsetTime = getTimeFromTimestamp(cityData?.sunset ? cityData?.sunset : 0);

    function handleAddToFavourite(e:React.MouseEvent<HTMLElement>){
        dispatch(addToFavorites(e?.currentTarget?.id));
        toast.success(`${e?.currentTarget?.id} added to favourite cities`,{
            position:toast.POSITION.TOP_CENTER,
            autoClose:3000,
            hideProgressBar: true,
        });
    }

    function handleRemoveFromFavourite(e:React.MouseEvent<HTMLElement>){
        dispatch(removeFromFavorites(e?.currentTarget?.id));
        toast.success(`${e?.currentTarget?.id} removed from favourite cities`,{
            position:toast.POSITION.TOP_CENTER,
            autoClose:3000,
            hideProgressBar: true,
        });
    }

    useEffect(()=>{
        console.log(favouriteCityList)
    },[favouriteCityList])

    return (
        <div style={imgType} className='card-weather-img' key={cityData?.city_name} >
            <div className='card-weather-img-shading'>
                <div className="card-header">
                    <p>{cityData?.city_name ? cityData?.city_name : 'Select City'}</p>
                    { cityData?.city_name ? (
                        cityData?.city_name && favouriteCityList.includes(cityData?.city_name) ? (
                            <i className="fa-solid fa-star" id={cityData?.city_name} onClick={handleRemoveFromFavourite}></i>
                        ) : (
                            <i className="fa-regular fa-star" id={cityData?.city_name} onClick={handleAddToFavourite}></i>
                        )) : ''
                    }
                </div>
                <div className='card-body'>
                    { !cityData?.city_name ? (<div className="center-containt">
                        <h1>No City Selected</h1>
                        {/* <button className="add-city-btn">Add City</button> */}
                    </div>) 
                    : (
                        <dl>
                            <dd style={{fontSize:'3rem'}}><i className="fa-solid fa-temperature-high"></i>&ensp;{((cityData?.temp ? cityData?.temp : 0) -273.15).toFixed(2)}°C</dd>
                            <dd style={{fontWeight:'bold', fontSize:'1rem', margin:'0.5rem 0'}}>Feels like {((cityData?.feelsLike ? cityData?.feelsLike : 0)-273.15).toFixed(2)}°C {cityData?.weather_main ? cityData?.weather_main : ''}. {cityData?.weather_description ? cityData?.weather_description : ''}</dd>
                            <dd>Humidity {cityData?.humidity ? cityData?.humidity : ''}%</dd>
                            <dd>Pressure {cityData?.pressure ? cityData?.pressure : ''} hPa</dd>
                            <dd>Min Temp {((cityData?.temp_min ? cityData?.temp_min : 0)-273.15).toFixed(2)}°C</dd>
                            <dd>Max Temp {((cityData?.temp_max ? cityData?.temp_max : 0)-273.15).toFixed(2)}°C</dd>
                            <dd>Sunrise {sunriseTime}</dd>
                            <dd>Sunset {sunsetTime}</dd>
                            <dd>Wind Speed {cityData?.wind_speed ? cityData?.wind_speed : 0} Meter/Sec</dd>
                        </dl>)
                    }
                </div>
                {
                    (isMap && cityData?.city_name) && (
                        <div className="card-footer">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15281525.267671324!2d72.09835435915292!3d20.757232397292487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1686481534573!5m2!1sen!2sin" width="100%" height="100%" loading="lazy" ></iframe>
                        </div>
                    )
                }

            </div>

        </div>
    );
};

export default FavouriteCard;
