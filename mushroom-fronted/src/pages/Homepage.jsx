import React, { useState, useEffect ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
// import AuthContext from  '../context/AuthContext';

function WeatherCard({ data }) {
    return (
        <div className="bg-white shadow-lg rounded-lg p-4 text-center m-2 w-60">
            <h2 className="font-semibold">{new Date(data.dt * 1000).toLocaleDateString()}</h2>
            <img
                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                alt={data.weather[0].description}
                className="mx-auto w-16 h-16"
            />
            <p className="text-md capitalize">{data.weather[0].description}</p>
            <p className="text-lg font-bold">
                {data.main.temp_min.toFixed(1)}°C / {data.main.temp_max.toFixed(1)}°C
            </p>
            <p className="text-sm text-gray-500">Humidity: {data.main.humidity}%</p>
        </div>
    );
}

function HomePage() {
    const navigate = useNavigate();
    // const { user } = useContext(AuthContext);
    const [weatherData, setWeatherData] = useState([]);
    const [location, setLocation] = useState('Unknown Location');
    const [isLoading, setIsLoading] = useState(true);

    const filterWeatherData = (list) => list.filter((_, index) => !(index % 8)).slice(0, 5);

    const getWeatherData = async ({ lat, lon }) => {
        try {
            const apiKey = 'e13e248ba58a789dbfacad81dd150a7e';
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching weather data:', error.message);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    const data = await getWeatherData({ lat: latitude, lon: longitude });

                    if (data && data.list) {
                        setLocation(data.city?.name || 'Unknown Location');
                        setWeatherData(filterWeatherData(data.list));
                    } else {
                        console.log('No weather data available.');
                        setLocation('No weather data available');
                        setWeatherData([]);
                    }
                }, (error) => {
                    console.error('Error fetching location:', error);
                    alert('Unable to retrieve location.');
                    setLocation('Unable to retrieve location');
                    setWeatherData([]);
                });
            } catch (error) {
                console.error('Unexpected error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {/* <h1>{user ?? 'test'}</h1> */}
            <div className="bg-gray-100 py-6 min-h-screen">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold mb-5">Weather Forecast for {location}</h1>
                    {isLoading ? (
                        <p className="text-center text-lg">Loading weather data...</p>
                    ) : weatherData.length > 0 ? (
                        <div className="flex justify-center items-center flex-wrap">
                            {weatherData.map((item, index) => (
                                <WeatherCard key={index} data={item} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-lg">No weather data available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
