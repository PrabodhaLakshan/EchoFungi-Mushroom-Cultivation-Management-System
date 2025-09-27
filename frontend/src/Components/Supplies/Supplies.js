import React, { useEffect, useRef, useState } from "react";
import SupplyNav from "../SupplyNav/SupplyNav";
import axios from "axios";
import SupplyDetails from "../SupplyDetails/SupplyDetails";
import { useNavigate } from "react-router-dom";
import { FaTruck } from "react-icons/fa";

const URL = "http://localhost:5000/suppliers";

function Supplies() {
  const [suppliers, setSuppliers] = useState([]);
  const [originalSuppliers, setOriginalSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();
  const tableRef = useRef();

  // Fetch suppliers from backend
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get(URL);
        const data = res.data;
        const suppliersArray = data.suppliers || data || [];
        setSuppliers(suppliersArray);
        setOriginalSuppliers(suppliersArray);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  // Auto-search when typing
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery === "") {
      setSuppliers(originalSuppliers);
      setNoResults(false);
    } else {
      const filtered = originalSuppliers.filter(
        (supplier) =>
          supplier.Supplier_id?.toString().toLowerCase() === trimmedQuery.toLowerCase()
      );

      setSuppliers(filtered);
      setNoResults(filtered.length === 0);
    }
  }, [searchQuery, originalSuppliers]);

  // Delete supplier
  const handleDelete = (id) => {
    setSuppliers((prev) => prev.filter((s) => s._id !== id));
    setOriginalSuppliers((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-[200px] fixed top-0 left-0 h-full bg-green-900 text-white shadow-lg">
        <SupplyNav />
      </div>

      {/* Main content */}
      <div className="ml-[200px] p-6 w-full">
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaTruck /> Suppliers Details
          </h1>
        </div>

        {/* Search bar */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Supplier ID..."
            className="border border-gray-800 px-4 py-2 rounded-md w-full max-w-md"
          />
        </div>

        {/* Show message if no results */}
        {noResults && (
          <p className="text-red-500 font-bold mb-4">No results found</p>
        )}

        {/* Table with supplier details */}
        <div
          ref={tableRef}
          className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-300"
        >
          <table className="w-full border-collapse">
            <thead className="bg-[#A8BBA3] text-gray-900">
              <tr>
                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Supplier ID
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Supplier Name
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Contact Number
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Email
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Address
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length > 0 ? (
                suppliers.map((s) => (
                  <SupplyDetails key={s._id} supplier={s} onDelete={handleDelete} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No suppliers found.
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

export default Supplies;
