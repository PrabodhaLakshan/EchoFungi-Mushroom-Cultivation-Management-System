import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    ProductName: "",
    MushroomType: "",
    UnitPrice: "",
    Status: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product data by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/Product/${id}`);
        const productData = res.data.product;

        if (!productData) {
          setError("Product data not found");
          setLoading(false);
          return;
        }
        setInputs(productData);
        setOriginalData(productData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product data");
        setLoading(false);
      }
    };

    fetchProduct();
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
      const res = await axios.put(
        `http://localhost:5000/Product/${id}`,
        inputs
      );
      return res.data;
    } catch (err) {
      console.error("Error updating Product:", err);
      setError("Failed to update Product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendRequest();
    navigate("/Product");
  };

  if (loading) return <p className="text-gray-600">Loading product data...</p>;
  if (error)
    return <p className="text-red-500 font-semibold">{error}</p>;
  if (!inputs) return null;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-green-800 text-center mb-6">
        Update Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-green-700 font-semibold mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="ProductName"
            value={inputs.ProductName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div>
          <label className="block text-green-700 font-semibold mb-1">
            Mushroom Type
          </label>
          <input
            type="text"
            name="MushroomType"
            value={inputs.MushroomType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div>
          <label className="block text-green-700 font-semibold mb-1">
            Unit Price
          </label>
          <input
            type="number"
            name="UnitPrice"
            value={inputs.UnitPrice}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div>
          <label className="block text-green-700 font-semibold mb-1">
            Status
          </label>
          <select
            name="Status"
            value={inputs.Status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          >
            <option value="">-- Select Status --</option>
            <option value="Active">Available</option>
            <option value="Inactive">Unavailable</option>
          </select>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="flex-1 py-2 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 transition"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProduct;
