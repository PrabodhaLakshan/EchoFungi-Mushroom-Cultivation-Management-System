import React, { useEffect, useState } from "react";
import BatchNav from "../BatchNav/BatchNav";
import Header from "../Header/Header"; 
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

const URL = "http://localhost:5000/batches";

const Home = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL);
      const dataArray = Array.isArray(response.data)
        ? response.data
        : response.data.batches;

      setBatches(
        dataArray.map((batch) => ({
          ...batch,
          remainingQuantity: batch.quantity - batch.removedQuantity,
        }))
      );
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const formatXAxis = (tick) => {
    return tick.slice(-5); // show last 5 characters of _id for readability
  };

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const batch = payload[0].payload;
      return (
        <div className="bg-white border shadow-md p-3 rounded-lg">
          <p className="font-bold text-gray-700">Batch ID: {batch._id}</p>
          <p>Create Date: {new Date(batch.createDate).toLocaleDateString()}</p>
          <p>Expire Date: {new Date(batch.expireDate).toLocaleDateString()}</p>
          <p>Status: {batch.status}</p>
          <p>Quantity: {batch.quantity}</p>
          <p>Removed: {batch.removedQuantity}</p>
          <p>Remaining: {batch.remainingQuantity}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/*  Sidebar fixed on left */}
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-md z-40">
        <BatchNav />
      </div>

      {/*  Header fixed on top, only over main content */}
      <div className="fixed top-0 left-64 right-0 z-50">
        <Header />
      </div>

      {/*  Main Content */}
      <div className="ml-64 pt-20 p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Batch Details (Bar Graph)
        </h1>

        {loading ? (
          <p>Loading batch data...</p>
        ) : batches.length === 0 ? (
          <p>No batch data available.</p>
        ) : (
          <div className="w-full max-w-6xl h-[500px] bg-white shadow-lg rounded-lg p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={batches}
                margin={{ top: 30, right: 30, left: 20, bottom: 50 }}
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="_id"
                  tickFormatter={formatXAxis}
                  angle={-30}
                  textAnchor="end"
                >
                  <Label
                    value="Batch ID"
                    offset={-40}
                    position="insideBottom"
                  />
                </XAxis>
                <YAxis>
                  <Label value="Quantity" angle={-90} position="insideLeft" />
                </YAxis>
                <Tooltip content={customTooltip} />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="quantity"
                  fill="#1d4ed8"
                  radius={[5, 5, 0, 0]}
                  name="Quantity"
                />
                <Bar
                  dataKey="removedQuantity"
                  fill="#dc2626"
                  radius={[5, 5, 0, 0]}
                  name="Removed"
                />
                <Bar
                  dataKey="remainingQuantity"
                  fill="#16a34a"
                  radius={[5, 5, 0, 0]}
                  name="Remaining"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
