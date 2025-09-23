import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import ExNav from "../ExNav/ExNav";

function UpdateExpense() {
  const [inputs, setInputs] = useState({
    date: "",
    expenseId: "",
    category: "",
    description: "",
    paymentMethod: "",
    amount: "",
  });

  const [purchases, setPurchases] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  const history = useNavigate();
  const { id } = useParams();

  // ✅ Fetch current expense by ID
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/expenses/${id}`);
        if (res.data && res.data.expenses) {
          setInputs(res.data.expenses);
        }
      } catch (err) {
        console.error("Error fetching expense:", err);
      }
    };
    fetchHandler();
  }, [id]);

  // ✅ Fetch purchases for Inventory auto-calculation
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get("http://localhost:5000/purchases");

        if (Array.isArray(res.data)) {
          setPurchases(res.data);
        } else if (Array.isArray(res.data.purchases)) {
          setPurchases(res.data.purchases);
        } else {
          console.error("Unexpected response format:", res.data);
        }
      } catch (err) {
        console.error("Error fetching purchases:", err);
      }
    };

    fetchPurchases();
  }, []);

  // ✅ Recalculate monthly total when date changes
  useEffect(() => {
    if (!inputs.date) {
      setMonthlyTotal(0);
      return;
    }

    const selectedDate = new Date(inputs.date);
    const selectedMonth = selectedDate.getMonth() + 1;
    const selectedYear = selectedDate.getFullYear();

    const total = purchases
      .filter((purchase) => {
        const purchaseDate = new Date(purchase.Purchase_date);
        return (
          purchaseDate.getMonth() + 1 === selectedMonth &&
          purchaseDate.getFullYear() === selectedYear
        );
      })
      .reduce((sum, purchase) => sum + purchase.Price, 0);

    setMonthlyTotal(total);
  }, [inputs.date, purchases]);

  const sendRequest = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/expenses/${id}`, {
        date: new Date(inputs.date),
        expenseId: String(inputs.expenseId),
        category: String(inputs.category),
        description: String(inputs.description),
        paymentMethod: String(inputs.paymentMethod),
        amount:
          inputs.category === "Inventory" ? Number(monthlyTotal) : Number(inputs.amount),
      });
      return res.data;
    } catch (err) {
      console.error("Error updating expense:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(() => history("/exdetails"));
  };

  return (
    <div className="flex">
      <ExNav />
      <div className="flex-1 ml-52 p-8">
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg border border-green-200">
          <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
            🍄 Update Mushroom Cultivation Expense
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Date */}
            <label className="flex flex-col text-green-800 font-medium">
              Date:
              <input
                type="date"
                name="date"
                required
                value={inputs.date ? inputs.date.slice(0, 10) : ""}
                onChange={handleChange}
                className="mt-1 p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </label>

            {/* Expense ID (read-only) */}
            <label className="flex flex-col text-green-800 font-medium">
              Expense ID:
              <input
                type="text"
                name="expenseId"
                placeholder="EXP12345"
                required
                value={inputs.expenseId || ""}
                readOnly
                className="mt-1 p-2 border border-green-300 rounded bg-gray-100 cursor-not-allowed"
              />
            </label>

            {/* Category */}
            <label className="flex flex-col text-green-800 font-medium">
              Category:
              <select
                name="category"
                value={inputs.category}
                onChange={handleChange}
                className="mt-1 p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">-- Select Category --</option>
                <option value="Spawn/Seeds">Spawn / Seeds</option>
                <option value="Equipment">Equipment</option>
                <option value="Labor">Labor</option>
                <option value="Utilities">Utilities</option>
                <option value="Packaging">Packaging</option>
                <option value="Transportation">Transportation</option>
                <option value="Inventory">Inventory</option>
                <option value="Other">Other</option>
              </select>
            </label>

            {/* Description */}
            <label className="flex flex-col text-green-800 font-medium">
              Description:
              <textarea
                name="description"
                placeholder="Optional notes about this expense"
                value={inputs.description || ""}
                onChange={handleChange}
                className="mt-1 p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </label>

            {/* Payment Method (hide if Inventory) */}
            {inputs.category !== "Inventory" && (
              <label className="flex flex-col text-green-800 font-medium">
                Payment Method:
                <select
                  name="paymentMethod"
                  required
                  value={inputs.paymentMethod || ""}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="">-- Select Method --</option>
                  <option value="cash">Cash</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="debit-card">Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank-transfer">Bank Transfer</option>
                </select>
              </label>
            )}

            {/* Amount */}
            <label className="flex flex-col text-green-800 font-medium">
              Amount:
              <input
                type="number"
                name="amount"
                placeholder="Enter amount"
                required
                value={
                  inputs.category === "Inventory" ? monthlyTotal : inputs.amount || ""
                }
                onChange={handleChange}
                readOnly={inputs.category === "Inventory"}
                className="mt-1 p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {inputs.category === "Inventory" && (
                <span className="text-sm text-gray-500 mt-1">
                  Auto-calculated from purchases of this month
                </span>
              )}
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="mt-4 p-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
            >
              Update Expense
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateExpense;
