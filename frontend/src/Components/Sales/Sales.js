import React, { useEffect, useState } from "react";
import axios from "axios";
import SalesD from "./SalesD";
import Navbar from "../Navbar/Nav";
import { Link } from "react-router-dom";
import { FaSearch, FaFilePdf } from "react-icons/fa";

const SALES_URL = "http://localhost:5000/Sale";
const PRODUCTS_URL = "http://localhost:5000/Product";

function Sales() {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, productsRes] = await Promise.all([
          axios.get(SALES_URL),
          axios.get(PRODUCTS_URL),
        ]);

        const salesData = salesRes.data?.Sales || [];
        const productsData = productsRes.data?.Products || [];

        const mergedSales = salesData.map((sale) => {
          const product = productsData.find(
            (p) => p.ProductId === sale.ProductId
          );
          return {
            ...sale,
            ProductName: product ? product.ProductName : "Unknown Product",
          };
        });

        setSales(mergedSales);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    try {
      await axios.delete(`${SALES_URL}/${id}`);
      setSales((prev) => prev.filter((s) => s.SalesId !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete sale");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <div className="w-64 h-screen bg-white shadow-md sticky top-0">
        <Navbar />
      </div>

      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">Sales Details</h2>

          <div className="flex gap-3 items-center">
            {/* Search bar */}
            <div className="relative w-72">
              <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sales (shop or product)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-200"
              />
            </div>

            {/* Add sale button */}
            <Link to="/AddSales">
              <button className="px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition">
                + Add Sale
              </button>
            </Link>

            {/* PDF button */}
            <button
              onClick={() =>
                window.open(
                  "http://localhost:5000/api/sales/report/pdf",
                  "_blank"
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition flex items-center gap-2"
            >
              <FaFilePdf /> Generate PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 shadow-md rounded-lg bg-white">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Sale ID</th>
                <th className="py-3 px-4 text-left">Shop Name</th>
                <th className="py-3 px-4 text-left">Product Name</th>
                <th className="py-3 px-4 text-left">Number of Packets</th>
                <th className="py-3 px-4 text-left">Number of Returns</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Total Price</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales && sales.length > 0 ? (
                sales
                  .filter(
                    (s) =>
                      (s.ShopName || "")
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      (s.ProductName || "")
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((sale) => (
                    <SalesD
                      key={sale.SalesId}
                      sale={sale}
                      onDelete={handleDelete}
                    />
                  ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="py-6 text-center text-gray-500 italic"
                  >
                    No sales found.
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

export default Sales;
