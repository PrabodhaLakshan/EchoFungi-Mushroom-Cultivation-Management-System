import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function FReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const { month, year } = location.state || {};

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  useEffect(() => {
    if (!month || !year) {
      alert("No month/year selected");
      navigate("/profit-loss");
      return;
    }

    axios
      .post("http://localhost:5000/profits/generate", {
        month: Number(month),
        year: Number(year),
      })
      .then((res) => setReport(res.data.pl))
      .catch((err) => {
        console.error("Error fetching report:", err);
        alert("Error fetching report");
      })
      .finally(() => setLoading(false));
  }, [month, year, navigate]);

  // Generate Styled PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const logoBase64 = "data:logo/png;;"; // your base64 logo here
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;

    // Page border
    doc.setDrawColor(20, 83, 45);
    doc.setLineWidth(2);
    doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

    // Header
    doc.setFillColor(20, 83, 45);
    doc.rect(margin + 3, margin + 3, pageWidth - (margin * 2) - 6, 30, "F");

    try {
      doc.addImage(logoBase64, "PNG", margin + 8, margin + 8, 16, 16);
    } catch (err) {
      doc.setFillColor(255, 255, 255);
      doc.circle(margin + 16, margin + 16, 8, "F");
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.text("EcoFungi Pvt Ltd", margin + 28, margin + 15);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Financial Monitoring System", margin + 28, margin + 22);

    // Date
    const reportDate = `Generated: ${new Date().toLocaleString()}`;
    const dateWidth = doc.getTextWidth(reportDate);
    doc.text(reportDate, pageWidth - margin - dateWidth - 5, margin + 15);

    // Title
    doc.setTextColor(20, 83, 45);
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text("Profit & Loss Statement", margin + 5, margin + 50);

    doc.setDrawColor(20, 83, 45);
    doc.line(margin + 5, margin + 53, pageWidth - margin - 5, margin + 53);

    // Summary Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(
      `For the month of ${months[report.month - 1]} ${report.year}`,
      margin + 5,
      margin + 63
    );

    // Revenue Table
    const revenueTable = [
      ["Sales", `Rs ${report.revenue.sales.toFixed(2)}`],
      ["Other Income", `Rs ${report.revenue.otherIncome.toFixed(2)}`],
      ["Total Revenue", `Rs ${report.revenue.totalRevenue.toFixed(2)}`],
    ];

    autoTable(doc, {
      head: [["Revenue Item", "Amount (Rs)"]],
      body: revenueTable,
      startY: margin + 70,
      theme: "striped",
      headStyles: {
        fillColor: [20, 83, 45],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      bodyStyles: {
        halign: "right",
        fontSize: 10,
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "right" },
      },
      margin: { left: margin + 5, right: margin + 5 },
    });

    // Expense Table
    const expenseTable = [
      ["Operational Expenses", `Rs ${report.expenses.expenses.toFixed(2)}`],
      ["Salaries", `Rs ${report.expenses.salaries.toFixed(2)}`],
      [
        "Total Expenses",
        `Rs ${(report.expenses.expenses + report.expenses.salaries).toFixed(2)}`,
      ],
    ];

    autoTable(doc, {
      head: [["Expense Item", "Amount (Rs)"]],
      body: expenseTable,
      startY: doc.lastAutoTable.finalY + 10,
      theme: "striped",
      headStyles: {
        fillColor: [153, 27, 27],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      bodyStyles: {
        halign: "right",
        fontSize: 10,
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "right" },
      },
      margin: { left: margin + 5, right: margin + 5 },
    });

    // Net Profit / Loss
    const finalY = doc.lastAutoTable.finalY + 15;
    const profit = report.netProfit;
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.setTextColor(profit >= 0 ? 20 : 153, profit >= 0 ? 83 : 27, 45);
    doc.text(
      `${profit >= 0 ? "Net Profit" : "Net Loss"}: Rs ${Math.abs(
        profit
      ).toFixed(2)}`,
      margin + 10,
      finalY
    );

    // Footer
    const footerY = pageHeight - margin - 20;
    doc.setFillColor(248, 250, 252);
    doc.rect(margin + 5, footerY, pageWidth - margin * 2 - 10, 15, "F");

    doc.setTextColor(75, 85, 99);
    doc.setFontSize(8);
    doc.text("EcoFungi Financial Monitoring System", margin + 8, footerY + 8);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      margin + 8,
      footerY + 12
    );

    const pageText = `Page 1 of 1`;
    const pageTextWidth = doc.getTextWidth(pageText);
    doc.text(pageText, pageWidth - margin - pageTextWidth - 8, footerY + 10);

    // Save file
    doc.save(
      `EcoFungi_Financial_Report_${months[report.month - 1]}_${report.year}.pdf`
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700 animate-pulse">Loading report...</p>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans justify-center items-center">
      <div className="flex flex-col items-center p-10 w-full max-w-5xl">
        {/* Toolbar */}
        <div className="mb-6 flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold text-gray-800">📑 Profit & Loss Report</h1>
          <button
            onClick={handleDownloadPDF}
            className="bg-green-700 text-white px-5 py-2 rounded-lg shadow hover:bg-green-800 transition"
          >
            ⬇️ Download PDF
          </button>
        </div>

        {/* Card */}
        <div className="w-full bg-white p-10 rounded-xl shadow-lg border border-gray-200 text-center">
          <h2 className="text-3xl font-extrabold text-green-800 mb-2">EcoFungi Pvt Ltd</h2>
          <p className="text-gray-600 mb-4">
            Habaraduwa, Galle | Tel: +94 77 974 5000
          </p>
          <h3 className="text-xl font-semibold text-green-700 mb-2">
            Profit & Loss Statement
          </h3>
          <p className="text-gray-500 mb-6">
            For {months[report.month - 1]} {report.year}
          </p>

          <div className="mt-6 text-left">
            <p className="text-gray-600 text-sm italic mb-2">
              * Click "Download PDF" for official formatted report
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/profit")}
          className="mt-8 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 shadow transition"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

export default FReport;
