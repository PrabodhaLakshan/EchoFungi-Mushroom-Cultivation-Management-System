import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    ShopName: "",
    OwnerName: "",
    Email: "",
    PhoneNo: "",
    City: "",
    Status: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product data
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/Customer/${id}`);
        const customerData = res.data.customer;

        if (!customerData) {
          setError("Customer data not found");
          setLoading(false);
          return;
        }
        setInputs(customerData);
        setOriginalData(customerData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching Customer:", err);
        setError("Failed to load Customer data");
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    if (originalData) setInputs(originalData);
  };

  const sendRequest = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/Customer/${id}`,
        inputs
      );
      return res.data;
    } catch (err) {
      console.error("Error updating Customer:", err);
      setError("Failed to update Customer");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendRequest();
    navigate("/Customer");
  };

  if (loading) return <p>Loading Customer data...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!inputs) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-green-800 text-center mb-6">
          Update Customer Details
        </h2>

        {/* Shop Name */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Shop Name
          </label>
          <input
            type="text"
            name="ShopName"
            onChange={handleChange}
            value={inputs.ShopName}
            required
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        {/* Owner Name */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Owner Name
          </label>
          <input
            type="text"
            name="OwnerName"
            onChange={handleChange}
            value={inputs.OwnerName}
            required
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Email
          </label>
          <input
            type="email"
            name="Email"
            onChange={handleChange}
            value={inputs.Email}
            required
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        {/* Phone No */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Phone No
          </label>
          <input
            type="tel"
            name="PhoneNo"
            placeholder="07X-XXXXXXX"
            onChange={handleChange}
            value={inputs.PhoneNo}
            required
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        {/* City */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Address
          </label>
          <input
            type="text"
            name="City"
            onChange={handleChange}
            value={inputs.City}
            required
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">
            Status
          </label>
          <select
            id="Status"
            name="Status"
            onChange={handleChange}
            value={inputs.Status}
            required
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          >
            <option value="">-- Select Status --</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
          >
            Submit
          </button>
          <button
            type="reset"
             onClick={handleReset}
            className="flex-1 border border-green-400 bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateCustomer;
