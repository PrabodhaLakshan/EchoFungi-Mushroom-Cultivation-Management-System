import React, { useState, useEffect } from "react";

import axios from "axios";

function EnvironmentH() {
  const [history, setHistory] = useState([]);

 const fetchHistory = async () => {
  try {
    const response = await axios.get("http://localhost:5000/iot/history",{
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    console.log("API raw response:", response.data);

    // ✅ Extract the real array
    if (response.data && Array.isArray(response.data.data)) {
      setHistory(response.data.data);
      console.log("Extracted history:", response.data.data);
    } else {
      setHistory([]);
    }
  } catch (error) {
    console.error("Failed to load history:", error);
    setHistory([]);
  }
};


  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-4">
      
      <h1 className="text-2xl font-bold mb-4 text-center">
        Environment History
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Max Temp (°C)</th>
              <th className="px-4 py-2 border">Min Temp (°C)</th>
              <th className="px-4 py-2 border">Max Humidity (%)</th>
              <th className="px-4 py-2 border">Min Humidity (%)</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((item, index) => (
                <tr
                  key={item._id || index}
                  className="text-center hover:bg-gray-100"
                >
                  <td className="px-4 py-2 border">
                    {item.date
                      ? new Date(item.date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 border">{item.maxTemp ?? "N/A"}</td>
                  <td className="px-4 py-2 border">{item.minTemp ?? "N/A"}</td>
                  <td className="px-4 py-2 border">
                    {item.maxHumidity ?? "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.minHumidity ?? "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No history available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EnvironmentH;
