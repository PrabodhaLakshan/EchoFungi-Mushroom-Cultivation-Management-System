import React, { useState, useEffect } from "react";
import PurchaseNav from "../PurchaseNav/PurchaseNav";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddPurchase() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    Purchase_id: "",
    Supplier_id: "",
    Item_name: "",
    Purchase_date: "",
    Price: "",
  });

  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/suppliers");
        if (Array.isArray(res.data.suppliers)) {
          setSuppliers(res.data.suppliers);
        } else {
          console.error("Suppliers data is not an array", res.data);
        }
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };

    fetchSuppliers();
  }, []);

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    

    if (!inputs.Item_name.trim()) {
      newErrors.Item_name = "Item name is required.";
    } else if (inputs.Item_name.length < 2) {
      newErrors.Item_name = "Item name must be at least 2 characters.";
    }

    if (!inputs.Purchase_date) {
      newErrors.Purchase_date = "Purchase date is required.";
    } else if (new Date(inputs.Purchase_date) > new Date()) {
      newErrors.Purchase_date = "Purchase date cannot be in the future.";
    }

   if (inputs.Price === "") {
  newErrors.Price = "Price is required.";
} else {
  
  const priceRegex = /^\d+(\.\d{1,2})?$/;
  if (!priceRegex.test(inputs.Price)) {
    newErrors.Price = "Price must be a valid non-negative number with up to 2 decimal places.";
  }
}


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
  e.preventDefault();
  setServerErrors([]);

  if (!validate()) return;

  try {
    const res = await axios.post("http://localhost:5000/purchases", {
      Supplier_id: inputs.Supplier_id,
      Item_name: inputs.Item_name,
      Purchase_date: new Date(inputs.Purchase_date),
      Price: Number(inputs.Price),
    });

    const codeNumber = res.data.Purchase_id;
    const formattedCode = "ITEM" + String(codeNumber).padStart(3, "0");
    setInputs((prev) => ({ ...prev, Purchase_id: formattedCode }));

    // ✅ Show success alert
    window.alert("✅ Add Purchase Details Successful!");

    navigate("/purchasedetails");
  } catch (err) {
    if (err.response?.data?.errors) {
      setServerErrors(err.response.data.errors);
    } else {
      console.error("Error adding item:", err);
    }
  }
};

  return (
    <div className="flex min-h-screen bg-gray-100">
      <PurchaseNav />

      <div className="flex-grow flex justify-center items-center py-8 px-4">
        <div className="w-full max-w-xl bg-white p-8 rounded shadow">
          <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Add Purchase
          </h1>

          {/* Server-side validation errors */}
          {serverErrors.length > 0 && (
            <div className="mb-4 text-red-600">
              <ul className="list-disc ml-5">
                {serverErrors.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Purchase ID */}
            <div>
              <label className="block font-medium text-gray-700">Purchase ID</label>
              <input
                type="text"
                name="Purchase_id"
                value={inputs.Purchase_id || "Auto-generated"}
                readOnly
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="block font-medium text-gray-700">Supplier</label>
              <select
                name="Supplier_id"
                value={inputs.Supplier_id}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map((sup) => (
                  <option key={sup._id} value={sup.Supplier_id}>
                    {sup.Supplier_id}
                  </option>
                ))}
              </select>
              {errors.Supplier_id && <p className="text-red-500 text-sm">{errors.Supplier_id}</p>}
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
              {errors.Item_name && <p className="text-red-500 text-sm">{errors.Item_name}</p>}
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block font-medium text-gray-700">Purchase Date</label>
              <input
                type="date"
                name="Purchase_date"
                value={inputs.Purchase_date}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded"
              />
              {errors.Purchase_date && <p className="text-red-500 text-sm">{errors.Purchase_date}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="Price"
                value={inputs.Price}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded"
              />
              {errors.Price && <p className="text-red-500 text-sm">{errors.Price}</p>}
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
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

export default AddPurchase;
