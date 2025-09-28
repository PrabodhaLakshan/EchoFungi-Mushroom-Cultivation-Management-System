import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddProduct() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    ProductName: "",
    MushroomType: "",
    UnitPrice: "",
    Status: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history("/Product"));
  };

  const sendRequest = async () => {
    const res = await axios.post("http://localhost:5000/Product", {
      ProductName: String(inputs.ProductName),
      MushroomType: String(inputs.MushroomType),
      UnitPrice: parseFloat(inputs.UnitPrice).toFixed(2),
      Status: String(inputs.Status),
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
          Add New Product
        </h2>

      
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="ProductName"
            onChange={handleChange}
            value={inputs.ProductName}
            required
            className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        
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

        
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-2">
            Unit Price
          </label>
          <input
            type="number"
            name="UnitPrice"
            onChange={handleChange}
            value={inputs.UnitPrice}
            step="0.01"
            min="0"
            required
            className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        
        <div className="mb-6">
          <label className="block text-green-700 font-semibold mb-2">
            Status
          </label>
          <select
            id="Status"
            name="Status"
            onChange={handleChange}
            value={inputs.Status}
            required
            className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          >
            <option value="">-- Select Status --</option>
            <option value="Active">Available</option>
            <option value="Inactive">Unavailable</option>
          </select>
        </div>

        
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

export default AddProduct;
