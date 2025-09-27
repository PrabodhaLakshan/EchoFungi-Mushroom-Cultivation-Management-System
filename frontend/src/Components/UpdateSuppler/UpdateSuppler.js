import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SupplyNav from "../SupplyNav/SupplyNav";

function UpdateSupplier() {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch existing supplier
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/suppliers/${id}`);
        if (res.data && res.data.suppliers) {
          setInputs(res.data.suppliers);
        }
      } catch (err) {
        console.error("Error fetching supplier:", err);
      }
    };
    fetchSupplier();
  }, [id]);

  // Change handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only digits for phone number
    if (name === "Phone_number" && !/^\d*$/.test(value)) return;

    setInputs(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validation function
  const validate = () => {
    const newErrors = {};

    // Supplier Name
    if (!inputs.Supplier_name?.trim()) {
      newErrors.Supplier_name = "Supplier name is required.";
    } else if (inputs.Supplier_name.length < 2) {
      newErrors.Supplier_name = "Supplier name must be at least 2 characters.";
    }

    // Phone Number
   const phone = inputs.Phone_number?.toString().trim();
if (!/^0\d{9}$/.test(phone)) {
  newErrors.Phone_number = "Phone number must start with 0 and be exactly 10 digits.";
}


    // Email
    const email = inputs.Email?.trim();
    if (!email) {
      newErrors.Email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.Email = "Invalid email format.";
    }

    // Address
    if (!inputs.Address?.trim()) {
      newErrors.Address = "Address is required.";
    } else if (inputs.Address.length < 5) {
      newErrors.Address = "Address must be at least 5 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await axios.put(`http://localhost:5000/suppliers/${id}`, {
        Supplier_id: inputs.Supplier_id,
        Supplier_name: inputs.Supplier_name,
        Phone_number: inputs.Phone_number,
        Email: inputs.Email,
        Address: inputs.Address
      });

      alert("✅ Supplier updated successfully!"); // Success alert
      navigate("/supplierdetails");
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update supplier. Please try again."); // Error alert
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SupplyNav />

      <div className="flex-1 flex justify-center items-start py-10">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Update Supplier Details</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Supplier ID */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Supplier ID</label>
              <input
                type="text"
                name="Supplier_id"
                value={inputs.Supplier_id || ""}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Supplier Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Supplier Name</label>
              <input
                type="text"
                name="Supplier_name"
                value={inputs.Supplier_name || ""}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.Supplier_name && (
                <p className="text-red-500 text-sm mt-1">{errors.Supplier_name}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
              <input
                type="text"
                name="Phone_number"
                value={inputs.Phone_number || ""}
                onChange={handleChange}
                required
                maxLength="10"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.Phone_number
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
              />
              {errors.Phone_number && (
                <p className="text-red-500 text-sm mt-1">{errors.Phone_number}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="Email"
                value={inputs.Email || ""}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.Email && (
                <p className="text-red-500 text-sm mt-1">{errors.Email}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Address</label>
              <textarea
                name="Address"
                value={inputs.Address || ""}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.Address && (
                <p className="text-red-500 text-sm mt-1">{errors.Address}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
              >
                Update 
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateSupplier;
