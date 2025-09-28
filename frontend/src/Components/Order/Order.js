import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderD from "./OrderD";
import Navbar from "../Navbar/Nav";
import { Link } from "react-router-dom";
import { FaSearch, FaFilePdf } from "react-icons/fa";

const URL = "http://localhost:5000/api/orders"; // ✅ use the protected API route

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// API fetch function with JWT
const fetchHandler = async () => {
  const token = getToken();
  return await axios
    .get(URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);
};

function Order() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHandler()
      .then((data) => setOrders(data.orders || []))
      .catch((err) => console.error("Failed to fetch orders:", err));
  }, []);

  const handleDelete = async (id) => {
    const token = getToken();
    try {
      await axios.delete(`${URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter((o) => o.OrderId !== id));
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="w-64 bg-green-800 text-white fixed top-0 left-0 h-full shadow-lg">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64 p-8">
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
              onClick={async () => {
                const token = getToken();
                try {
                  const response = await axios.get(`${URL}/report/pdf`, {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: "blob",
                  });
                  // Download PDF
                  const url = window.URL.createObjectURL(new Blob([response.data]));
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", "Order_Report.pdf");
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                } catch (err) {
                  console.error("Failed to generate PDF:", err);
                }
              }}
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
              {orders && orders.length > 0 ? (
                orders
                  .filter((order) =>
                    order.ShopName.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((order) => (
                    <OrderD
                      key={order.OrderId}
                      order={order}
                      onDelete={handleDelete}
                    />
                  ))
              ) : (
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
    </div>
  );
}

export default Order;
