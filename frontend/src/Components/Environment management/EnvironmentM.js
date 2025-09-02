import React, { useState } from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import { useEffect } from 'react';
import Emonitoring from '../Monitoring Section/Emonitoring';
import Acontrol from '../Automatic Control/Acontrol';
import Mcontrol from '../Manual Control/Mcontrol';
import EnvironmentH from '../EnvironmentHistory/EnvironmentH';

function EnvironmentM({ temp, humidity, minTemp, maxTemp, dataHistory = [] }) {
  const [activeSection, setActiveSection] = useState('monitoring');
     const [temperatureLevel, setTemperatureLevel] = useState(30); // max temperature
      const [autoSpray, setAutoSpray] = useState(false);
      const [currentTemp, setCurrentTemp] = useState(null);

  const handleSidebarClick = (section) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'monitoring':
        return (
          <Emonitoring 
            temp={temp} 
            humidity={humidity} 
            minTemp={minTemp} 
            maxTemp={maxTemp}
            dataHistory={dataHistory}
          />
        );
      case 'automatic':
        return <Acontrol />;
      case 'manual':
        return <Mcontrol />;
      case 'history':
         return <EnvironmentH />;
        return (
          <Emonitoring 
            temp={temp} 
            humidity={humidity} 
            minTemp={minTemp} 
            maxTemp={maxTemp}
            dataHistory={dataHistory}
          />
        );
      default:
        return (
          <Emonitoring 
            temp={temp} 
            humidity={humidity} 
            minTemp={minTemp} 
            maxTemp={maxTemp}
            dataHistory={dataHistory}
          />
        );
    }
  };
   // Relay control state
   const [relayStatus, setRelayStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to fetch current relay status
  const getRelayStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/iot/status');
      setRelayStatus(response.data.message);
    } catch (error) {
      console.error('Error fetching relay status:', error);
    }
  };

  useEffect(() => {
    getRelayStatus(); // Initial fetch
    const interval = setInterval(getRelayStatus, 3000); // Poll every 3 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Call this when the component is mounted
  useEffect(() => {
    getRelayStatus();
  }, []);

  // Function to turn relay ON or OFF
  const controlRelay = async (status) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/iot/${status}`);
      setRelayStatus(response.data.message);  // Update the relay status
    } catch (error) {
      console.error('Error controlling relay:', error);
    } finally {
      setLoading(false);
    }
  };


  //iot relay control


  // Load existing settings on component mount
      useEffect(() => {
          const loadSettings = async () => {
              try {
                  const res = await axios.get('http://localhost:5000/api/temperatureSetting');
                  if (res.data && res.data.data) {
                      setTemperatureLevel(res.data.data.maxTemp);
                      setAutoSpray(res.data.data.autoMode);
                  }
              } catch (err) {
                  console.error('Failed to load settings:', err);
              }
          };
          loadSettings();
      }, []);
  
      // Handle live data fetch
      useEffect(() => {
          const fetchLiveData = async () => {
              try {
                  const res = await axios.get('http://localhost:5000/iot/stats');
                  if (res.data && res.data.data) {
                      setCurrentTemp(res.data.data.temperature);
                  }
              } catch (err) {
                  console.error('Failed to fetch live data:', err);
              }
          };
          fetchLiveData(); // initial fetch
          const interval = setInterval(fetchLiveData, 5000); // every 5 sec
          return () => clearInterval(interval);
      }, []);
  
  
      // Relay control logic - poll every 5 seconds
      useEffect(() => {
          if (!autoSpray || currentTemp === null || temperatureLevel === null) return;
  
          const controlRelay = async () => {
              if (currentTemp >= temperatureLevel) {
                  try {
                      await axios.get(`http://localhost:5000/iot/sprayOn`);
                      await axios.get(`http://localhost:5000/iot/buzzerOn`);
                  } catch (error) {
                      console.error('Error controlling relay:', error);
                  }
              } else {
                  try {
                      await axios.get(`http://localhost:5000/iot/sprayOff`);
                      await axios.get(`http://localhost:5000/iot/buzzerOff`);
                  } catch (error) {
                      console.error('Error controlling relay:', error);
                  }
              }
          };
  
          controlRelay(); // initial call
          
      }, [currentTemp, temperatureLevel, autoSpray]);





  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-50">
      <Header />
      
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Environment Management
            </h2>
            
            {/* Sidebar Navigation Items */}
            <nav className="space-y-2">
              <button
                onClick={() => handleSidebarClick('monitoring')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeSection === 'monitoring'
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeSection === 'monitoring' ? 'bg-blue-200' : 'bg-blue-100'
                }`}>
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="font-medium">Environment Monitoring</span>
              </button>

              <button
                onClick={() => handleSidebarClick('automatic')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeSection === 'automatic'
                    ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeSection === 'automatic' ? 'bg-green-200' : 'bg-green-100'
                }`}>
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-medium">Automatic Control</span>
              </button>

              <button
                onClick={() => handleSidebarClick('manual')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeSection === 'manual'
                    ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeSection === 'manual' ? 'bg-purple-200' : 'bg-purple-100'
                }`}>
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <span className="font-medium">Manual Control</span>
              </button>
            </nav>


            <button
                onClick={() => handleSidebarClick('history')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeSection === 'history'
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeSection === 'history' ? 'bg-blue-200' : 'bg-blue-100'
                }`}>
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="font-medium">Environment History</span>
              </button>

            {/* Relay status */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
               <div>
                  <h2>Relay Status: {loading ? 'Loading...' : relayStatus}</h2>
                  <button onClick={() => controlRelay('sprayOn')} disabled={loading}>
                    Turn ON Relay
                  </button>
                  <button onClick={() => controlRelay('sprayOff')} disabled={loading}>
                    Turn OFF Relay
                  </button>
                </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default EnvironmentM;