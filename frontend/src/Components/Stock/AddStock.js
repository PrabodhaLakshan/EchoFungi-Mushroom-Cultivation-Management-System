import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddStock() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    ManufactureDate: "",
    MushroomType: "",
    ExpireDate: "",
    Unit: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history("/Stock"));
  };

  const sendRequest = async () => {
    const res = await axios.post("http://localhost:5000/Stock", {
      ManufactureDate:new Date(inputs.ManufactureDate),
      MushroomType: String(inputs.MushroomType),
      ExpireDate: new Date(inputs.ExpireDate),
      Unit: String(inputs.Unit),
    });
    return res.data;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 border border-green-100"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-green-800 text-center mb-6">
          Add New Stock
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
            className="flex-1 bg-gray-100 text-green-800 border border-green-200 font-bold py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddStock;
