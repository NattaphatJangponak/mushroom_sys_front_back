import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";






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



    const [searchParams] = useSearchParams();
    const cultivationId = searchParams.get("cultivation_id"); // ✅ อยู่ก่อนฟังก์ชันใดๆ ที่ใช้
    const [selectedCultivationId, setSelectedCultivationId] = useState("");

    const [activeDevices, setActiveDevices] = useState([]);
    const [inactiveDevices, setInActiveDevices] = useState(0);
    const [activeFarm, setActiveFarm] = useState([]);
    const [inactiveFarm, setInActiveFarm] = useState(0);

    const [potLogs, setPotLogs] = useState([]);

    const [images, setImages] = useState([]);
    const [potSafe, setPotSafe] = useState(0);
    const [potDanger, setPotDanger] = useState(0);
    const [farms, setFarms] = useState([]);
    const [selectedFarmId, setSelectedFarmId] = useState("");
    const [selectedFarmData, setSelectedFarmData] = useState(null);



    const [cultivations, setCultivations] = useState([]);

    const formattedBarData = potLogs.map(log => ({
        date: log.date,
        "Pot Safe": log.normal_pot,
        "Pot Danger": log.unnormal_pot
    }));




    //1. สำหรับ Active/Inactive Devices
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://49.0.81.242:1880/get_active_device/");
                const data = response.data;
                console.log("👉 Response from /get_active_device:", response.data);

                if (Array.isArray(data) && data.length > 0) {
                    setActiveDevices(data[0].active_count);
                    setInActiveDevices(data[0].inactive_count);
                    console.log("Device counts loaded:", data[0]);
                } else {
                    console.error("Unexpected response format:", data);
                }
            } catch (error) {
                console.error("Error fetching active devices:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const response = await axios.get("http://49.0.81.242:5000/api/farm");
                if (Array.isArray(response.data.data)) {
                    setFarms(response.data.data);
                    console.log("🌾 Farm list loaded:", response.data.data);
                }
            } catch (error) {
                console.error("Error fetching farms:", error);
            }
        };

        fetchFarms();
    }, []);


    //1. สำหรับ Active/Inactive Farm
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://49.0.81.242:1880/get_active_farm/");
                const data = response.data;
                console.log("👉 Response from /get_active_device:", response.data);

                if (Array.isArray(data) && data.length > 0) {
                    setActiveFarm(data[0].active_count);
                    setInActiveFarm(data[0].inactive_count);
                    console.log("Device counts loaded:", data[0]);
                } else {
                    console.error("Unexpected response format:", data);
                }
            } catch (error) {
                console.error("Error fetching active devices:", error);
            }
        };

        fetchData();
    }, []);


    // 2. สำหรับ pot ปกติ/ไม่ปกติ
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://49.0.81.242:1880/get_log");
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const log = response.data[0];
                    setPotSafe(log.normal_pot);
                    setPotDanger(log.unnormal_pot);
                    console.log("Pot log data loaded:", log);
                } else {
                    console.error("Device logs response is not array:", response.data);
                }
            } catch (error) {
                console.error("Error fetching device logs:", error);
            }
        };
        fetchData();
    }, []);



    // 3. สำหรับ graph
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://49.0.81.242:1880/get_logs");
                if (Array.isArray(response.data)) {
                    setPotLogs(response.data);
                    console.log("Pot logs loaded:", response.data);
                } else {
                    console.error("Pot logs response is not array:", response.data);
                    setPotLogs([]);
                }
            } catch (error) {
                console.error("Error fetching pot logs:", error);
                setPotLogs([]);
            }
        };
        fetchData();
    }, []);


    // const fetchCultivations = async () => {
    //     try {
    //         const response = await axios.get("http://49.0.81.242:5000/api/cultivation");
    //         console.log(response)
    //         // if (Array.isArray(response.data.data)) {
    //         //     setCultivations(response.data.data);
    //         // }
    //     } catch (err) {
    //         console.error("❌ Error fetching cultivation list:", err);
    //     }
    // };

    // useEffect(() => {
    //     fetchCultivations();
    // }, []);


    const statusToColor = {
        pending: "yellow",
        safe: "green",
        danger: "red",
    };

 
    useEffect(() => {
        const fetchFarmImages = async () => {
            if (!selectedFarmId) return;
    
            try {
                const response = await axios.get("http://49.0.81.242:1880/pic_farm");
                const data = response.data;
    
                if (Array.isArray(data)) {
                    const filtered = data
                        .filter(item =>
                            item.farm_id === Number(selectedFarmId) &&
                            item.pot_img && 
                            item.pot_img.length > 100
                            && item.status
                        )
                        .map((item) => {
                            const base64 = item.pot_img;
                            const finalSrc = base64.startsWith("data:image")
                                ? base64
                                : `data:image/jpeg;base64,${base64}`;
                            
                            const statusColor = statusToColor[item.status?.toLowerCase()] || "gray";
                        
                            return {
                                src: finalSrc,
                                status: statusColor
                            };
                        });
                        
    
                    console.log("✅ Final image src list:", filtered);
                    setImages(filtered.slice(0, 4));
                } else {
                    console.error("❌ Unexpected data format:", data);
                }
            } catch (err) {
                console.error("❌ Error fetching images from /pic_farm:", err);
            }
        };
    
        fetchFarmImages();
    }, [selectedFarmId]);
    
    


    console.log(images)

    const handleSelectFarm = () => {
        const farm = farms.find(f => f.farm_id === Number(selectedFarmId));
        if (farm) {
            setSelectedFarmData({
                temperature: farm.temperature,
                humidity: farm.humidity
            });
        }
    };


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
                {/* Farm + Device Section (เท่ากันทุก card) */}
                <div className="grid grid-cols-2 gap-4 px-8 mt-8">
                    {/* Farm Card */}
                    <div className="bg-white shadow-md rounded-lg p-4 h-full flex flex-col">
                        <h2 className="text-xl font-semibold mb-4">Farm</h2>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            <div className="bg-blue-500 text-white p-4 rounded text-center">
                                <h3>Temperature</h3>
                                <p className="text-xl font-bold">
                                    {selectedFarmData ? `${selectedFarmData.temperature}°C` : "N/A"}
                                </p>

                            </div>
                            <div className="bg-yellow-500 text-white p-4 rounded text-center">
                                <h3>Humidity</h3>
                                <p className="text-xl font-bold">
                                    {selectedFarmData ? `${selectedFarmData.humidity}%` : "N/A"}
                                </p>

                            </div>
                            <div className="bg-green-500 text-white p-4 rounded text-center">
                                <h3>Farm All Active</h3>
                                <p className="text-xl font-bold">{activeFarm}</p>
                            </div>
                            <div className="bg-red-500 text-white p-4 rounded text-center">
                                <h3>Farm All Inactive</h3>
                                <p className="text-xl font-bold">{inactiveFarm}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-auto">
                            <select
                                className="p-2 border rounded w-full"
                                value={selectedFarmId}
                                onChange={(e) => setSelectedFarmId(e.target.value)}
                            >
                                <option value="">Farm Name</option>
                                {farms.map(farm => (
                                    <option key={farm.farm_id} value={farm.farm_id}>
                                        {farm.name || `Farm ${farm.farm_id}`}
                                    </option>
                                ))}
                            </select>

                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={handleSelectFarm}
                            >
                                Select
                            </button>

                        </div>
                    </div>

                    {/* Device Card */}
                    <div className="bg-white shadow-md rounded-lg p-4 h-full flex flex-col">
                        <h2 className="text-xl font-semibold mb-4">Device</h2>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                            <div className="bg-green-500 text-white p-4 rounded text-center">
                                <h3>Device Active</h3>
                                <p className="text-2xl font-bold">{activeDevices}</p>
                            </div>
                            <div className="bg-red-500 text-white p-4 rounded text-center">
                                <h3>Device Inactive</h3>
                                <p className="text-2xl font-bold">{inactiveDevices}</p>
                            </div>
                            <div className="bg-green-500 text-white p-4 rounded text-center">
                                <h3>Pot Safe</h3>
                                <p className="text-2xl font-bold">{potSafe}</p>
                            </div>
                            <div className="bg-yellow-500 text-white p-4 rounded text-center">
                                <h3>Pot Danger</h3>
                                <p className="text-2xl font-bold">{potDanger}</p>
                            </div>

                        </div>


                    </div>
                </div>

                <div className="bg-gray-100 p-6">
                    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between gap-6">
                        {/* Left: Device Section */}
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">Device</h2>

                            </div>

                            {/* Image Grid */}
                            <div className="p-4">
                                <h2 className="text-xl font-bold mb-4">Latest Images</h2>
                                <div className="flex gap-4 flex-wrap">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative">
                                            <img src={img.src} alt={`farm-img-${idx}`} className="w-28 h-36 object-cover rounded shadow" />
                                            <span
                                                className={`absolute top-1 right-1 w-3 h-3 rounded-full border border-white ${img.status === "green"
                                                        ? "bg-green-400"
                                                        : img.status === "yellow"
                                                            ? "bg-yellow-400"
                                                            : img.status === "red"
                                                                ? "bg-red-400"
                                                                : "bg-gray-400"
                                                    }`}
                                            />
                                        </div>
                                    ))}
                                </div>

                            </div>

                            <div className="flex gap-2 mt-auto">
                                <select
                                    className="p-2 border rounded w-full"
                                    value={selectedFarmId}
                                    onChange={(e) => setSelectedFarmId(e.target.value)}
                                >
                                    <option value="">Farm Name</option>
                                    {farms.map(farm => (
                                        <option key={farm.farm_id} value={farm.farm_id}>
                                            {farm.farm_name}
                                        </option>
                                    ))}
                                </select>



                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    onClick={() => setImages([])}
                                >
                                    Clear
                                </button>
                            </div>

                        </div>

                        {/* Right: Mushroom Overview */}
                        <div className="flex-1 max-w-[600px] border border-gray-300 rounded-md p-4 bg-white shadow-sm">
                            <h2 className="text-md font-bold mb-2 text-center">Pot Overview</h2>

                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={potLogs.map(log => ({
                                        date: log.date,
                                        "Pot Safe": log.normal_pot,
                                        "Pot Danger": log.unnormal_pot
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Pot Safe" fill="#22c55e" />
                                        <Bar dataKey="Pot Danger" fill="#FF4C4C" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>


                    </div>
                </div>

            </div>

        </div>
    );
}

export default HomePage;
