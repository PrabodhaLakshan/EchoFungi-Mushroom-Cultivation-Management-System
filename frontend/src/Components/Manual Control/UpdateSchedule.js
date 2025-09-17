// src/components/Schedule/update.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header/Header";

function UpdateSchedule() {
  const { id } = useParams(); // get schedule id from route
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    batchid: "",
    day: "every",
    stime: "",
    endtime: ""
  });
  const [batches, setBatches] = useState([]);

  // fetch existing schedule
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/sprays/${id}`);
        if (res.data && res.data.spray) {
          setFormData(res.data.spray);
        }
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
      }
    };
    fetchSchedule();
  }, [id]);

  // fetch batches for dropdown
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get("http://localhost:5000/batches");
        setBatches(res.data.batches || []);
      } catch (err) {
        console.error("Error fetching batches:", err);
      }
    };
    fetchBatches();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    if (!formData.batchid || !formData.stime || !formData.endtime) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/sprays/${id}`, formData);
      alert("Schedule updated successfully!");
      navigate("./"); // redirect back to list page
    } catch (err) {
      console.error("Failed to update:", err);
      alert("Update failed. See console.");
    }
  };

  return (
    <div className="p-6">
      <Header />
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span className="text-green-600">✏️</span>
        Update Spray Schedule
      </h2>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Batch
          </label>
          <select
            name="batchid"
            value={formData.batchid}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
          >
            <option value="">-- Select a Batch --</option>
            {Array.isArray(batches) &&
              batches.map((batch) => (
                <option key={batch._id} value={batch.batchid}>
                  Batch {batch.batchid} - {batch.status}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Day
          </label>
          <select
            name="day"
            value={formData.day}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
          >
            <option value="every">Every Day</option>
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Time
          </label>
          <input
            type="time"
            name="stime"
            value={formData.stime}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Time
          </label>
          <input
            type="time"
            name="endtime"
            value={formData.endtime}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 shadow-sm"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 shadow-md"
        >
          Update Schedule
        </button>
      </div>
    </div>
  );
}

export default UpdateSchedule;
