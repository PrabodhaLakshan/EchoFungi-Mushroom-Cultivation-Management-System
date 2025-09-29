import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Nav";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const API = {
  sales: "http://localhost:5000/Sale",
  products: "http://localhost:5000/Product",
  orders: "http://localhost:5000/Order",
  customers: "http://localhost:5000/Customer",
};

const DATE_FORMAT_DAY = (d) => new Date(d).toISOString().slice(0, 10);

function sumBy(arr, keyFn) {
  return arr.reduce((acc, item) => acc + keyFn(item), 0);
}

// Aggregate sales for charts
function aggregateSalesByPeriod(sales, period = "daily") {
  const map = new Map();

  sales.forEach((s) => {
    const date = new Date(s.Date);
    if (isNaN(date)) return;

    let key;
    if (period === "daily") key = DATE_FORMAT_DAY(date);
    else if (period === "weekly") {
      const tmp = new Date(date.getTime());
      tmp.setDate(tmp.getDate() + 4 - (tmp.getDay() || 7));
      const yearStart = new Date(tmp.getFullYear(), 0, 1);
      const weekNo = Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
      key = `${tmp.getFullYear()}-W${String(weekNo).padStart(2, "0")}`;
    } else if (period === "monthly")
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    else if (period === "yearly") key = `${date.getFullYear()}`;
    else key = DATE_FORMAT_DAY(date);

    const qty = Number(s.NumberOfPackets || 0);
    const rev = Number(s.TotalPrice || 0);

    if (!map.has(key)) map.set(key, { qty: 0, rev: 0 });
    const cur = map.get(key);
    cur.qty += qty;
    cur.rev += rev;
    map.set(key, cur);
  });

  const entries = Array.from(map.entries()).sort((a, b) => new Date(a[0]) - new Date(b[0]));

  return {
    labels: entries.map((e) => e[0]),
    qtyData: entries.map((e) => e[1].qty),
    revData: entries.map((e) => e[1].rev),
  };
}

// Check if a date is in the current period
function isInCurrentPeriod(dateStr, period) {
  const date = new Date(dateStr);
  if (isNaN(date)) return false;

  const now = new Date();

  if (period === "daily") {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  } else if (period === "weekly") {
    const getWeek = (d) => {
      const tmp = new Date(d.getTime());
      tmp.setHours(0, 0, 0, 0);
      tmp.setDate(tmp.getDate() + 4 - (tmp.getDay() || 7));
      const yearStart = new Date(tmp.getFullYear(), 0, 1);
      return Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
    };
    return date.getFullYear() === now.getFullYear() && getWeek(date) === getWeek(now);
  } else if (period === "monthly") {
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  } else if (period === "yearly") {
    return date.getFullYear() === now.getFullYear();
  }

  return false;
}

