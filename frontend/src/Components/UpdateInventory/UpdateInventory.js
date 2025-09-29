import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import InventoryNav from "../InventoryNav/InventoryNav";

function UpdateInventory() {
  const [inputs, setInputs] = useState({});
  const [purchases, setPurchases] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch item details
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/items/${id}`);
        if (res.data && res.data.items) {
          setInputs(res.data.items);
        }
      } catch (err) {
        console.error("Error fetching item data:", err);
      }
    };
    fetchHandler();
  }, [id]);

  // Fetch purchase IDs
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

  // Validation logic
  const validate = () => {
    const newErrors = {};

    if (!inputs.Category) newErrors.Category = "Category is required.";

    if (!inputs.Item_name?.trim()) {
      newErrors.Item_name = "Item name is required.";
    } else if (inputs.Item_name.length < 2) {
      newErrors.Item_name = "Item name must be at least 2 characters.";
    }

    if (inputs.Quantity === "" || inputs.Quantity === undefined) {
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

    if (inputs.Reorder_level === "" || inputs.Reorder_level === undefined) {
      newErrors.Reorder_level = "Reorder level is required.";
    } else if (Number(inputs.Reorder_level) < 0) {
      newErrors.Reorder_level = "Reorder level cannot be negative.";
    }

    if (!inputs.Purchase_id) newErrors.Purchase_id = "Purchase ID is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Update item
  const sendRequest = async () => {
    try {
      await axios.put(`http://localhost:5000/items/${id}`, {
        Item_code: inputs.Item_code,
        Category: inputs.Category,
        Item_name: inputs.Item_name,
        Quantity: Number(inputs.Quantity),
        Unit: inputs.Unit,
        Received_date: inputs.Received_date,
        Expired_date: inputs.Expired_date,
        Reorder_level: Number(inputs.Reorder_level),
        Description: inputs.Description,
        Purchase_id: inputs.Purchase_id,
      });
      alert("✅ Inventory item updated successfully!");
      navigate("/itemdetails");
    } catch (err) {
      console.error("Error updating item:", err);
      alert("❌ Failed to update item. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) sendRequest();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <InventoryNav />
      <div className="flex-1 flex justify-center items-start py-10">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Update Inventory Item
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Item Code */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Item Code</label>
              <input
                type="text"
                name="Item_code"
                value={inputs.Item_code || ""}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Category</label>
              <select
                name="Category"
                value={inputs.Category || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">-- Select Category --</option>
                <option value="Raw Material">Raw Material</option>
                <option value="Spores/Spawn">Spores/Spawn</option>
                <option value="Packaging">Packaging</option>
                <option value="Others">Others</option>
              </select>
              {errors.Category && <p className="text-red-500 text-sm">{errors.Category}</p>}
            </div>

            {/* Item Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Item Name</label>
              <input
                type="text"
                name="Item_name"
                value={inputs.Item_name || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
              {errors.Item_name && <p className="text-red-500 text-sm">{errors.Item_name}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Quantity</label>
              <input
                type="number"
                name="Quantity"
                value={inputs.Quantity || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
              {errors.Quantity && <p className="text-red-500 text-sm">{errors.Quantity}</p>}
            </div>

            {/* Unit */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Unit</label>
              <input
                type="text"
                name="Unit"
                value={inputs.Unit || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
              {errors.Unit && <p className="text-red-500 text-sm">{errors.Unit}</p>}
            </div>

            {/* Received Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Received Date</label>
              <input
                type="date"
                name="Received_date"
                value={inputs.Received_date ? inputs.Received_date.slice(0, 10) : ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
              {errors.Received_date && <p className="text-red-500 text-sm">{errors.Received_date}</p>}
            </div>

            {/* Expired Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Expired Date</label>
              <input
                type="date"
                name="Expired_date"
                value={inputs.Expired_date ? inputs.Expired_date.slice(0, 10) : ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
              {errors.Expired_date && <p className="text-red-500 text-sm">{errors.Expired_date}</p>}
            </div>

            {/* Reorder Level */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Reorder Level</label>
              <input
                type="number"
                name="Reorder_level"
                value={inputs.Reorder_level || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
              {errors.Reorder_level && <p className="text-red-500 text-sm">{errors.Reorder_level}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Description</label>
              <textarea
                name="Description"
                value={inputs.Description || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Purchase ID */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Purchase ID</label>
              <select
                name="Purchase_id"
                value={inputs.Purchase_id || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select Purchase ID</option>
                {purchases.map((purchase) => (
                  <option key={purchase.Purchase_id} value={purchase.Purchase_id}>
                    {purchase.Purchase_id}
                  </option>
                ))}
              </select>
              {errors.Purchase_id && <p className="text-red-500 text-sm">{errors.Purchase_id}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateInventory;
