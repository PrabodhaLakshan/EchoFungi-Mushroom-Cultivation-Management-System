import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderD from "./OrderD";
import { Link } from "react-router-dom";
import { FaSearch, FaFilePdf } from "react-icons/fa";

const URL = "http://localhost:5000/Order";

// API fetch function
const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Order() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHandler().then((data) => setOrders(data.orders || []));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL}/${id}`);
      setOrders(orders.filter((o) => o.OrderId !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Orders List</h2>

        <div className="flex gap-3">
          <div className="relative w-72">
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Shop Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-200"
            />
          </div>

          <Link to="/AddOrder">
            <button className="px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition">
              + Add Order
            </button>
          </Link>

          <button
            onClick={() =>
              window.open("http://localhost:5000/Order/report/pdf", "_blank")
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition flex items-center gap-2"
          >
            <FaFilePdf /> Generate PDF Report
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 shadow-md rounded-lg bg-white">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Shop Name</th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Quantity</th>
              <th className="py-3 px-4 text-left">Order Date</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Delivered Date</th>
              <th className="py-3 px-4 text-left">Sales ID</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0
              ? orders
                  .filter(
                    (order) =>
                      order.ShopName.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((order) => (
                    <OrderD key={order.OrderId} order={order} onDelete={handleDelete} />
                  ))
              : (
                <tr>
                  <td colSpan="9" className="py-6 text-center text-gray-500 italic">
                    No orders found.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Order;
