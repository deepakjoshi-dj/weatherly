import { useEffect, useRef, useState } from "react";
import FavouriteCard from "../utility/FavouriteCard";
import AllCityList from "./AllCityList";
import CityCard from "./CityCard";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCity, selectCity } from '../store/features/citySlice';
import { WeatherData, selectWeatherData } from "../store/features/weatherCitySlice";
import { Dispatch } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { setCurrentSelectedCity } from "../store/features/selectedCitySlice";


const Citypage = () => {
    const dispatch:Dispatch<any> = useDispatch();
    const city = useSelector(selectCity) as string[];
    const[modalStyle,setModalStyle] = useState<{ [prop: string]: string }>({});
    const BackdropElem = useRef<HTMLDivElement>(null);
    const modalElem = useRef<HTMLDivElement>(null);
    const [searchParam, setSearchParam] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [filteredCity, setFilteredCity] = useState<string[]>([]);
    const [uniqueCity, setUniqueCity] = useState<string[]>([]);
    const weatherData = useSelector<RootState, WeatherData[]>(selectWeatherData);

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>){
        setSearchParam(e.target.value);
    }

    // let filteredCity = uniqueArray.filter((cityName)=>{
    //     return cityName.toLowerCase().includes(searchParam.toLowerCase())
    // })

    useEffect(()=>{
        let uniqueArray = city.filter((item) => !item.includes('ā')).filter(city => {
            return !(weatherData.some(cityData => cityData?.city_name === city));
        });
        setFilteredCity(uniqueArray);
        setUniqueCity(uniqueArray);
        console.log(city.length);
    },[weatherData,city])

    useEffect(()=>{
        setFilteredCity(
            uniqueCity.filter((cityName)=>{
                return cityName.toLowerCase().includes(searchParam.toLowerCase())
            })
        )
    },[uniqueCity,weatherData,searchParam])


    useEffect(() => {
        if(city.length <= 0){
            dispatch(fetchCity());
        }
    }, [dispatch]);

    useEffect(()=>{
        if(selectedCity){
            dispatch(setCurrentSelectedCity(selectedCity));
        }
    },[selectedCity])


    const ChooseCityClicked = ()=>{
        setModalStyle({
            opacity : '1',
            transform:'translateY(0)'
        })
        if(BackdropElem?.current){
            BackdropElem.current.style.display = 'block';
        }
        if(modalElem?.current){
            modalElem.current.style.display = 'block';
        }
    }

    function CancelCityClicked(){
        setModalStyle({
            opacity : '0',
            transform:'translateY(-3rem)'
        });
        if(BackdropElem?.current){
            BackdropElem.current.style.display = 'none';
        }
        if(modalElem?.current){
            modalElem.current.style.display = 'none';
        }
    }

    function BackDropClicked(){
        setModalStyle({
            opacity : '0',
            transform:'translateY(-3rem)'
        });
        if(BackdropElem?.current){
            BackdropElem.current.style.display = 'none';
        }

        if(modalElem?.current){
            modalElem.current.style.display = 'none';
        }
    }

    return(
        <>
            <div className='backdrop' onClick={BackDropClicked} ref={BackdropElem} ></div>
            <div className="modal" style={modalStyle} ref={modalElem}>
                <div className="card-header">
                    <h1 className="modal__title">Add City</h1>
                    <div className="modal__actions">
                        <p>
                            <i className="fa-regular fa-circle-xmark" onClick={CancelCityClicked}></i>
                        </p>
                    </div>
                </div>
                <div className="modal_body">
                    <div>
                        <input type='search' placeholder="search city" value={searchParam} onChange={handleSearch} />
                    </div>
                    <div className="city-data">
                        {filteredCity.length > 0 ?  filteredCity.map((cityName) => 
                            <CityCard key={cityName.toLowerCase()} setSearchParam={setSearchParam} cityName={cityName} />
                        ): <CityCard key={'no data found'} setSearchParam={setSearchParam} cityName={"No Data Found"} />}
                    </div>
                </div>
            </div>
            <div className="city-container">
                <AllCityList setSelectedCity={setSelectedCity} ChooseCityClicked={ChooseCityClicked} />
                <FavouriteCard currentSelectedCity={selectedCity} isMap={true} />
            </div>
        </>
    )
}

export default Citypage;