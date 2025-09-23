import React, { useState, useEffect } from "react";
import { useReactToPrint } from 'react-to-print';
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function EnvironmentH() {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/iot/history", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (data && Array.isArray(data.data)) {
        setHistory(data.data);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error(err);
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const ComponentsRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => document.getElementById('divToPrint'),
    documentTitle: 'Environment History',
    onAfterPrint: () => alert('Print success')
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Environment History", 14, 22);

    const tableColumn = ["Date", "Max Temp (°C)", "Min Temp (°C)", "Max Humidity (%)", "Min Humidity (%)"];
    const tableRows = history.map(item => [
      item.date ? new Date(item.date).toLocaleDateString() : "N/A",
      item.maxTemp ?? "N/A",
      item.minTemp ?? "N/A",
      item.maxHumidity ?? "N/A",
      item.minHumidity ?? "N/A"
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30, theme: 'grid' });

    doc.save("Environment_History.pdf");
  };

  return (
    <div className="p-4">
      <div id="divToPrint" ref={ComponentsRef} style={{width:'100%'}}>
        <h1 className="text-2xl font-bold mb-4 text-center">Environment History</h1>

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
              {history.length > 0 ? history.map((item, idx) => (
                <tr key={item._id || idx} className="text-center hover:bg-gray-100">
                  <td className="px-4 py-2 border">{item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</td>
                  <td className="px-4 py-2 border">{item.maxTemp ?? "N/A"}</td>
                  <td className="px-4 py-2 border">{item.minTemp ?? "N/A"}</td>
                  <td className="px-4 py-2 border">{item.maxHumidity ?? "N/A"}</td>
                  <td className="px-4 py-2 border">{item.minHumidity ?? "N/A"}</td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="text-center py-4">No history available</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex gap-4 mt-4">
          <button onClick={handlePrint} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Print PDF</button>
          <button onClick={handleDownloadPDF} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Download PDF</button>
        </div>
      </div>
    </div>
  );
}

export default EnvironmentH;