export default function SalesDash() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [period, setPeriod] = useState("daily");
  const [topN] = useState(5);

  // Fetch all data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sRes, pRes, oRes, cRes] = await Promise.all([
          axios.get(API.sales),
          axios.get(API.products),
          axios.get(API.orders),
          axios.get(API.customers),
        ]);

        setSales(
          Array.isArray(sRes.data?.Sales || sRes.data?.sales || sRes.data)
            ? sRes.data?.Sales || sRes.data?.sales || sRes.data
            : []
        );
        setProducts(
          Array.isArray(pRes.data?.Products || pRes.data?.products || pRes.data)
            ? pRes.data?.Products || pRes.data?.products || pRes.data
            : []
        );

        const fetchedOrders = Array.isArray(oRes.data?.Orders || oRes.data?.orders || oRes.data)
          ? oRes.data?.Orders || oRes.data?.orders || oRes.data
          : [];
        setOrders(
          fetchedOrders.map((o) => ({
            ...o,
            Quantity: o.Quantity || o.NumberOfPackets || 0,
            ProductId: o.ProductId || o.Product || "Unknown",
            ShopName: o.ShopName || "Unknown",
            OrderId: o.OrderId || o.id || Math.random().toString(),
            Status: o.Status || "Pending",
          }))
        );

        setCustomers(
          Array.isArray(cRes.data?.Customers || cRes.data?.customers || cRes.data)
            ? cRes.data?.Customers || cRes.data?.customers || cRes.data
            : []
        );
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      }
    };

    fetchAll();
  }, []);

  // Filter current period sales & orders for summary cards
  const currentPeriodSales = useMemo(
    () => sales.filter((s) => isInCurrentPeriod(s.Date, period)),
    [sales, period]
  );

  const currentPeriodOrders = useMemo(
    () => orders.filter((o) => isInCurrentPeriod(o.OrderDate, period)),
    [orders, period]
  );

  // Summary metrics
  const totalRevenue = useMemo(
    () => sumBy(currentPeriodSales, (s) => Number(s.TotalPrice || 0)),
    [currentPeriodSales]
  );
  const totalSalesCount = useMemo(() => currentPeriodSales.length, [currentPeriodSales]);
  const totalOrders = useMemo(() => currentPeriodOrders.length, [currentPeriodOrders]);
  const totalCustomers = useMemo(() => {
    const uniqueCustomerIds = new Set(currentPeriodOrders.map((o) => o.CustomerId || o.ShopName));
    return uniqueCustomerIds.size;
  }, [currentPeriodOrders]);

  // Sales charts
  const { labels: timeLabels, qtyData: timeQty, revData: timeRev } = useMemo(
    () => aggregateSalesByPeriod(sales, period),
    [sales, period]
  );

  // Top products
  const topProducts = useMemo(() => {
    const map = new Map();
    sales.forEach((s) => {
      const pid = s.ProductId;
      const qty = Number(s.NumberOfPackets || 0);
      map.set(pid, (map.get(pid) || 0) + qty);
    });
    return Array.from(map.entries())
      .map(([pid, qty]) => {
        const prod = products.find((p) => p.ProductId === pid) || {};
        return { pid, name: prod.ProductName || `Product ${pid}`, qty };
      })
      .sort((a, b) => b.qty - a.qty)
      .slice(0, topN);
  }, [sales, products, topN]);

  const productDistribution = useMemo(() => {
    const map = new Map();
    sales.forEach((s) => {
      const pid = s.ProductId;
      const qty = Number(s.NumberOfPackets || 0);
      map.set(pid, (map.get(pid) || 0) + qty);
    });
    return Array.from(map.entries())
      .map(([pid, qty]) => {
        const prod = products.find((p) => p.ProductId === pid) || {};
        return { pid, name: prod.ProductName || `Product ${pid}`, qty };
      })
      .sort((a, b) => b.qty - a.qty);
  }, [sales, products]);

  // Orders status
  const ordersStatus = useMemo(() => {
    let pending = 0;
    let delivered = 0;
    orders.forEach((o) => {
      const status = (o.Status || "").toLowerCase();
      if (status === "pending") pending++;
      else if (status === "delivered") delivered++;
    });
    return { pending, delivered };
  }, [orders]);

  // Latest orders
  const latestOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate)).slice(0, 6),
    [orders]
  );

  // Charts data
  const timeSeriesData = {
    labels: timeLabels,
    datasets: [
      {
        type: "line",
        label: "Packets Sold",
        data: timeQty,
        tension: 0.3,
        borderColor: "#16A34A",
        backgroundColor: "rgba(16,163,74,0.08)",
        yAxisID: "y1",
      },
      {
        type: "bar",
        label: "Revenue",
        data: timeRev,
        backgroundColor: "#2563EB",
        yAxisID: "y",
      },
    ],
  };

  const timeSeriesOptions = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    stacked: false,
    scales: {
      x: { ticks: { maxRotation: 0, autoSkip: true } },
      y: { type: "linear", position: "left", title: { display: true, text: "Revenue" } },
      y1: { type: "linear", position: "right", grid: { drawOnChartArea: false }, title: { display: true, text: "Packets" } },
    },
  };

  const topProductsData = {
    labels: topProducts.map((p) => p.name),
    datasets: [
      {
        label: `Top ${topProducts.length} Products`,
        data: topProducts.map((p) => p.qty),
        backgroundColor: ["#06B6D4", "#F59E0B", "#EF4444", "#6366F1", "#16A34A"],
      },
    ],
  };

  const productPieData = {
    labels: productDistribution.map((p) => p.name),
    datasets: [
      {
        data: productDistribution.map((p) => p.qty),
        backgroundColor: ["#F97316", "#06B6D4", "#F59E0B", "#10B981", "#EF4444", "#6366F1"],
      },
    ],
  };

  const ordersPieData = {
    labels: ["Pending", "Delivered"],
    datasets: [{ data: [ordersStatus.pending, ordersStatus.delivered], backgroundColor: ["#F59E0B", "#10B981"] }],
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 bg-green-800 text-white fixed top-0 left-0 h-full shadow-lg">
        <Navbar />
      </div>

      <div className="flex-1 ml-64 p-6">
        <h2 className="text-3xl font-bold text-green-800 mb-6">Sales Manager Dashboard</h2>

        {/* Period toggle */}
        <div className="flex items-center gap-3 mb-4">
          {["daily", "weekly", "monthly", "yearly"].map((p) => (
            <button
              key={p}
              className={`px-3 py-1 rounded ${period === p ? "bg-green-700 text-white" : "bg-white border"}`}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
          <div className="ml-auto text-sm text-gray-600">
            Showing: <span className="font-medium">{period}</span>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-green-700">Rs {totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Sales Records</p>
            <p className="text-2xl font-bold text-green-700">{totalSalesCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-green-700">{totalOrders}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold text-green-700">{totalCustomers}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Sales Overview</h3>
            {timeLabels.length ? <Bar data={timeSeriesData} options={timeSeriesOptions} /> : <p className="text-gray-500">No sales data</p>}
          </div>

          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Orders Status</h3>
            <Pie data={ordersPieData} />
            <div className="mt-2 text-sm">
              <div>Pending: {ordersStatus.pending}</div>
              <div>Delivered: {ordersStatus.delivered}</div>
            </div>
          </div>

          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Top Products</h3>
            <Bar data={topProductsData} />
          </div>

          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Product Distribution</h3>
            <Pie data={productPieData} />
          </div>
        </div>

        {/* Latest Orders Table */}
        <div className="bg-white p-4 shadow rounded-lg overflow-x-auto">
          <h3 className="text-lg font-semibold mb-2">Latest Orders</h3>
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">Shop Name</th>
                <th className="px-4 py-2 border">Product</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Order Date</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((o) => (
                <tr key={o.OrderId}>
                  <td className="px-4 py-2 border">{o.OrderId}</td>
                  <td className="px-4 py-2 border">{o.ShopName}</td>
                  <td className="px-4 py-2 border">{o.ProductId}</td>
                  <td className="px-4 py-2 border">{o.Quantity}</td>
                  <td className="px-4 py-2 border">{o.OrderDate ? new Date(o.OrderDate).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-2 border">{o.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
