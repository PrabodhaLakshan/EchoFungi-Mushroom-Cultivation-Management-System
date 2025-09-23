import React, { useState } from "react";
import axios from "axios";
import Nav from "../fNav/fNav";

function ProfitLoss() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!month || !year) return alert("Please select month and year");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/profits/generate", {
        month: Number(month),
        year: Number(year),
      });
      setResult(res.data.pl);
    } catch (err) {
      console.error(err);
      alert("Error generating Profit & Loss");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Nav />

      {/* Main content with offset for fixed sidebar */}
      <div className="ml-52 flex-1 flex flex-col justify-center items-center p-10">
        <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
          📊 Profit & Loss Dashboard
        </h1>

        {/* Form */}
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 mb-12 border-4 border-green-200">
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Month */}
            <div className="flex flex-col">
              <label className="text-green-800 font-semibold mb-2">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">-- Select Month --</option>
                {months.map((m, idx) => (
                  <option key={idx + 1} value={idx + 1}>{m}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="flex flex-col">
              <label className="text-green-800 font-semibold mb-2">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className="p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="md:col-span-2 text-center">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {loading ? "Generating..." : "Generate Report"}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Revenue */}
            <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4 text-center">Revenue</h2>
              <div className="space-y-2 text-gray-800">
                <p className="flex justify-between">
                  <span>Sales</span>
                  <span>Rs {result.revenue.sales.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Other Income</span>
                  <span>Rs {result.revenue.otherIncome.toFixed(2)}</span>
                </p>
                <hr className="my-2 border-green-300"/>
                <p className="flex justify-between font-bold">
                  <span>Total Revenue</span>
                  <span>Rs {result.revenue.totalRevenue.toFixed(2)}</span>
                </p>
              </div>
            </div>

            {/* Expenses */}
            <div className="bg-red-50 border border-red-300 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-red-700 mb-4 text-center">Expenses</h2>
              <div className="space-y-2 text-gray-800">
                <p className="flex justify-between">
                  <span>Operational Expenses</span>
                  <span>Rs {result.expenses.expenses.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Salaries</span>
                  <span>Rs {result.expenses.salaries.toFixed(2)}</span>
                </p>
                <hr className="my-2 border-red-300"/>
                <p className="flex justify-between font-bold">
                  <span>Total Expenses</span>
                  <span>Rs {(result.expenses.expenses + result.expenses.salaries).toFixed(2)}</span>
                </p>
              </div>
            </div>

            {/* Net Profit/Loss */}
            <div className={`rounded-lg shadow-md p-6 flex flex-col justify-center items-center
              ${result.netProfit >= 0 ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"} border`}>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Net {result.netProfit >= 0 ? "Profit" : "Loss"}</h2>
              <p className={`text-2xl font-bold ${result.netProfit >= 0 ? "text-green-700" : "text-red-700"}`}>
                Rs {Math.abs(result.netProfit).toFixed(2)}
              </p>
              <p className="mt-2 text-gray-600">{months[result.month - 1]} {result.year}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfitLoss;
