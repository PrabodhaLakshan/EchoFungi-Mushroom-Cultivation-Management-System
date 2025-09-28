import React, { useEffect, useState } from "react";
import InventoryNav from "../InventoryNav/InventoryNav";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const URL = "http://localhost:5000/items";

function IntReport() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  useEffect(() => {
    axios.get(URL).then((res) => {
      setItems(res.data.items);
      setFilteredItems(res.data.items);
    });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString();
  };


  useEffect(() => {
    let result = [...items];

    
    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      result = result.filter((item) => {
        const date = new Date(item.Received_date);
        return (
          date.getFullYear() === parseInt(year) &&
          date.getMonth() + 1 === parseInt(month)
        );
      });
    }

    
    if (searchQuery.trim()) {
      result = result.filter((item) =>
        item.Item_code &&
        item.Item_code.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(result);
  }, [selectedMonth, searchQuery, items]);

  const lowStockItems = filteredItems.filter(
    (item) => item.Quantity < item.Reorder_level
  );
  const expiringItems = filteredItems.filter((item) => {
    const expDate = new Date(item.Expired_date);
    return expDate >= today && expDate <= nextWeek;
  });

  const generatePDF = async () => {
    const element = document.getElementById("pdf-report");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      scrollY: -window.scrollY,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("Inventory_Movement_Report.pdf");
  };

  return (
    <div className="flex bg-green-50 min-h-screen">
      <InventoryNav />

      <div className="ml-52 flex-1 p-6 space-y-8 overflow-auto">
        {/* Filters */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search by Item Code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border rounded-md"
            />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border rounded-md"
            />
          </div>

          <button
            onClick={generatePDF}
            className="bg-green-700 text-white px-5 py-2 rounded-md hover:bg-green-800 shadow-md transition-all"
          >
            📄 Download Report
          </button>
        </div>

        {/* Report */}
        <div
          id="pdf-report"
          className="bg-white p-8 rounded-xl shadow-lg space-y-8 text-sm"
        >
          {/* Header */}
          <div className="text-center border-b pb-3">
            <h1 className="text-3xl font-bold text-green-800 uppercase tracking-widest">
              Inventory Movement Report
            </h1>
            <p className="text-gray-600">Prepared by: EcoFungi Inventory System</p>
            <p className="text-gray-600">Date: {today.toLocaleDateString()}</p>
          </div>

          {/* Inventory Overview */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-700 border-b pb-1">
              Inventory Overview
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-green-300 text-left text-sm">
                <thead className="bg-green-700 text-white">
                  <tr>
                    {[
                      "Item Code","Category","Item Name","Quantity","Unit",
                      "Received Date","Expired Date","Reorder Level","Description","Purchase ID"
                    ].map((h, idx) => (
                      <th key={idx} className="px-3 py-2 border-r last:border-r-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, i) => (
                    <tr key={i} className="border-t hover:bg-green-50">
                      <td className="px-3 py-2">{item.Item_code}</td>
                      <td className="px-3 py-2">{item.Category}</td>
                      <td className="px-3 py-2">{item.Item_name}</td>
                      <td className="px-3 py-2">{item.Quantity}</td>
                      <td className="px-3 py-2">{item.Unit}</td>
                      <td className="px-3 py-2">{formatDate(item.Received_date)}</td>
                      <td className="px-3 py-2">{formatDate(item.Expired_date)}</td>
                      <td className="px-3 py-2">{item.Reorder_level}</td>
                      <td className="px-3 py-2">{item.Description}</td>
                      <td className="px-3 py-2">{item.Purchase_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Items */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-green-700 border-b pb-1">
              Low Stock Items
            </h2>
            {lowStockItems.length === 0 ? (
              <p className="text-center text-gray-500 py-2">
                All items are above reorder level.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-green-300 text-left text-sm">
                  <thead className="bg-green-700 text-white">
                    <tr>
                      {["Item Code","Item Name","Quantity","Reorder Level"].map((h, idx) => (
                        <th key={idx} className="px-3 py-2 border-r last:border-r-0">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockItems.map((item, i) => (
                      <tr key={i} className="border-t text-green-700 font-semibold hover:bg-green-50">
                        <td className="px-3 py-2">{item.Item_code}</td>
                        <td className="px-3 py-2">{item.Item_name}</td>
                        <td className="px-3 py-2">{item.Quantity}</td>
                        <td className="px-3 py-2">{item.Reorder_level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Expiring Items */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-green-700 border-b pb-1">
              Expiring Items (Next 7 Days)
            </h2>
            {expiringItems.length === 0 ? (
              <p className="text-center text-gray-500 py-2">
                No items expiring in the next 7 days.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-green-300 text-left text-sm">
                  <thead className="bg-green-700 text-white">
                    <tr>
                      {["Item Code","Item Name","Quantity","Expired Date"].map((h, idx) => (
                        <th key={idx} className="px-3 py-2 border-r last:border-r-0">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {expiringItems.map((item, i) => (
                      <tr key={i} className="border-t text-green-700 font-semibold hover:bg-green-50">
                        <td className="px-3 py-2">{item.Item_code}</td>
                        <td className="px-3 py-2">{item.Item_name}</td>
                        <td className="px-3 py-2">{item.Quantity}</td>
                        <td className="px-3 py-2">{formatDate(item.Expired_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Movement Summary */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-green-700 border-b pb-1">
              Movement Summary
            </h2>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="bg-green-100 p-4 rounded shadow text-center">
                <p className="text-green-800">Total Stock Items</p>
                <p className="font-bold text-green-700 text-lg">{filteredItems.length}</p>
              </div>
              <div className="bg-green-100 p-4 rounded shadow text-center">
                <p className="text-green-800">Low Stock Items</p>
                <p className="font-bold text-green-700 text-lg">{lowStockItems.length}</p>
              </div>
              <div className="bg-green-100 p-4 rounded shadow text-center">
                <p className="text-green-800">Expiring Items (7 days)</p>
                <p className="font-bold text-green-700 text-lg">{expiringItems.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntReport;
