import React, { useEffect, useState } from "react"
import "./Home.css"
function Weather() {
//    console.log(process.env)
    const [weather,setWeather] = useState()
    const [current,setCurrent] = useState()
    const [currentCity,setCurrentCity] = useState()
    const [myFav,setMyFav] = useState()
    const [unit,setUnite] = useState("imperial")
    const getWeatherDetails=(city,unit="imperial")=>{
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_Weather_API_Key}&units=${unit}`)
            .then(res=>res.json())
            .then((res)=>{
                // console.log(res)
                setWeather(res)
               
            })
            .catch((err)=>console.log(err))
    }
    useEffect(()=>{
        if(localStorage.getItem("city")){
            setMyFav(JSON.parse(localStorage.getItem("city")))
        }
        fetch(`https://ipapi.co/json`).then(res=>res.json())
            .then(async(res)=>{
                console.log(res)
                await setCurrentCity(res.city)
                setCurrent(res.city)
                getWeatherDetails(res.city)
            })
            .catch((err)=>console.log(err))
    },[])
    const makeFavorate = (e) =>{
        const {checked} = e.target
        if(localStorage.getItem("city")){
            let flag = true
            let city = localStorage.getItem("city")
            if(checked){
                city = JSON.parse(city)
                for(let i = 0;i<city.length;i++){
                    if(city[i] === weather.name){
                        flag= false
                        break;
                    }
                }
                if(flag){
                    city.push(weather.name)
                    localStorage.setItem("city",JSON.stringify(city))
                }
            }
        }
        else{
            if(checked){
                console.log("city")
                let city = []
                city.push(weather.name)
                localStorage.setItem("city",JSON.stringify(city))
                
            }
        }
    }
    const unitHandler = (units) =>{
        setUnite(units)
        getWeatherDetails(weather?.name,units)
          
    }
    return <div>
        <section className="search-bar">
            <div className="search">
                <input
                    className="input"
                    placeholder="Search city here..."
                    onChange={(e)=>setCurrentCity(e.target.value)}
                />
                <div className="btn">
                <button id="search-btn"
                    onClick={()=>getWeatherDetails(currentCity)}
                >Search</button>
                <button id="search-btn"
                    onClick={()=>getWeatherDetails(current)}
                >My Location</button>
                </div>
                
            </div>
        </section>
        <section className="current-weather" id={weather?.weather[0].main}>
            <div>
                <p className="date">{new Date(weather?.dt * 1000).toDateString()}</p>
                <p><span 
                    className="cel"
                    onClick={()=>unitHandler("metric")}
                >
                    &deg;C
                </span><span 
                    className="fahre"
                    onClick={()=>unitHandler("imperial")}
                >&deg;F</span></p>
            </div>
            <div className="display-weather">
                <div className="titel-temp">
                    <p className="title">{weather?.name}</p>
                    <p className="temp">{weather?.main?.temp?.toFixed()} &deg;{unit === "imperial"?"F":"C"}</p>
                </div>
                <div className="condition">
                   
                    <p className="temp">
                        <img 
                            src={`http://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
                            alt={weather?.weather[0].description}
                        />
                        {weather?.weather[0].main}
                    </p>
                </div>
            </div>

            <div className="current-details">
                <div className="current-detail">
                    <p className="current-temp">{weather?.main.feels_like.toFixed()}&deg;{unit === "imperial"?"F":"C"}</p>
                    <p className="current-info">Feel Like</p>
                </div>
                <div className="current-detail">
                    <p className="current-temp">{weather?.main.temp_min.toFixed()}&deg;{unit === "imperial"?"F":"C"}</p>
                    <p className="current-info">Min Temp</p>
                </div>
                <div className="current-detail">
                    <p className="current-temp">{weather?.main.temp_max.toFixed()}&deg;{unit === "imperial"?"F":"C"}</p>
                    <p className="current-info">Max Temp</p>

                </div>
                <div className="current-detail">
                    <p className="current-temp">{weather?.main.humidity.toFixed()}%</p>
                    <p className="current-info">Humidity</p>
                </div>
                <div className="current-detail">
                    <p className="current-temp">{weather?.wind.speed.toFixed()}MPH</p>
                    <p className="current-info">Wind Speed</p>
                </div>

            </div>
            <p className="fav">Make a Favorite Location<input type="checkBox"
                onClick={(e)=>makeFavorate(e)}
            /></p>
        </section>
        <h2 className="fav-title">My Favorite Locations</h2>
        <section className="my-fav-location">
           {myFav && myFav.map(location=>{
            return <div className="fav-location">
                <p>{location}</p>
                <img src={`http://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
                    alt={location}
                />
                <button
                    onClick={()=>getWeatherDetails(location)}
                >View Weather</button>
            </div>
           })} 
        </section>

        {/* <section className="advance-forecast">
            {weather && weather.list.map((day)=>{
                
                return <div className="card" id={day.weather[0].main} key={day.dt}>
                <p >{new Date(current?.dt * 1000).toDateString()}</p>
                <img 
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                />
                <p className="details"><span className="left">Temperature: </span><span className="right">{day.main.temp.toFixed()}&deg;F</span></p>
                <p className="details"><span className="left">Min Temp: </span><span className="right">{day.main.temp_min.toFixed()}&deg;F</span></p>
                <p className="details"><span className="left">Max Temp: </span><span className="right">{day.main.temp_max.toFixed()}&deg;F</span></p>
                <p className="details"><span className="left">Wind Speed: </span><span className="right">{day.wind.speed.toFixed()}MPH</span></p>
                <p className="details"><span className="left">Feel Like: </span><span className="right">{day.main.feels_like.toFixed()}&deg;F</span></p>
                <p className="details"><span className="left">Humidity: </span><span className="right">{day.main.humidity.toFixed()}%</span></p>
            </div>

            })}
            
        </section> */}
    </div>
}
export default Weather