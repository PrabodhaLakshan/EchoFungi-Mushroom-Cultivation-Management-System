import React, { useState, useEffect } from 'react';

import LineChart from '../Line Chart/LineChart' // Make sure path is correct
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';


function Emonitoring() {
const [temp, setTemp] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [minTemp, setMinTemp] = useState(null);
  const [maxTemp, setMaxTemp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    const fetchIoTData = async () => {
      try {
        console.log('🔄 Fetching IoT data from secure backend...');
        
        // Fetch data from secure backend endpoint (which calls Blynk internally)
        const response = await fetch('http://localhost:5000/iot/getLatest');
        const result = await response.json();
        
        if (response.ok && result.temperature !== undefined && result.humidity !== undefined) {
          console.log('✅ IoT data received:', result);
          
          const { temperature, humidity, timestamp } = result;
          
          setTemp(temperature);
          setHumidity(humidity);

          // Update min/max values
          setMinTemp((prevMin) =>
            prevMin === null || temperature < prevMin ? temperature : prevMin
          );

          setMaxTemp((prevMax) =>
            prevMax === null || temperature > prevMax ? temperature : prevMax
          );
          setLoading(false);
        } else {
          console.error('❌ Failed to fetch IoT data:', result.error);
          setError(result.error || 'Failed to fetch IoT data');
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Error fetching IoT data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchIoTData();
    const intervalId = setInterval(fetchIoTData, 5000); // Fetch every 5 seconds
    
    return () => clearInterval(intervalId);
  }, []);

// Add missing state variables
const [schedules, setSchedules] = useState([]);
const [formData, setFormData] = useState({
  day: 'every',
  start: '',
  end: ''
});

// IoT data state for independent fetching
const [iotData, setIotData] = useState({
  temperature: null,
  humidity: null,
  minTemp: null,
  maxTemp: null,
  minHumidity: null,
  maxHumidity: null,
  timestamp: null
});
const [iotLoading, setIotLoading] = useState(true);
const [lastUpdate, setLastUpdate] = useState(null);

// Display variables will be calculated inside the render function for real-time updates





// Fetch IoT data independently
useEffect(() => {
  const fetchIoTData = async () => {
    try {
      setIotLoading(true);
      console.log("🔄 Fetching IoT data from /iot/stats...");
      
      const response = await axios.get("http://localhost:5000/iot/stats");
      console.log("📡 IoT API Response:", response.data);
      
      if (response.data.data) {
        const data = response.data.data;
        console.log("📊 Parsed IoT data:", data);
        
        setIotData({
          temperature: data.temperature,
          humidity: data.humidity,
          minTemp: data.minTemp,
          maxTemp: data.maxTemp,
          minHumidity: data.minHumidity,
          maxHumidity: data.maxHumidity,
          timestamp: data.timestamp
        });
        setLastUpdate(new Date());
        console.log("✅ IoT data updated successfully");
      } else {
        console.log("⚠️ No data in response");
      }
    } catch (error) {
      console.error("❌ Failed to fetch IoT data:", error);
      // Keep previous data on error, don't clear it
    } finally {
      setIotLoading(false);
    }
  };

  // Fetch immediately
  fetchIoTData();
  
  // Set up interval to fetch IoT data every 5 seconds
  const intervalId = setInterval(fetchIoTData, 5000);
  
  return () => clearInterval(intervalId);
}, []);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

// Helper function to safely format temperature values
const formatTemperature = (value) => {
  if (value !== null && value !== undefined && typeof value === 'number') {
    return `${value.toFixed(2)} °C`;
  }
  return "Loading...";
};

// Helper function to safely format humidity values
const formatHumidity = (value) => {
  if (value !== null && value !== undefined && typeof value === 'number') {
    return `${value.toFixed(2)}%`;
  }
  return "Loading...";
};

// Manual refresh function
const handleManualRefresh = async () => {
  try {
    setIotLoading(true);
    const response = await axios.get("http://localhost:5000/iot/stats");
    if (response.data.data) {
      const data = response.data.data;
      setIotData({
        temperature: data.temperature,
        humidity: data.humidity,
        minTemp: data.minTemp,
        maxTemp: data.maxTemp,
        minHumidity: data.minHumidity,
        maxHumidity: data.maxHumidity,
        timestamp: data.timestamp
      });
      setLastUpdate(new Date());
    }
  } catch (error) {
    console.error('Manual refresh failed:', error);
  } finally {
    setIotLoading(false);
  }
};

  return (
       <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-50">
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-8 mb-12 border border-gray-100">
            
            {/* Temp & Humidity Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center gap-2">
                    <span className="text-green-600">🌱</span>
                    Plantation Conditions
                </h2>
                
                {/* Real-time update indicator */}
                <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-700">Live Data</span>
                        <span className="text-xs text-gray-500">Last update: {lastUpdate ? lastUpdate.toLocaleTimeString() : '—'}</span>
                    </div>
                    <button onClick={handleManualRefresh} className="ml-4 px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200">
                        🔄 Refresh
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🌡️</span>
                            <div>
                                <p className="text-sm text-gray-600">Plantain Temperature</p>
                                <p className="text-2xl font-bold text-orange-600">{formatTemperature(iotData.temperature)}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">💧</span>
                            <div>
                                <p className="text-sm text-gray-600">Plantain Humidity</p>
                                <p className="text-2xl font-bold text-blue-600">{formatHumidity(iotData.humidity)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Min/Max Statistics */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-200 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-lg">🔥</span>
                            <p className="text-red-700 font-medium">Max Temp</p>
                        </div>
                        <p className="text-xl font-bold text-red-600">{formatTemperature(iotData.maxTemp)}</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-lg">💦</span>
                            <p className="text-blue-700 font-medium">Max Humidity</p>
                        </div>
                        <p className="text-xl font-bold text-blue-600">{formatHumidity(iotData.maxHumidity)}</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-200 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-lg">❄️</span>
                            <p className="text-cyan-700 font-medium">Min Temp</p>
                        </div>
                        <p className="text-xl font-bold text-cyan-600">{formatTemperature(iotData.minTemp)}</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-200 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-lg">💧</span>
                            <p className="text-teal-700 font-medium">Min Humidity</p>
                        </div>
                        <p className="text-xl font-bold text-teal-600">{formatHumidity(iotData.minHumidity)}</p>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6 shadow-inner mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Environmental Monitoring</h3>
                    
                    <div className="flex justify-center gap-8 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></span>
                            <span className="font-medium text-gray-700">Temperature</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></span>
                            <span className="font-medium text-gray-700">Humidity</span>
                        </div>
                    </div>

                   
                        <LineChart temp={iotData.temperature} humidity={iotData.humidity} />
                    
                </div>

               
            </div>
        </div>
    </div>
    )
  }

export default Emonitoring
