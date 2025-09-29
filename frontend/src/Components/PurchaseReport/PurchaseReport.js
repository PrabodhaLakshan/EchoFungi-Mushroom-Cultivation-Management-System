import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PurchaseNav from "../PurchaseNav/PurchaseNav";

const URL = "http://localhost:5000/purchases";

function PurchaseReport() {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredPurchases(purchases);
      return;
    }
    const filtered = purchases.filter(
      (p) =>
        (p.Purchase_id ?? "").toString().toLowerCase().includes(query) ||
        (p.Item_name ?? "").toLowerCase().includes(query)
    );
    setFilteredPurchases(filtered);
  }, [searchQuery, purchases]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const borderMargin = 15;
    const contentMargin = borderMargin + 10;

    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const generatedText = `Generated on: ${formattedDate} at ${formattedTime}`;

    const fromDate = purchases[0]?.Purchase_date
      ? new Date(purchases[0].Purchase_date).toLocaleDateString()
      : "N/A";
    const toDate = purchases[purchases.length - 1]?.Purchase_date
      ? new Date(purchases[purchases.length - 1].Purchase_date).toLocaleDateString()
      : "N/A";

    // 🔲 Border
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(borderMargin, borderMargin, pageWidth - 2 * borderMargin, pageHeight - 2 * borderMargin);

    // 🟩 Header

    const logoBase64 = "logo.png";
    const headerHeight = 30;
const headerInset = 3;


const logoSize = 12; 
const logoX = borderMargin + headerInset + 5; 
const logoY = borderMargin + 10; 


doc.setFillColor(34, 139, 34); 
doc.rect(
  borderMargin + headerInset, 
  borderMargin + 2,           
  pageWidth - 2 * (borderMargin + headerInset),
  headerHeight,
  "F"
);


doc.addImage(logoBase64, "PNG", logoX, logoY, logoSize, logoSize);


const textStartX = logoX + logoSize + 3; 
const textBaseY = borderMargin + 20; 


doc.setTextColor(255, 255, 255);
doc.setFontSize(16);
doc.setFont("helvetica", "bold");
doc.text("EcoFungi", textStartX, textBaseY);


doc.setFontSize(10);
doc.setFont("helvetica", "normal");
doc.text("Inventory Management System", textStartX, textBaseY + 8);


    doc.setFontSize(9);
    doc.text(generatedText, pageWidth - contentMargin - 70, borderMargin + 26);

    // 🟨 Title
    const titleY = borderMargin + headerHeight + 12;
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Purchase Report", contentMargin, titleY);

    // ➖ Line
    doc.setDrawColor(100);
    doc.setLineWidth(0.5);
    doc.line(contentMargin, titleY + 3, pageWidth - contentMargin, titleY + 3);

    // 📋 Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Records: ${filteredPurchases.length}`, contentMargin, titleY + 10);
    doc.text(`Report Period: ${fromDate} - ${toDate}`, contentMargin, titleY + 16);

    // 📊 Table
    const tableColumn = ["Purchase ID", "Supplier ID", "Item Name", "Purchase Date", "Price"];
    const tableRows = filteredPurchases.map((p) => [
      p.Purchase_id,
      p.Supplier_id,
      p.Item_name,
      new Date(p.Purchase_date).toLocaleDateString(),
      `Rs.${p.Price}`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: titleY + 22,
      theme: "grid",
      headStyles: {
        fillColor: [34, 139, 34],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        halign: "center",
        fontSize: 9,
      },
      margin: { left: contentMargin, right: contentMargin },
    });

    // 📝 Notes
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.setTextColor(90);
    doc.text("Note: This report contains purchase records collected by the EcoFungi system.", contentMargin, finalY);
    doc.text("For questions or concerns, please contact the system administrator.", contentMargin, finalY + 5);

    // 📅 Footer
    const footerY = pageHeight - borderMargin - 5;
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(contentMargin, footerY - 4, pageWidth - contentMargin, footerY - 4);

    doc.setFontSize(8);
    doc.setTextColor(90);
    doc.text("EcoFungi Inventory Management System", contentMargin, footerY);
    const pageText = `Page 1 of ${doc.internal.getNumberOfPages()}`;
    const pageTextWidth = doc.getTextWidth(pageText);
    doc.text(pageText, pageWidth - contentMargin - pageTextWidth, footerY);

    doc.text(generatedText, contentMargin, footerY - 6);

    doc.save(`EcoFungi_Purchase_Report_${now.toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="w-[200px] fixed top-0 left-0 h-full bg-green-900 text-white shadow-lg">
        <PurchaseNav />
      </div>
      <div className="ml-[200px] flex-1 p-6 space-y-6 overflow-auto">
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

        <input
          type="text"
          placeholder="Search purchases by Item or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded-md w-full max-w-md print:hidden"
        />

        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-300 p-6 mt-4">
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
                    <td className="px-4 py-3 border-b border-gray-300">
                      {new Date(p.Purchase_date).toLocaleDateString()}
                    </td>
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
