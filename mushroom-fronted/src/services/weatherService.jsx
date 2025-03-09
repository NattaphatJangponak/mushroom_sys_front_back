import axios from 'axios';

const getWeatherData = async ({ lat, lon }) => {
    try {
        const apiKey = 'e13e248ba58a789dbfacad81dd150a7e'; // ตรวจสอบ API Key
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        const response = await axios.get(url, {
            withCredentials: false // ป้องกันปัญหา CORS
        });

        if (response.data && response.data.list) {
            return response.data;
        } else {
            throw new Error("Invalid API response - Missing data");
        }
    } catch (error) {
        console.error('Error fetching weather data:', error.message);

        if (error.response) {
            console.error("Response Data:", error.response.data);
            console.error("Response Status:", error.response.status);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Request error:", error.message);
        }

        return null; // ป้องกัน error ใน HomePage.jsx
    }
};

export { getWeatherData };
