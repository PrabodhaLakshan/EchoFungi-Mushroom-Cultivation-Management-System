import axios from "axios";
import React, { useState, useEffect } from "react";
import PayNav from "../PayNav/PayNav";
import Salary from "../Salary/Salary";

const URL = "http://localhost:5000/salaries";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Paydetails() {
  const [salaries, setSalary] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filterMonth, setFilterMonth] = useState(""); // 🔹 separate month filter

  useEffect(() => {
    fetchHandler().then((data) => setSalary(data.salaries));
  }, []);

  // ✅ Filter salaries by employee_id AND month (independent)
  const filteredSalaries = salaries.filter((sal) => {
    const matchesId = searchId
      ? sal.employee_id.toString().includes(searchId.trim())
      : true;
    const matchesMonth = filterMonth ? sal.month === filterMonth : true;
    return matchesId && matchesMonth;
  });

  // ✅ Calculate total expenses
  const totalExpenses = filteredSalaries.reduce((sum, sal) => {
    return sum + (sal.totals?.netSalary || 0);
  }, 0);

  // ✅ Clear filters
  const clearFilters = () => {
    setSearchId("");
    setFilterMonth("");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <PayNav />

      {/* Content Area */}
      <div className="flex-1 bg-[#F9FAF9] p-6 min-h-screen ml-52 flex flex-col items-center">
        {/* Title */}
        <h1 className="text-2xl font-bold text-[#4CAF50] mb-6">
         All Salary Details
        </h1>

        {/* 🔎 Filters Section */}
        <div className="mb-6 flex flex-col md:flex-row justify-center items-center gap-4 w-full">
          {/* Employee ID filter */}
          <input
            type="text"
            placeholder="Search by Employee ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-1/3 px-3 py-2 border border-[#A5D6A7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
          />

          {/* Month filter (YYYY-MM) */}
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-1/3 px-3 py-2 border border-[#A5D6A7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
          />

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition"
          >
            Clear Filters
          </button>
        </div>

        {/* ✅ Total Expenses */}
        <div className="mb-4 font-semibold text-lg text-[#2E7D32]">
          Total Expenses: Rs {totalExpenses.toFixed(2)}
        </div>

        {/* Salary Table */}
        <div className="overflow-x-auto shadow-md rounded-lg bg-white w-full">
          <table className="min-w-full border border-[#A5D6A7] rounded-lg">
            <thead className="bg-[#1B5E20] text-white">
              <tr>
                <th className="px-4 py-2">Employee ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Designation</th>
                <th className="px-4 py-2">Month</th>
                <th className="px-4 py-2">Basic Salary</th>
                <th className="px-4 py-2">Overtime</th>
                <th className="px-4 py-2">Bonus</th>
                <th className="px-4 py-2">Allowance</th>
                <th className="px-4 py-2">Deductions</th>
                <th className="px-4 py-2">Net Salary</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Updated At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#F9FAF9]">
              {filteredSalaries.length > 0 ? (
                filteredSalaries.map((sal, i) => (
                  <Salary key={i} sal={sal} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="13"
                    className="text-center py-4 text-gray-500 font-medium"
                  >
                    No salaries found
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

export default Paydetails;
