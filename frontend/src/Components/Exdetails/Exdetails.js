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
  const [selectedMonth, setSelectedMonth] = useState(""); // month filter
  const [selectedCategory, setSelectedCategory] = useState(""); // category filter
  const [searchId, setSearchId] = useState(""); // expenseId search

  useEffect(() => {
    fetchHandler().then((data) => setExpense(data.expenses));
  }, []);

  // ✅ First table (all expenses + search only)
  const searchedExpenses = expenses.filter((ex) => {
    return searchId
      ? String(ex.expenseId).includes(searchId.trim())
      : true;
  });

  // ✅ Second table (month + category filters only)
  const filteredExpenses = expenses.filter((ex) => {
    const exDate = new Date(ex.date);

    const matchesMonth = selectedMonth
      ? `${exDate.getFullYear()}-${String(exDate.getMonth() + 1).padStart(
          2,
          "0"
        )}` === selectedMonth
      : true;

    const matchesCategory = selectedCategory
      ? ex.category === selectedCategory
      : true;

    return matchesMonth && matchesCategory;
  });

  // ✅ Calculate total for filtered expenses (only second table)
  const totalExpense = filteredExpenses.reduce(
    (sum, ex) => sum + Number(ex.amount),
    0
  );

  // ✅ Reset filters
  const clearFilters = () => {
    setSelectedMonth("");
    setSelectedCategory("");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <ExNav />

      {/* Main content */}
      <div className="flex-1 bg-[#F9FAF9] p-6 min-h-screen ml-52">
        <h1 className="text-2xl font-bold text-[#1B5E20] text-center mb-6">
          Expenses Details
        </h1>

        {/* 🔎 Search by Expense ID */}
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            placeholder="Search by Expense ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-1/3 px-3 py-2 border border-[#A5D6A7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
          />
        </div>

        {/* All Expenses Table (Search Only) */}
        <div className="overflow-x-auto shadow-md rounded-lg bg-white mb-10">
          <table className="min-w-full border border-[#A5D6A7] rounded-lg">
            <thead className="bg-[#1B5E20] text-white">
            <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Expense ID</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Payment Method</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Actions</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">
              {searchedExpenses.length > 0 ? (
                searchedExpenses.map((ex, i) => (
                  <Exp
                    key={i}
                    ex={ex}
                    onDelete={(id) =>
                      setExpense((prev) => prev.filter((e) => e._id !== id))
                    }
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4">
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#1B5E20] mb-4">
            Filter Expenses
          </h2>

          <div className="flex gap-4 mb-4">
            {/* Month Picker */}
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-green-400 rounded p-2"
            />

            {/* Category Picker */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-green-400 rounded p-2"
            >
              <option value="">-- All Categories --</option>
              <option value="Utilities">Utilities</option>
              <option value="Maintenance & Repairs">
                Maintenance & Repairs
              </option>
              <option value="Transportation">Transportation</option>
              <option value="Inventory">Inventory</option>
              <option value="Other">Other</option>
            </select>

            {/* ✅ Clear Filters Button */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Clear Filters
            </button>
          </div>

          {/* Filtered Table (Month + Category Only) */}
          {(selectedMonth || selectedCategory) && (
            <>
              <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full border border-[#A5D6A7] rounded-lg">
                  <thead className="bg-[#388E3C] text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Expense ID</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Payment Method</th>
                    <th className="px-4 py-2 text-left">Amount</th>
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
                          No expenses found for this filter.
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
