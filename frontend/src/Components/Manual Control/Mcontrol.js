import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  

function Mcontrol() {
  const [schedules, setSchedules] = useState([]); // will be filled from DB
  const [formData, setFormData] = useState({
    day: 'every',
    start: '',
    end: ''
  });
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const navigate = useNavigate();

  // Fetch schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get("http://localhost:5000/sprays");
        setSchedules(response.data.sprays); 
      } catch (error) {
        console.error("Failed to load schedules:", error);
      }
    };

    fetchSchedules();
    const intervalId = setInterval(fetchSchedules, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get("http://localhost:5000/batches");
        setBatches(res.data.batches);
      } catch (err) {
        console.error("Error fetching batches:", err);
        setBatches([]);
      }
    };
    fetchBatches();
  }, []);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  //  Updated with validations 
  const handleAddSchedule = async () => {
    if (!selectedBatch) {
      alert("Please select a batch!");
      return;
    }

    const { start, end, day } = formData;

    // Validation: required fields
    if (!start || !end) {
      alert("Please fill start and end time.");
      return;
    }

    // Validation: end > start
    if (end <= start) {
      alert("End time must be later than start time.");
      return;
    }

    // Validation: max 2 hours
    const startDate = new Date(`1970-01-01T${start}:00`);
    const endDate = new Date(`1970-01-01T${end}:00`);
    const diffMinutes = (endDate - startDate) / (1000 * 60);
    if (diffMinutes > 120) {
      alert("Spray duration cannot exceed 2 hours.");
      return;
    }

    const newSchedule = {
      batchid: selectedBatch,
      day: day === 'every' ? 'Every Day' : day.charAt(0).toUpperCase() + day.slice(1),
      stime: start,
      endtime: end
    };

    try {
      const response = await axios.post("http://localhost:5000/sprays", newSchedule);

      // Add returned object from DB
      setSchedules([...schedules, response.data.sprays || response.data]);

      // Reset form
      setFormData({ day: 'every', start: '', end: '' });
      setSelectedBatch("");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message); // backend duplicate/validation error
      } else {
        console.error("Failed to add schedule:", error);
        alert("Failed to add schedule. See console for details.");
      }
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/sprays/${id}`);
      setSchedules(prev => prev.filter(schedule => schedule._id !== id));
    } catch (error) {
      console.error("Failed to delete schedule:", error);
    }
  };

  const formatTime = (time) => {
    if (!time || typeof time !== 'string' || !time.includes(':')) return '--:--';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div>
      {/* Add Water Spray Schedule */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">💦</span>
          Add Water Spray Schedule
        </h2>
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

            {/* Batch Select - Fixed Styles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
              <select
                id="batch"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
              >
                <option value="">-- Select a Batch --</option>
                {Array.isArray(batches) && batches.map(batch => (
                  <option key={batch._id} value={batch.batchid}>
                    Batch {batch.batchid} - {batch.status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Day</label>
              <select 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm" 
                name="day"
                value={formData.day}
                onChange={handleFormChange}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input 
                type="time" 
                name="start" 
                value={formData.start}
                onChange={handleFormChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input 
                type="time" 
                name="end" 
                value={formData.end}
                onChange={handleFormChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm" 
              />
            </div>
          </div>
          
          <button 
            onClick={handleAddSchedule}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Add Schedule
          </button>
        </div>
      </div>

      {/* Scheduled List */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <span className="text-purple-600">📅</span>
          Scheduled List
        </h3>

        <div className="space-y-3">
          {schedules.map((schedule) => (
            <div
              key={schedule._id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 font-medium">📍</span>
                  <span className="font-medium text-gray-700">batchid = {schedule.batchid}</span>
                  <span className="font-medium text-gray-700">{schedule.day}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 font-medium">🕐</span>
                  <span className="text-gray-600">
                    {formatTime(schedule.stime)} to {formatTime(schedule.endtime)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                  onClick={() => navigate(`/update/${schedule._id}`)}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteSchedule(schedule._id)}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Mcontrol;
