import React, { useState, useEffect } from "react";
import axios from "axios";
import ExNav from "../ExNav/ExNav";
import Exp from "../Exp/Exp";

const URL = "http://localhost:5000/expenses";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Exdetails() {
  const [expenses, setExpense] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(""); // for month filter

  useEffect(() => {
    fetchHandler().then((data) => setExpense(data.expenses));
  }, []);

  // Filter by month
  const filteredExpenses = selectedMonth
    ? expenses.filter((ex) => {
        const exDate = new Date(ex.date);
        const monthYear = `${exDate.getFullYear()}-${String(
          exDate.getMonth() + 1
        ).padStart(2, "0")}`;
        return monthYear === selectedMonth;
      })
    : [];

  // Calculate total for filtered expenses
  const totalExpense = filteredExpenses.reduce(
    (sum, ex) => sum + Number(ex.amount),
    0
  );

  return (
    <div className="flex">
      {/* Sidebar */}
      <ExNav />

      {/* Main content */}
      <div className="flex-1 bg-[#F9FAF9] p-6 min-h-screen ml-52">
        <h1 className="text-2xl font-bold text-[#1B5E20] text-center mb-6">
          Expenses Details
        </h1>

        {/* All Expenses Table */}
        <div className="overflow-x-auto shadow-md rounded-lg bg-white mb-10">
          <table className="min-w-full border border-[#A5D6A7] rounded-lg">
            <thead className="bg-[#1B5E20] text-white">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Expense ID</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Payment Method</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">
              {expenses && expenses.map((ex, i) => <Exp key={i} ex={ex} />)}
            </tbody>
          </table>
        </div>

        {/* Filter by Month */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#1B5E20] mb-4">
            Filter by Month
          </h2>

          {/* Month Picker */}
          <div className="mb-4">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-green-400 rounded p-2"
            />
          </div>

          {/* Filtered Table */}
          {selectedMonth && (
            <>
              <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full border border-[#A5D6A7] rounded-lg">
                  <thead className="bg-[#388E3C] text-white">
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Expense ID</th>
                      <th className="px-4 py-2">Category</th>
                      <th className="px-4 py-2">Description</th>
                      <th className="px-4 py-2">Payment Method</th>
                      <th className="px-4 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-green-200">
                    {filteredExpenses.length > 0 ? (
                      filteredExpenses.map((ex, i) => (
                        <tr
                          key={i}
                          className="hover:bg-[#A5D6A7] transition border-b border-green-200"
                        >
                          <td className="px-4 py-2">
                            {new Date(ex.date).toISOString().split("T")[0]}
                          </td>
                          <td className="px-4 py-2">{ex.expenseId}</td>
                          <td className="px-4 py-2">{ex.category}</td>
                          <td className="px-4 py-2">{ex.description}</td>
                          <td className="px-4 py-2">{ex.paymentMethod}</td>
                          <td className="px-4 py-2">Rs. {ex.amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center text-gray-500 py-4"
                        >
                          No expenses found for this month.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total Expense */}
              <div className="mt-4 text-right font-semibold text-lg text-[#1B5E20]">
                Total Expense: Rs. {totalExpense.toFixed(2)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Exdetails;
