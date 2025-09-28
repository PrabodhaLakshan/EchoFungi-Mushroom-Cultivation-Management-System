import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function FReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef();

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

  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Profit_Loss_${months[report.month - 1]}_${report.year}.pdf`);
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
          <h1 className="text-2xl font-bold text-gray-800">📊 Financial Report</h1>
          <button
            onClick={handleDownloadPDF}
            className="bg-green-700 text-white px-5 py-2 rounded-lg shadow hover:bg-green-800 transition"
          >
            ⬇️ Download PDF
          </button>
        </div>

        {/* Report */}
        <div
          ref={reportRef}
          className="w-full bg-white p-10 rounded-xl shadow-lg border border-gray-200"
        >
          {/* Company Header */}
          <div className="text-center mb-10 border-b pb-6">
            <h2 className="text-3xl font-extrabold text-green-800">
              EcoFungi Pvt Ltd
            </h2>
            <p className="text-gray-600">
              Habaraduwa, Galle | Tel: +94 77 974 5000
            </p>
            <h3 className="mt-4 text-xl font-semibold text-green-700">
              Profit & Loss Statement
            </h3>
            <p className="text-gray-500">
              For {months[report.month - 1]} {report.year}
            </p>
          </div>

          {/* Revenue Section */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-green-700 mb-3">
              Revenue
            </h4>
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <tbody>
                <tr className="border-b bg-gray-50">
                  <td className="py-3 px-4">Sales</td>
                  <td className="py-3 px-4 text-right font-medium">
                    Rs {report.revenue.sales.toFixed(2)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Other Income</td>
                  <td className="py-3 px-4 text-right font-medium">
                    Rs {report.revenue.otherIncome.toFixed(2)}
                  </td>
                </tr>
                <tr className="font-bold bg-green-50">
                  <td className="py-3 px-4">Total Revenue</td>
                  <td className="py-3 px-4 text-right">
                    Rs {report.revenue.totalRevenue.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Expenses Section */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-red-700 mb-3">
              Expenses
            </h4>
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <tbody>
                <tr className="border-b bg-gray-50">
                  <td className="py-3 px-4">Operational Expenses</td>
                  <td className="py-3 px-4 text-right font-medium">
                    Rs {report.expenses.expenses.toFixed(2)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Salaries</td>
                  <td className="py-3 px-4 text-right font-medium">
                    Rs {report.expenses.salaries.toFixed(2)}
                  </td>
                </tr>
                <tr className="font-bold bg-red-50">
                  <td className="py-3 px-4">Total Expenses</td>
                  <td className="py-3 px-4 text-right">
                    Rs {(
                      report.expenses.expenses + report.expenses.salaries
                    ).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Net Profit/Loss */}
          <div
            className={`py-5 px-6 text-center font-bold text-2xl rounded-lg mb-8 border ${
              report.netProfit >= 0
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-red-100 text-red-800 border-red-300"
            }`}
          >
            Net {report.netProfit >= 0 ? "Profit" : "Loss"}: Rs{" "}
            {Math.abs(report.netProfit).toFixed(2)}
          </div>

          {/* Footer */}
          <div className="flex justify-between text-sm text-gray-700 border-t border-gray-200 pt-4">
            <p>
              <strong>Prepared By:</strong> Finance Department
            </p>
            <p>
              <strong>Authorized Signature:</strong> ____________________
            </p>
          </div>
        </div>

        {/* Back Button */}
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
