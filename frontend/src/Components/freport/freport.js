import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Nav from "../fNav/fNav";

function FReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef();

  const { month, year } = location.state || {};

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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
    return <p className="text-center text-gray-600 mt-10">Loading report...</p>;
  }

  if (!report) return null;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Nav />
      <div className="ml-52 flex-1 flex flex-col items-center p-10">
        {/* Download PDF Button */}
        <div className="mb-6 flex justify-end w-full max-w-5xl">
          <button
            onClick={handleDownloadPDF}
            className="bg-green-700 text-white px-5 py-2 rounded shadow hover:bg-green-800 transition"
          >
            ⬇️ Download PDF
          </button>
        </div>

        <div
          ref={reportRef}
          className="w-full max-w-5xl bg-white p-8 shadow-lg border border-green-300"
        >
          {/* Company Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-800">EcoFungi Pvt Ltd</h1>
            <p className="text-gray-600">Habaraduwa, Galle | Tel: +94 77 974 5000</p>
            <h2 className="mt-4 text-xl font-semibold text-green-700">
              Profit & Loss Statement for {months[report.month - 1]} {report.year}
            </h2>
          </div>

          {/* Revenue Table */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-green-700 mb-2">Revenue</h3>
            <table className="w-full border border-green-200 table-fixed">
              <tbody>
                <tr className="border-b border-green-100">
                  <td className="py-2 px-4">Sales</td>
                  <td className="py-2 px-4 text-right">Rs {report.revenue.sales.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-green-100">
                  <td className="py-2 px-4">Other Income</td>
                  <td className="py-2 px-4 text-right">Rs {report.revenue.otherIncome.toFixed(2)}</td>
                </tr>
                <tr className="font-bold bg-green-50">
                  <td className="py-2 px-4">Total Revenue</td>
                  <td className="py-2 px-4 text-right">Rs {report.revenue.totalRevenue.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Expenses Table */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-green-700 mb-2">Expenses</h3>
            <table className="w-full border border-green-200 table-fixed">
              <tbody>
                <tr className="border-b border-green-100">
                  <td className="py-2 px-4">Operational Expenses</td>
                  <td className="py-2 px-4 text-right">Rs {report.expenses.expenses.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-green-100">
                  <td className="py-2 px-4">Salaries</td>
                  <td className="py-2 px-4 text-right">Rs {report.expenses.salaries.toFixed(2)}</td>
                </tr>
                <tr className="font-bold bg-green-50">
                  <td className="py-2 px-4">Total Expenses</td>
                  <td className="py-2 px-4 text-right">
                    Rs {(report.expenses.expenses + report.expenses.salaries).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Net Profit/Loss */}
          <div
            className={`py-4 px-6 text-center font-bold text-xl rounded ${
              report.netProfit >= 0
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-red-100 text-red-800 border-red-300"
            } mb-6 border`}
          >
            Net {report.netProfit >= 0 ? "Profit" : "Loss"}: Rs {Math.abs(report.netProfit).toFixed(2)}
          </div>

          {/* Footer */}
          <div className="flex justify-between text-sm text-gray-700 border-t border-green-300 pt-4">
            <p><strong>Prepared By:</strong> Finance Department</p>
            <p><strong>Authorized Signature:</strong> ____________________</p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/profit")}
          className="mt-6 px-6 py-3 bg-green-700 text-white font-semibold rounded hover:bg-green-800 shadow transition"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

export default FReport;
