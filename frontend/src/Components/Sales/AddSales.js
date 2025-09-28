import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddSales() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inputs, setInputs] = useState({
    ShopName: "",
    ProductId: "",
    Date: "",
    NumberOfPackets: 0,
    NumberOfReturns: 0,
    TotalPrice: 0
  });

  
  useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Customer");
      setCustomers(res.data.Customers || []);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    }
  };
  fetchCustomers();
}, []);

  // Fetch products for the dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/Product");
        setProducts(res.data.Products || res.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: (name === "NumberOfPackets" || name === "NumberOfReturns") ? Number(value) : value
    }));
  };

  // Auto-calculate TotalPrice
  useEffect(() => {
    const selectedProduct = products.find(p => String(p.ProductId) === String(inputs.ProductId));
    if (selectedProduct) {
      const unitPrice = Number(selectedProduct.UnitPrice) || 0;
      const total = (Number(inputs.NumberOfPackets) - Number(inputs.NumberOfReturns)) * unitPrice;
      setInputs(prev => ({ ...prev, TotalPrice: total }));
    } else {
      setInputs(prev => ({ ...prev, TotalPrice: 0 }));
    }
  }, [inputs.NumberOfPackets, inputs.NumberOfReturns, inputs.ProductId, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ShopName: inputs.ShopName,
        ProductId: Number(inputs.ProductId),
        Date: inputs.Date,
        NumberOfPackets: Number(inputs.NumberOfPackets),
        NumberOfReturns: Number(inputs.NumberOfReturns),
        TotalPrice: Number(inputs.TotalPrice)
      };
      await axios.post("http://localhost:5000/Sale", payload);
      navigate("/Sales");
    } catch (err) {
      console.error(err);
      alert("Failed to add sale");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-green-800 text-center mb-6">Add New Sale</h2>

        {/* Shop Name */}
        <div className="flex flex-col mb-4">
    <label className="mb-1 text-sm font-semibold text-green-700">Shop Name</label>
    <select
      name="ShopName"
      value={inputs.ShopName}
      onChange={handleChange}
      required
    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none">
    <option value="">-- Select Shop --</option>
    {customers.map((c) => (
      <option key={c.CustomerId} value={c.ShopName}>
        {c.ShopName} ({c.City})
      </option>
         ))}
        </select>
        </div>

        {/* Product Dropdown */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">Product</label>
          <select
            name="ProductId"
            value={inputs.ProductId}
            onChange={handleChange}
            required
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          >
            <option value="">-- Select Product --</option>
            {products.map((p) => (
              <option key={p.ProductId} value={p.ProductId}>
                {p.ProductName} ({p.MushroomType})
              </option>
            ))}
          </select>
        </div>

        {/* Sale Date */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">Sale Date</label>
          <input
            type="date"
            name="Date"
            value={inputs.Date}
            onChange={handleChange}
            required
            className="px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Number of Packets */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">Number of Packets</label>
          <input
            type="number"
            name="NumberOfPackets"
            value={inputs.NumberOfPackets}
            onChange={handleChange}
            min="0"
            className="px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Number of Returns */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">Number of Returns</label>
          <input
            type="number"
            name="NumberOfReturns"
            value={inputs.NumberOfReturns}
            onChange={handleChange}
            min="0"
            className="px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Total Price */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">Total Price</label>
          <input
            type="number"
            name="TotalPrice"
            value={Number(inputs.TotalPrice).toFixed(2)}
            readOnly
            className="px-3 py-2 border rounded-lg bg-gray-100"
          />
        </div>

        {/* Submit & Clear */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
          >
            Submit
          </button>
          <button
            type="reset"
            onClick={() =>
              setInputs({ ShopName: "", ProductId: "", Date: "", NumberOfPackets: 0, NumberOfReturns: 0, TotalPrice: 0 })
            }
            className="flex-1 border border-green-400 bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddSales;
