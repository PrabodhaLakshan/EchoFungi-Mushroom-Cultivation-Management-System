import React, { useEffect, useState, useRef } from "react";
import SupplyNav from "../SupplyNav/SupplyNav";
import axios from "axios";
import { FaTruck, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const URL = "http://localhost:5000/suppliers";

function SupplierReport() {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const tableRef = useRef();

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get(URL);
        const data = res.data.suppliers || res.data || [];
        setSuppliers(data);
        setFilteredSuppliers(data); // initialize filtered list
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  // Auto-filter suppliers
  useEffect(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) {
      setFilteredSuppliers(suppliers);
      return;
    }
    const filtered = suppliers.filter(
      (sup) =>
        sup.Supplier_id?.toString().toLowerCase() === trimmedQuery ||
        sup.Supplier_name?.toLowerCase().includes(trimmedQuery)
    );
    setFilteredSuppliers(filtered);
  }, [searchQuery, suppliers]);

  // Generate PDF
  const generatePDF = async () => {
    const input = tableRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 20;

    pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 20;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const today = new Date().toISOString().split("T")[0];
    pdf.save(`SupplierReport-${today}.pdf`);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-[200px] fixed top-0 left-0 h-full bg-green-900 text-white shadow-lg">
        <SupplyNav />
      </div>

      {/* Main content */}
      <div className="ml-[200px] flex-1 p-6 space-y-6 overflow-auto">
        {/* Header & PDF */}
        <div className="flex justify-between items-center print:hidden">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaTruck /> Supplier Report
          </h1>
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
          >
            <FaFilePdf /> Download Report
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by Supplier ID or Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded-md w-full max-w-md print:hidden"
        />

        {/* No results */}
        {filteredSuppliers.length === 0 && (
          <p className="text-red-500 font-bold mt-4">No suppliers found</p>
        )}

        {/* Table */}
        <div
          ref={tableRef}
          className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-300 p-6 mt-4"
        >
          {/* Report Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-green-800">🍄 EcoFungi</h2>
            <h3 className="text-lg font-semibold text-gray-700">
              Inventory Management System
            </h3>
            <p className="text-sm text-gray-500">
              Date: {new Date().toLocaleDateString("en-GB")}
            </p>
          </div>

          {/* Supplier Table */}
          <table className="w-full border-collapse text-sm">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Supplier ID</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Supplier Name</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Contact Number</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Email</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((sup) => (
                  <tr key={sup._id} className="hover:bg-green-50">
                    <td className="px-4 py-3 border-b border-gray-300">{sup.Supplier_id}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{sup.Supplier_name}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{sup.Phone_number}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{sup.Email}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{sup.Address}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 italic">
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

export default SupplierReport;
