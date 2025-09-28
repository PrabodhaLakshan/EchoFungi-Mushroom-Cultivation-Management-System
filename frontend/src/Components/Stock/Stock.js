import React, { useEffect, useState } from "react";
import axios from "axios";
import StockD from "./StockD"; // your row component
import { Link } from "react-router-dom";
import { FaSearch, FaFilePdf } from "react-icons/fa";

const URL = "http://localhost:5000/Stock";

const fetchHandler = async () => {
  return await axios.get(URL).then(res => res.data);
};

function Stock() {
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHandler().then(data => setStocks(data.Stocks));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL}/${id}`);
      setStocks(stocks.filter(s => s.StockId !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Stock Details</h2>

        <div className="flex gap-4">
          <div className="relative w-72">
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stock..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-200"
            />
          </div>
          <Link to="/AddStock">
            <button className="px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition">
              + Add Stock
            </button>
          </Link>
          <button
            onClick={() =>
              window.open("http://localhost:5000/api/stock/report/pdf", "_blank")
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition flex items-center gap-2"
          >
            <FaFilePdf /> Generate PDF Report
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 shadow-md rounded-lg bg-white">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Stock ID</th>
              <th className="py-3 px-4 text-left">Manufacture Date</th>
              <th className="py-3 px-4 text-left">Mushroom Type</th>
              <th className="py-3 px-4 text-left">Expire Date</th>
              <th className="py-3 px-4 text-left">Quantity(Packets)</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks && stocks.length > 0
              ? stocks
                  .filter(
                    (s) =>
                      s.MushroomType.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((stock) => (
                    <StockD key={stock.StockId} Stock={stock} onDelete={handleDelete} />
                  ))
              : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500 italic">
                    No stocks found.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Stock;
