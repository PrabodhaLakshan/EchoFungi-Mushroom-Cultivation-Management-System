import React, { useState, useEffect } from 'react';
import InventoryNav from "../InventoryNav/InventoryNav";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddInventory() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    Item_code: "",
    Category: "",
    Item_name: "",
    Quantity: "",
    Unit: "",
    Received_date: "",
    Expired_date: "",
    Reorder_level: "",
    Description: "",
    Purchase_id: "",
  });

  const [errors, setErrors] = useState({});
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get("http://localhost:5000/purchases");
        if (Array.isArray(res.data.purchases)) {
          setPurchases(res.data.purchases);
        }
      } catch (err) {
        console.error("Error fetching purchases:", err);
      }
    };
    fetchPurchases();
  }, []);

  // ✅ Handle input change with real-time error clearing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error for the specific field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // ✅ Form validation
  const validate = () => {
    const newErrors = {};

    if (!inputs.Category) newErrors.Category = "Category is required.";

    if (!inputs.Item_name?.trim()) {
      newErrors.Item_name = "Item name is required.";
    } else if (inputs.Item_name.length < 2) {
      newErrors.Item_name = "Item name must be at least 2 characters.";
    }

    if (inputs.Quantity === "") {
      newErrors.Quantity = "Quantity is required.";
    } else if (Number(inputs.Quantity) < 0) {
      newErrors.Quantity = "Quantity cannot be negative.";
    } else if (Number(inputs.Quantity) > 100) {
      newErrors.Quantity = "Quantity cannot exceed 100.";
    }

    if (!inputs.Unit?.trim()) newErrors.Unit = "Unit is required.";

    if (!inputs.Received_date) {
      newErrors.Received_date = "Received date is required.";
    } else if (new Date(inputs.Received_date) > new Date()) {
      newErrors.Received_date = "Received date cannot be in the future.";
    }

    if (inputs.Expired_date) {
      if (
        inputs.Received_date &&
        new Date(inputs.Expired_date) < new Date(inputs.Received_date)
      ) {
        newErrors.Expired_date = "Expired date cannot be before received date.";
      }
    }

    if (inputs.Reorder_level === "") {
      newErrors.Reorder_level = "Reorder level is required.";
    } else if (Number(inputs.Reorder_level) < 0) {
      newErrors.Reorder_level = "Reorder level cannot be negative.";
    }

    if (!inputs.Purchase_id) {
      newErrors.Purchase_id = "Purchase ID is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post("http://localhost:5000/items", {
        Category: String(inputs.Category),
        Item_name: String(inputs.Item_name),
        Quantity: Number(inputs.Quantity),
        Unit: String(inputs.Unit),
        Received_date: new Date(inputs.Received_date),
        Expired_date: inputs.Expired_date ? new Date(inputs.Expired_date) : null,
        Reorder_level: Number(inputs.Reorder_level),
        Description: String(inputs.Description),
        Purchase_id: String(inputs.Purchase_id),
      });

      const codeNumber = res.data.Item_code;
      const formattedCode = "ITEM" + String(codeNumber).padStart(3, "0");
      setInputs((prev) => ({ ...prev, Item_code: formattedCode }));

      alert("✅ Item added successfully!");
      navigate("/itemdetails");
    } catch (err) {
      console.error("Error adding item:", err);
      alert("❌ Failed to add item. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <InventoryNav />

      <div className="flex-grow flex justify-center items-center py-8 px-4">
        <div className="w-full max-w-xl bg-white p-8 rounded shadow">
          <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Add Inventory Item
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Item Code */}
            <div>
              <label className="block font-medium text-gray-700">Item Code</label>
              <input
                type="text"
                name="Item_code"
                value={inputs.Item_code || "Auto-generated"}
                readOnly
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-medium text-gray-700">Category</label>
              <select
                name="Category"
                value={inputs.Category}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="">-- Select Category --</option>
                <option value="Raw Material">Raw Material</option>
                <option value="Spores/Spawn">Spores/Spawn</option>
                <option value="Packaging">Packaging</option>
                <option value="Others">Others</option>
              </select>
              {errors.Category && <p className="text-red-500 text-sm mt-1">{errors.Category}</p>}
            </div>

            {/* Item Name */}
            <div>
              <label className="block font-medium text-gray-700">Item Name</label>
              <input
                type="text"
                name="Item_name"
                value={inputs.Item_name}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded"
              />
              {errors.Item_name && <p className="text-red-500 text-sm mt-1">{errors.Item_name}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="Quantity"
                value={inputs.Quantity}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded"
              />
              {errors.Quantity && <p className="text-red-500 text-sm mt-1">{errors.Quantity}</p>}
            </div>

            {/* Unit */}
            <div>
              <label className="block font-medium text-gray-700">Unit</label>
              <input
                type="text"
                name="Unit"
                value={inputs.Unit}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded"
              />
              {errors.Unit && <p className="text-red-500 text-sm mt-1">{errors.Unit}</p>}
            </div>

            {/* Received Date */}
            <div>
              <label className="block font-medium text-gray-700">Received Date</label>
              <input
                type="date"
                name="Received_date"
                value={inputs.Received_date}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded"
              />
              {errors.Received_date && <p className="text-red-500 text-sm mt-1">{errors.Received_date}</p>}
            </div>

            {/* Expired Date */}
            <div>
              <label className="block font-medium text-gray-700">Expired Date</label>
              <input
                type="date"
                name="Expired_date"
                value={inputs.Expired_date}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded"
              />
              {errors.Expired_date && <p className="text-red-500 text-sm mt-1">{errors.Expired_date}</p>}
            </div>

            {/* Reorder Level */}
            <div>
              <label className="block font-medium text-gray-700">Reorder Level</label>
              <input
                type="number"
                name="Reorder_level"
                value={inputs.Reorder_level}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded"
              />
              {errors.Reorder_level && <p className="text-red-500 text-sm mt-1">{errors.Reorder_level}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium text-gray-700">Description</label>
              <textarea
                name="Description"
                value={inputs.Description}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded"
              ></textarea>
            </div>

            {/* Purchase ID */}
            <div>
              <label className="block font-medium text-gray-700">Purchase ID</label>
              <select
                name="Purchase_id"
                value={inputs.Purchase_id}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="">Select Purchase ID</option>
                {Array.isArray(purchases) &&
                  purchases.map((purchase) => (
                    <option key={purchase.Purchase_id} value={purchase.Purchase_id}>
                      {purchase.Purchase_id}
                    </option>
                  ))}
              </select>
              {errors.Purchase_id && <p className="text-red-500 text-sm mt-1">{errors.Purchase_id}</p>}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
              >
                Submit
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddInventory;
