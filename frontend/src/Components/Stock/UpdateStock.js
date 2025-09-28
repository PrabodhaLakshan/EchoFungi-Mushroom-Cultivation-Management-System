import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateStock() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    ManufactureDate: "",
    MushroomType: "",
    ExpireDate: "",
    Unit: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stock data by ID
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/Stock/${id}`);
        const stockData = res.data.stock;

        if (!stockData) {
          setError("Stock data not found");
          setLoading(false);
          return;
        }
        setInputs(stockData);
        setOriginalData(stockData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stock:", err);
        setError("Failed to load stock data");
        setLoading(false);
      }
    };

    fetchStock();
  }, [id]);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    if (originalData) {
      setInputs(originalData);
    }
  };

  const sendRequest = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/Stock/${id}`,
        inputs
      );
      return res.data;
    } catch (err) {
      console.error("Error updating Stock:", err);
      setError("Failed to update Stock");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendRequest();
    navigate("/Stock");
  };

  if (loading) return <p className="text-gray-600">Loading Stock data...</p>;
  if (error)
    return <p className="text-red-500 font-semibold">{error}</p>;
  if (!inputs) return null;

  return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 border border-green-100"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-green-800 text-center mb-6">
          Update Stock
        </h2>

        {/* ManufactureDate */}
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-2">
            Manufacture Date
          </label>
          <input
            type="date"
            name="ManufactureDate"
            onChange={handleChange}
            value={inputs.ManufactureDate}
            required
            className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        {/* Mushroom Type */}
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-2">
            Mushroom Type
          </label>
          <input
            type="text"
            name="MushroomType"
            onChange={handleChange}
            value={inputs.MushroomType}
            required
            className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        {/* ExpireDate */}
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-2">
            Expire Date
          </label>
          <input
            type="date"
            name="ExpireDate"
            onChange={handleChange}
            value={inputs.ExpireDate}
            required
            className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        {/* Unit */}
         <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-2">
            Number Of Packets
          </label>
          <input
            type="number"
            name="Unit"
            onChange={handleChange}
            value={inputs.Unit}
            required
            className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-green-700 text-white font-bold py-2 rounded-lg shadow hover:bg-green-800 transition"
          >
            Submit
          </button>
          <button
            type="reset"
            onClick={handleReset}
            className="flex-1 bg-gray-100 text-green-800 border border-green-200 font-bold py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}


export default UpdateStock;
