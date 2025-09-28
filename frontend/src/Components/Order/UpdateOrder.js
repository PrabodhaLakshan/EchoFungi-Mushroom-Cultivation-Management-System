import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inputs, setInputs] = useState({
    ShopName: "",
    ProductId: "",
    OrderDate: "",
    Quantity: 0,
    Status: "Pending",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/customers")
      .then(res => setCustomers(res.data.Customers || []))
      .catch(console.error);

    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data.Products || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/orders/${id}`)
      .then(res => {
        const order = res.data.order;
        if (!order) setError("Order not found");
        else setInputs({
          ShopName: order.ShopName,
          ProductId: order.ProductId,
          OrderDate: order.OrderDate ? new Date(order.OrderDate).toISOString().split("T")[0] : "",
          Quantity: order.Quantity,
          Status: order.Status
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load order");
        setLoading(false);
      });
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === "Quantity" || name === "ProductId" ? Number(value) : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, inputs);
      navigate("/Order");
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-green-800 text-center mb-6">Update Order</h2>

        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">Shop Name</label>
          <select name="ShopName" value={inputs.ShopName} onChange={handleChange} required
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none">
            <option value="">-- Select Shop --</option>
            {customers.map(c => <option key={c.CustomerId} value={c.ShopName}>{c.ShopName} ({c.City})</option>)}
          </select>
        </div>

        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">Product</label>
          <select name="ProductId" value={inputs.ProductId} onChange={handleChange} required
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none">
            <option value="">-- Select Product --</option>
            {products.map(p => <option key={p.ProductId} value={p.ProductId}>{p.ProductName} ({p.MushroomType})</option>)}
          </select>
        </div>

        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">Order Date</label>
          <input type="date" name="OrderDate" value={inputs.OrderDate} onChange={handleChange} required
                 className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"/>
        </div>

        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">Quantity</label>
          <input type="number" name="Quantity" value={inputs.Quantity} onChange={handleChange} min="1"
                 className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"/>
        </div>

        <div className="flex flex-col mb-4">
          <label className="mb-1 text-sm font-semibold text-green-700">Status</label>
          <select name="Status" value={inputs.Status} onChange={handleChange}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none">
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button type="submit" className="flex-1 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition">Update</button>
          <button type="reset" onClick={() => setInputs({
            ShopName: "",
            ProductId: "",
            OrderDate: "",
            Quantity: 0,
            Status: "Pending"
          })} className="flex-1 border border-green-400 bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 transition">Clear</button>
        </div>
      </form>
    </div>
  );
}

export default UpdateOrder;
