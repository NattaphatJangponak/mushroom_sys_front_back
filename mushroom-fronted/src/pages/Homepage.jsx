import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Dot,
} from "recharts";
import axios from "axios";

const growthRecords = [
    { day: "Grow 01", value: 1.0 },
    { day: "Grow 02", value: 2.5 },
    { day: "Grow 03", value: 1.8 },
    { day: "Grow 02", value: 1.2 },
    { day: "Grow 01", value: 1.6 },
    { day: "Grow 02", value: 2.8, highlight: true },
    { day: "Grow 03", value: 1.9 },
    { day: "Grow 02", value: 2.0 },
    { day: "Grow 01", value: 1.5 },
];


const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 shadow-md rounded-md border border-gray-300">
                <p className="text-gray-700 font-semibold">{`Grow ${payload[0].payload.day}`}</p>
                <p className="text-blue-500 font-bold">{`Value: ${payload[0].value}`}</p>
                <p className="text-gray-500">Monday, April 22nd</p>
            </div>
        );
    }
    return null;
};




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
    const [deviceLogs, setDeviceLogs] = useState(0);
    const [potLogs, setPotLogs] = useState(0);

    const [images, setImages] = useState([]);
    const [potSafe, setPotSafe] = useState(0);
    const [potDanger, setPotDanger] = useState(0);


    const [cultivations, setCultivations] = useState([]);




    //1. สำหรับ Active/Inactive Devices
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:1880/get_active_device/");
                const data = response.data;

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


    // 2. สำหรับ pot ปกติ/ไม่ปกติ
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:1880/get_log");
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
                const response = await axios.get("http://localhost:1880/get_logs");
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
    //         const response = await axios.get("http://localhost:5000/api/cultivation");
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
        const fetchImagesForDisplay = async () => {
            if (!selectedCultivationId) return;

            try {
                const response = await axios.get(`http://localhost:5000/api/viewCultivation/${selectedCultivationId}`);

                console.log(response)
                const allData = response.data.data || [];

                const imageItems = allData
                    .filter(item => item.img_path && item.img_path.startsWith("data:image"))
                    .sort((a, b) => b.cultivation_pot_id - a.cultivation_pot_id)
                    .map(item => ({
                        src: item.img_path,
                        status: statusToColor[item.status?.toLowerCase()] || "gray",
                    }));

                setImages(imageItems.slice(0, 4));
            } catch (err) {
                console.error("❌ Error fetching image data:", err);
            }
        };

        fetchImagesForDisplay();
    }, [selectedCultivationId]);

    console.log(images)

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
                                <p className="text-xl font-bold">34.00°C</p>
                            </div>
                            <div className="bg-yellow-500 text-white p-4 rounded text-center">
                                <h3>Humidity</h3>
                                <p className="text-xl font-bold">20.00%</p>
                            </div>
                            <div className="bg-green-500 text-white p-4 rounded text-center">
                                <h3>Farm All Active</h3>
                                <p className="text-xl font-bold">1</p>
                            </div>
                            <div className="bg-red-500 text-white p-4 rounded text-center">
                                <h3>Farm All Inactive</h3>
                                <p className="text-xl font-bold">5</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-auto">
                            <select className="p-2 border rounded w-full">
                                <option>Farm Type</option>
                            </select>
                            <select className="p-2 border rounded w-full">
                                <option>Farm Name</option>
                            </select>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded">Select</button>
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
                                            <img src={img.src} alt={`img-${idx}`} className="w-28 h-36 object-cover rounded shadow" />
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
                                    value={selectedCultivationId}
                                    onChange={(e) => setSelectedCultivationId(e.target.value)}
                                >
                                    <option value="">Select Cultivation Name</option>
                                    {cultivations.map((item) => (
                                        <option key={item.cultivation_id} value={item.cultivation_id}>
                                            {item.name || `Cultivation ${item.cultivation_id}`}
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
                            <h2 className="text-md font-bold mb-2 text-center">
                                Mashroom Overview
                            </h2>

                            <div className="h-64"> {/* เพิ่มความสูงได้ด้วย */}
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={growthRecords}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#2563eb"
                                            dot={({ cx, cy, payload }) => (
                                                <Dot
                                                    cx={cx}
                                                    cy={cy}
                                                    r={payload.highlight ? 6 : 4}
                                                    fill={payload.highlight ? "#2563eb" : "#d1d5db"}
                                                    stroke={payload.highlight ? "#1e3a8a" : "none"}
                                                />
                                            )}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <p className="text-center mt-2 text-sm">
                                The growth efficiency is <strong>30%</strong><br />
                                <span className="text-xs text-gray-600">
                                    30% Better compared to last month
                                </span>
                            </p>

                            <div className="flex justify-center mt-3">
                                <button className="bg-black text-white px-5 py-1 rounded hover:bg-gray-800 text-sm">
                                    Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default HomePage;
