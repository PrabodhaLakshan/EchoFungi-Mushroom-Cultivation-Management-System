import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaShoppingCart, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PurchaseNav from "../PurchaseNav/PurchaseNav";

const URL = "http://localhost:5000/purchases";

function PurchaseReport() {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const tableRef = useRef();

  // Fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get(URL);
        const data = res.data.purchases || [];
        setPurchases(data);
        setFilteredPurchases(data);
      } catch (error) {
        console.error("Failed to fetch purchases:", error);
      }
    };
    fetchPurchases();
  }, []);

  // Auto-filter purchases
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredPurchases(purchases);
      return;
    }
    const filtered = purchases.filter((p) =>
      (p.Purchase_id ?? "").toString().toLowerCase().includes(query) ||
      (p.Item_name ?? "").toLowerCase().includes(query)
    );
    setFilteredPurchases(filtered);
  }, [searchQuery, purchases]);

  // Calculate monthly summary
  const monthlySummary = filteredPurchases.reduce((acc, purchase) => {
    const month = new Date(purchase.Purchase_date).toLocaleString("default", { month: "long", year: "numeric" });
    if (!acc[month]) {
      acc[month] = { totalCost: 0, count: 0 };
    }
    acc[month].totalCost += Number(purchase.Price ?? 0);
    acc[month].count += 1;
    return acc;
  }, {});

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
    pdf.save(`PurchaseReport-${today}.pdf`);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-[200px] fixed top-0 left-0 h-full bg-green-900 text-white shadow-lg">
        <PurchaseNav />
      </div>

      {/* Main content */}
      <div className="ml-[200px] flex-1 p-6 space-y-6 overflow-auto">
        {/* Header & PDF */}
        <div className="flex justify-between items-center print:hidden">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaShoppingCart /> Purchase Report
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
          placeholder="Search purchases by Item or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded-md w-full max-w-md print:hidden"
        />

        {/* No results */}
        {filteredPurchases.length === 0 && (
          <p className="text-red-500 font-bold mt-4">No purchases found</p>
        )}

        {/* Report Table */}
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
            <h4 className="text-lg font-semibold text-gray-700">
              Purchase Details Report
            </h4>
            <p className="text-sm text-gray-500">
              Date: {new Date().toLocaleDateString("en-GB")}
            </p>
          </div>

          {/* Monthly Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {Object.keys(monthlySummary).map((month) => (
              <div key={month} className="bg-green-100 p-4 rounded shadow text-center">
                <p className="text-green-800 font-semibold">{month}</p>
                <p>Total Purchases: {monthlySummary[month].count}</p>
                <p>Total Cost: Rs.{monthlySummary[month].totalCost.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Purchases Table */}
          <table className="w-full border-collapse text-sm">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Purchase ID</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Supplier ID</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Item Name</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Purchase Date</th>
                <th className="px-4 py-3 border-b border-gray-300 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((p) => (
                  <tr key={p._id} className="hover:bg-green-50">
                    <td className="px-4 py-3 border-b border-gray-300">{p.Purchase_id}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{p.Supplier_id}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{p.Item_name}</td>
                    <td className="px-4 py-3 border-b border-gray-300">{new Date(p.Purchase_date).toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-3 border-b border-gray-300">Rs.{p.Price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                    No purchases found.
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

export default PurchaseReport;
