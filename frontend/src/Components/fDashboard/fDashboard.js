import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../fNav/fNav";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

function FinanceStats() {
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [profitData, setProfitData] = useState([]);

  // Fetch expenses
  useEffect(() => {
    axios
      .get("http://localhost:5000/expenses")
      .then((res) => {
        const allExpenses = res.data.expenses || [];
        setExpenses(allExpenses);
        const total = allExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        setTotalExpenses(total);
      })
      .catch((err) => console.error("Expenses fetch error:", err));
  }, []);

  // Fetch monthly profit/loss
  useEffect(() => {
    axios
      .get("http://localhost:5000/profits") // replace with your API endpoint
      .then((res) => {
        setProfitData(res.data || []);
      })
      .catch((err) => console.error("Profit fetch error:", err));
  }, []);

  const stat = {
    label: "Total Expenses",
    value: `Rs.${totalExpenses.toFixed(2)}`,
    bgColor: "bg-gradient-to-r from-red-200 to-red-400",
    textColor: "text-red-900",
    icon: "💸",
  };

  // Pie Chart Data
  const categoryTotals = expenses.reduce((acc, exp) => {
    const cat = exp.category || "Other";
    acc[cat] = (acc[cat] || 0) + (exp.amount || 0);
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#F87171", "#34D399", "#60A5FA", "#FBBF24", "#A78BFA", "#F472B6", "#FCD34D", "#4ADE80"
        ],
        borderWidth: 1,
      },
    ],
  };

  // Line Chart Data
  const sortedProfitData = [...profitData].sort((a, b) => (a.year - b.year) || (a.month - b.month));
  const lineData = {
    labels: sortedProfitData.map(item => `M${item.month}-${item.year}`),
    datasets: [
      {
        label: "Net Profit (Rs.)",
        data: sortedProfitData.map(item => item.netProfit),
        borderColor: "#34D399",
        backgroundColor: "rgba(52,211,153,0.2)",
        tension: 0.3,
      },
    ],
  };
  const lineOptions = {
    responsive: true,
    plugins: { legend: { position: "top" }, tooltip: { enabled: true } },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Net Profit (Rs.)" } },
      x: { title: { display: true, text: "Month-Year" } },
    },
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar/Nav */}
      <div className="w-64">
        <Nav />
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 flex flex-col items-center gap-10">
        {/* Total Expenses Card */}
        <div
          className={`flex items-center justify-between p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 w-full max-w-md ${stat.bgColor}`}
        >
          <div className="flex flex-col">
            <span className={`text-lg font-semibold ${stat.textColor}`}>{stat.label}</span>
            <span className={`text-3xl font-bold mt-2 ${stat.textColor}`}>{stat.value}</span>
          </div>
          <div className="text-5xl">{stat.icon}</div>
        </div>

        {/* Pie Chart */}
        <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg border border-red-200">
          <h3 className="text-xl font-bold text-red-700 mb-4 text-center">Expenses by Category</h3>
          <Pie data={pieData} />
        </div>

        {/* Line Chart */}
        <div className="max-w-3xl w-full p-6 bg-white shadow-md rounded-lg border border-green-200">
          <h3 className="text-xl font-bold text-green-700 mb-4 text-center">Monthly Net Profit</h3>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
}

export default FinanceStats;
