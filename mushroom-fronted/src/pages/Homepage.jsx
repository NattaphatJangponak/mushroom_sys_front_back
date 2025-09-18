import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
 
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, PieChart, Pie,
    Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';



import { XIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, MinusIcon, DownloadIcon } from '@heroicons/react/solid';

const NODE_RED_BASE = import.meta.env.VITE_NODE_RED;
const PRISMA_BASE = import.meta.env.VITE_PRISMA;





function WeatherCard({ data }) {
    return (
        <div className="bg-white shadow-xl rounded-2xl p-4 text-center w-full">
            <h2 className="font-semibold text-gray-700 mb-2 text-sm">{new Date(data.dt * 1000).toLocaleDateString()}</h2>
            <img
                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                alt={data.weather[0].description}
                className="mx-auto w-16 h-16"
            />
            <p className="text-sm capitalize text-gray-600 mt-1">{data.weather[0].description}</p>
            <p className="text-md font-bold text-black-700">
                {data.main.temp_min.toFixed(1)}°C / {data.main.temp_max.toFixed(1)}°C
            </p>
            <p className="text-xs text-gray-400 mt-1">Humidity: {data.main.humidity}%</p>
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


    const [activeDevices, setActiveDevices] = useState([]);
    const [inactiveDevices, setInActiveDevices] = useState(0);
    const [allDevices, setAllDevices] = useState([]);
    const [activeFarm, setActiveFarm] = useState([]);
    const [inactiveFarm, setInActiveFarm] = useState(0);
    const [allFarm, setAllFarm] = useState([]);

    const [potLogs, setPotLogs] = useState([]);

    const [images, setImages] = useState([]);
    const [potSafe, setPotSafe] = useState(0);
    const [potDanger, setPotDanger] = useState(0);
    const [farms, setFarms] = useState([]);
    const [selectedFarmId, setSelectedFarmId] = useState("");
    const [selectedFarmData, setSelectedFarmData] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredImages = statusFilter === "all"
        ? images
        : images.filter((img) => img.status === statusFilter);
    const [showFullGraph, setShowFullGraph] = useState(false);



    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1);
    const [showFarmModal, setShowFarmModal] = useState(false);

    const [showRobotModal, setShowRobotModal] = useState(false);










    const formattedBarData = potLogs.map(log => ({
        date: log.date,
        "Pot Safe": log.normal_pot,
        "Pot Danger": log.unnormal_pot
    }));




    //1. สำหรับ Active/Inactive Devices
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await axios.get("http://172.17.64.1:1880/get_active_device/");
                const response = await axios.get(`${NODE_RED_BASE}/get_active_device/`);
                const data = response.data;
                console.log("👉 Response from /get_active_device:", response.data);

                if (Array.isArray(data) && data.length > 0) {
                    setActiveDevices(data[0].active_count);
                    setInActiveDevices(data[0].inactive_count);
                    setAllDevices(data[0].all_device);
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
                // const response = await axios.get("http://172.17.64.1:5000/api/farm");
                const response = await axios.get(`${PRISMA_BASE}/api/farm`);
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
                // const response = await axios.get("http://172.17.64.1:1880/get_active_farm/");
                const response = await axios.get(`${NODE_RED_BASE}/get_active_farm/`);
                const data = response.data;
                console.log("👉 Response from /get_active_device:", response.data);

                if (Array.isArray(data) && data.length > 0) {
                    setActiveFarm(data[0].active_count);
                    setInActiveFarm(data[0].inactive_count);
                    setAllFarm(data[0].all_farm);
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
                // const response = await axios.get("http://172.17.64.1:1880/get_log");
                const response = await axios.get(`${NODE_RED_BASE}/get_log`);
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
                // const response = await axios.get("http://172.17.64.1:1880/get_logs");
                const response = await axios.get(`${NODE_RED_BASE}/get_logs`);
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
    const chartData = potLogs
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(log => ({
            date: log.date, // หรือใช้ 'YYYY-MM-DD'
            "Pot Safe": log.normal_pot,
            "Pot Danger": log.unnormal_pot
        }));


    // const fetchCultivations = async () => {
    //     try {
    //         const response = await axios.get("http://172.17.64.1:5000/api/cultivation");
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
                // const response = await axios.get("http://172.17.64.1:1880/pic_farm");
                const response = await axios.get(`${NODE_RED_BASE}/pic_farm`);
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
                    setImages(filtered.slice(0, 5));
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
        if (selectedFarmId === "") {
            setSelectedFarmData(null);
        } else {
            const farm = farms.find(f => f.farm_id === Number(selectedFarmId));
            if (farm) {
                setSelectedFarmData({
                    temperature: farm.temperature,
                    humidity: farm.humidity,
                    farm_type: farm.farm_type,
                    farm_status: farm.farm_status
                });
            }
        }
    };

    const handleCardClick = (type) => {
        if (!selectedFarmData) return;

        let data = [];

        if (type === 'temperature') {
            data = [
                { name: 'Temperature', value: selectedFarmData.temperature },
                { name: 'Remaining', value: 100 - selectedFarmData.temperature },
            ];
        } else if (type === 'humidity') {
            data = [
                { name: 'Humidity', value: selectedFarmData.humidity },
                { name: 'Remaining', value: 100 - selectedFarmData.humidity },
            ];
        }

        setPieData(data);
        setShowPieModal(true);
    };
    const handleDownload = () => {
        if (!currentImage) return;
        const link = document.createElement('a');
        link.href = currentImage;
        link.download = 'image.jpg';
        link.click();
    };




    return (
        <div className="bg-gray-100 py-6 font-title min-h-screen">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold text-center mb-6">Dashboard</h1>

                {/* Top Section: Weather + Pot Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white shadow-lg rounded-xl p-6 col-span-2 transition-transform hover:scale-[1.02]">
                        <h1 className="text-xl font-bold text-center mb-4">Weather Forecast for {location}</h1>
                        {isLoading ? (
                            <p className="text-center text-lg">Loading weather data...</p>
                        ) : weatherData.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                                {weatherData.slice(0, 4).map((item, index) => (
                                    <WeatherCard key={index} data={item} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-lg">No weather data available.</p>
                        )}
                    </div>

                    <div
                        className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-[1.02] cursor-pointer"
                        onClick={() => setShowFullGraph(true)}
                    >
                        <h2 className="text-md font-bold mb-4 text-center">Pot Overview</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 13 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Pot Safe" stroke="#22c55e" strokeWidth={2} />
                                    <Line type="monotone" dataKey="Pot Danger" stroke="#FF4C4C" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* Middle Section: Farm and Device */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col h-full w-full transition-transform hover:scale-[1.02]">
                        {/* Header Section (เปิด modal ได้) */}
                        <div onClick={() => selectedFarmData && setShowFarmModal(true)} className="flex-1 cursor-pointer">
                            <h2 className="text-xl font-semibold mb-4">Farm</h2>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div
                                    className="bg-blue-500 text-white p-4 rounded text-center flex flex-col items-center justify-center h-24"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCardClick('temperature');
                                    }}
                                >
                                    <h3>Temperature</h3>
                                    <p className="text-xl font-bold">
                                        {selectedFarmData ? `${selectedFarmData.temperature}°C` : "N/A"}
                                    </p>
                                </div>

                                <div
                                    className="bg-yellow-500 text-white p-4 rounded text-center flex flex-col items-center justify-center h-24"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCardClick('humidity');
                                    }}
                                >
                                    <h3>Humidity</h3>
                                    <p className="text-xl font-bold">
                                        {selectedFarmData ? `${selectedFarmData.humidity}%` : "N/A"}
                                    </p>
                                </div>

                                {selectedFarmData ? (
                                    <>
                                        <div className="bg-purple-500 text-white p-4 rounded text-center flex flex-col items-center justify-center h-24">
                                            <h3>ประเภทโรง</h3>
                                            <p className="text-xl font-bold">{selectedFarmData.farm_type}</p>
                                        </div>
                                        <div className="bg-indigo-500 text-white p-4 rounded text-center flex flex-col items-center justify-center h-24">
                                            <h3>สถานะโรง</h3>
                                            <p className="text-xl font-bold">
                                                {selectedFarmData.farm_status ? "โรงมีคนใช้งาน" : "โรงไม่มีคนใช้งาน"}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-green-500 text-white p-4 rounded text-center flex flex-col items-center justify-center h-24">
                                            <h3>โรงทั้งหมดที่ใช้งาน</h3>
                                            <p className="text-xl font-bold">{activeFarm}/{allFarm}</p>
                                        </div>
                                        <div className="bg-red-500 text-white p-4 rounded text-center flex flex-col items-center justify-center h-24">
                                            <h3>โรงทั้งหมดที่ไม่ใช้งาน</h3>
                                            <p className="text-xl font-bold">{inactiveFarm}/{allFarm}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Footer Section (select farm) */}
                        <div className="flex gap-2 mt-2">
                            <select
                                className="p-2 border rounded w-full"
                                value={selectedFarmId}
                                onChange={(e) => setSelectedFarmId(e.target.value)}
                            >
                                <option value="">All Farms</option>
                                {farms.map(farm => (
                                    <option key={farm.farm_id} value={farm.farm_id}>{farm.farm_name}</option>
                                ))}
                            </select>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectFarm();
                                }}
                            >
                                Select
                            </button>
                        </div>
                    </div>


                    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col h-full w-full transition-transform hover:scale-[1.02]" onClick={() => setShowRobotModal(true)}>
                        <h2 className="text-xl font-semibold mb-4">Robot</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">

                            <div className="bg-green-500 text-white p-4 rounded text-center flex flex-col items-center justify-center h-24 ">
                                <h3>เห็ดปกติ</h3>
                                <p className="text-xl font-bold">{potSafe}/{potSafe + potDanger}</p>
                            </div>
                            <div className="bg-red-500 text-white p-4 rounded text-center flex flex-col items-center justify-center h-24 ">
                                <h3>เห็ดผิดปกติ</h3>
                                <p className="text-xl font-bold">{potDanger}/{potSafe + potDanger}</p>
                            </div>
                            <div className="bg-green-500 text-white p-4 rounded text-center flex flex-col items-center justify-center h-24 ">
                                <h3>Robot ทำงาน</h3>
                                <p className="text-xl font-bold">{activeDevices}/{allDevices}</p>
                            </div>
                            <div className="bg-red-500 text-white p-4 rounded text-center flex flex-col items-center justify-center h-24 ">
                                <h3>Robot ไม่ทำงาน</h3>
                                <p className="text-xl font-bold">{inactiveDevices}/{allDevices}</p>
                            </div>
                        </div>

                    </div>


                </div>

                {/* Bottom Section: Latest Images */}
                <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-[1.02]">
                    <h2 className="text-xl font-bold mb-4">Latest Images</h2>
                    <div className="flex gap-4 flex-wrap">
                        {filteredImages.map((img, idx) => (
                            <div key={idx} className="relative cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => {
                                setCurrentImage(img.src);
                                setRotation(90); // เพราะ rotate 90 อยู่แล้ว
                                setScale(1);
                                setShowImageModal(true);
                            }}>
                                <img
                                    src={img.src}
                                    alt={`farm-img-${idx}`}
                                    className="w-[200px] h-[200px] object-cover rounded shadow rotate-90"
                                />
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

                    {/* ฟิลเตอร์ตาม status */}
                    <div className="flex gap-2 mt-4">
                        <select
                            className="p-2 border rounded w-full"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="green">Safe (Green)</option>
                            <option value="yellow">Pending (Yellow)</option>
                            <option value="red">Danger (Red)</option>
                        </select>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={() => {
                                setImages([]);
                                setStatusFilter("all");
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </div>
                {showFullGraph && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                        <div className="bg-white p-6 rounded-lg w-[90vw] h-[80vh] relative shadow-lg">
                            <button
                                className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                                onClick={() => setShowFullGraph(false)}
                            >
                                Close
                            </button>
                            <h2 className="text-lg font-bold mb-4 text-center">Pot Overview - Full View</h2>
                            <ResponsiveContainer width="100%" height="90%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 15 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Pot Safe" stroke="#22c55e" strokeWidth={2} />
                                    <Line type="monotone" dataKey="Pot Danger" stroke="#FF4C4C" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {showFarmModal && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl relative">

                            {/* ปุ่มปิด */}
                            <button
                                onClick={() => setShowFarmModal(false)}
                                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
                                title="Close"
                            >
                                Close
                            </button>

                            <h2 className="text-xl font-bold text-center mb-6">ข้อมูลโรงเพาะเห็ด</h2>

                            {/* กราฟแสดง Temperature & Humidity */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Pie Chart - Temperature */}
                                <div>
                                    <h3 className="text-md font-semibold text-center mb-2">อุณหภูมิ (Temperature)</h3>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: "Temp", value: selectedFarmData.temperature },
                                                    { name: "Remain", value: 100 - selectedFarmData.temperature },
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={60}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) =>
                                                    `${name} (${(percent * 100).toFixed(0)}%)`
                                                }
                                                labelLine={false}
                                            >
                                                <Cell fill="#00d9ff" />
                                                <Cell fill="#ccc7b6" />
                                            </Pie>
                                            <Tooltip formatter={(value) => `${value}`} />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Pie Chart - Humidity */}
                                <div>
                                    <h3 className="text-md font-semibold text-center mb-2">ความชื้น (Humidity)</h3>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: "Humid", value: selectedFarmData.humidity },
                                                    { name: "Remain", value: 100 - selectedFarmData.humidity },
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={60}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) =>
                                                    `${name} (${(percent * 100).toFixed(0)}%)`
                                                }
                                                labelLine={false}
                                            >
                                                <Cell fill="#fff200" />
                                                <Cell fill="#ccc7b6" />
                                            </Pie>
                                            <Tooltip formatter={(value) => `${value}`} />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* ข้อมูลโรง */}
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-purple-100 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600">ประเภทโรง</p>
                                    <p className="text-lg font-bold text-gray-800">
                                        {selectedFarmData.farm_type}
                                    </p>
                                </div>
                                <div className="bg-indigo-100 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600">สถานะโรง</p>
                                    <p className="text-lg font-bold text-gray-800">
                                        {selectedFarmData.farm_status ? "โรงมีคนใช้งาน" : "โรงไม่มีคนใช้งาน"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showRobotModal && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl relative">
                            {/* ปุ่มปิด */}
                            <button
                                onClick={() => setShowRobotModal(false)}
                                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Close
                            </button>

                            <h2 className="text-xl font-bold text-center mb-6">ข้อมูล Robot และ Pot</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* PieChart - Pot */}
                                <div>
                                    <h3 className="text-md font-semibold text-center mb-2">Pot Status</h3>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: "Safe", value: potSafe },
                                                    { name: "Danger", value: potDanger },
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={60}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) =>
                                                    `${name} (${(percent * 100).toFixed(0)}%)`
                                                }
                                                labelLine={false}
                                            >
                                                <Cell fill="#22c55e" />
                                                <Cell fill="#ef4444" />
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* PieChart - Robot */}
                                <div>
                                    <h3 className="text-md font-semibold text-center mb-2">Robot Status</h3>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: "Active", value: activeDevices },
                                                    { name: "Inactive", value: inactiveDevices },
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={60}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) =>
                                                    `${name} (${(percent * 100).toFixed(0)}%)`
                                                }
                                                labelLine={false}
                                            >
                                                <Cell fill="#22c55e" />
                                                <Cell fill="#ef4444" />
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {showImageModal && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center  justify-center px-4">
                        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">

                            {/* ปุ่มปิด */}
                            <button
                                onClick={() => setShowImageModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                                title="Close"
                            >
                                <XIcon className="w-6 h-6" />
                            </button>


                            {/* ปุ่มควบคุม */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 bg-white px-5 py-2 rounded-full shadow-lg z-10">
                                <button onClick={() => setRotation(rotation - 90)} title="Rotate Left">
                                    <ChevronLeftIcon className="w-5 h-5 text-gray-700 hover:text-blue-600" />
                                </button>
                                <button onClick={() => setRotation(rotation + 90)} title="Rotate Right">
                                    <ChevronRightIcon className="w-5 h-5 text-gray-700 hover:text-blue-600" />
                                </button>
                                <button onClick={() => setScale(scale + 0.2)} title="Zoom In">
                                    <PlusIcon className="w-5 h-5 text-gray-700 hover:text-blue-600" />
                                </button>
                                <button onClick={() => setScale(scale > 0.4 ? scale - 0.2 : 0.2)} title="Zoom Out">
                                    <MinusIcon className="w-5 h-5 text-gray-700 hover:text-blue-600" />
                                </button>
                                <button onClick={handleDownload} title="Download">
                                    <DownloadIcon className="w-5 h-5 text-gray-700 hover:text-green-600" />
                                </button>
                            </div>

                            {/* ภาพ */}
                            <div className="flex items-center justify-center w-full h-full p-4 overflow-auto">
                                {currentImage ? (
                                    <img
                                        src={currentImage}
                                        alt="Preview"
                                        className="transition-transform duration-300 rounded-lg border"
                                        style={{
                                            transform: `rotate(${rotation}deg) scale(${scale})`,
                                            maxHeight: '80vh',
                                            maxWidth: '100%',
                                        }}
                                    />
                                ) : (
                                    <p className="text-gray-500 text-lg">No image available</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>

    );
}

export default HomePage;
