import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
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
import { Bar, Line, Pie } from "react-chartjs-2";
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
  stock: "http://localhost:5000/Stock",
  customers: "http://localhost:5000/Customer",
};

const DATE_FORMAT_DAY = (d) => {
  const dt = new Date(d);
  return dt.toISOString().slice(0, 10); // YYYY-MM-DD
};

function sumBy(arr, keyFn) {
  return arr.reduce((acc, item) => acc + keyFn(item), 0);
}

function aggregateSalesByPeriod(sales, period = "daily") {
  const map = new Map();

  sales.forEach((s) => {
    const date = new Date(s.Date);
    if (isNaN(date)) return;

    let key;
    if (period === "daily") {
      key = DATE_FORMAT_DAY(date);
    } else if (period === "weekly") {
      const tmp = new Date(date.getTime());
      tmp.setDate(tmp.getDate() + 4 - (tmp.getDay() || 7));
      const yearStart = new Date(tmp.getFullYear(), 0, 1);
      const weekNo = Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
      key = `${tmp.getFullYear()}-W${String(weekNo).padStart(2, "0")}`;
    } else if (period === "monthly") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    } else {
      key = DATE_FORMAT_DAY(date);
    }

    const qty = Number(s.NumberOfPackets || 0);
    const rev = Number(s.TotalPrice || 0);

    if (!map.has(key)) map.set(key, { qty: 0, rev: 0 });
    const cur = map.get(key);
    cur.qty += qty;
    cur.rev += rev;
    map.set(key, cur);
  });

  const entries = Array.from(map.entries()).sort((a, b) => {
    const parseKeyToDate = (k) => {
      if (k.includes("-W")) {
        const [y, w] = k.split("-W");
        return new Date(Number(y), 0, 1 + (Number(w) - 1) * 7);
      }
      if (k.match(/^\d{4}-\d{2}$/)) {
        const [y, m] = k.split("-");
        return new Date(Number(y), Number(m) - 1, 1);
      }
      return new Date(k);
    };
    return parseKeyToDate(a[0]) - parseKeyToDate(b[0]);
  });

  return {
    labels: entries.map((e) => e[0]),
    qtyData: entries.map((e) => e[1].qty),
    revData: entries.map((e) => e[1].rev),
  };
}

export default function SalesDash() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [period, setPeriod] = useState("daily");
  const [topN] = useState(5);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sRes, pRes, oRes, cRes] = await Promise.all([
          axios.get(API.sales),
          axios.get(API.products),
          axios.get(API.orders),
          axios.get(API.customers),
        ]);

        setSales(Array.isArray(sRes.data?.Sales || sRes.data?.sales || sRes.data) ? sRes.data?.Sales || sRes.data?.sales || sRes.data : []);
        setProducts(Array.isArray(pRes.data?.Products || pRes.data?.products || pRes.data) ? pRes.data?.Products || pRes.data?.products || pRes.data : []);
        setOrders(Array.isArray(oRes.data?.Orders || oRes.data?.orders || oRes.data) ? oRes.data?.Orders || oRes.data?.orders || oRes.data : []);
        setCustomers(Array.isArray(cRes.data?.Customers || cRes.data?.customers || cRes.data) ? cRes.data?.Customers || cRes.data?.customers || cRes.data : []);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      }
    };

    fetchAll();
  }, []);

  const totalRevenue = useMemo(() => sumBy(sales, (s) => Number(s.TotalPrice || 0)), [sales]);
  const totalSalesCount = sales.length;
  const totalOrders = orders.length;
  const totalCustomers = customers.length;

  const { labels: timeLabels, qtyData: timeQty, revData: timeRev } = useMemo(
    () => aggregateSalesByPeriod(sales, period),
    [sales, period]
  );

  const topProducts = useMemo(() => {
    const map = new Map();
    sales.forEach((s) => {
      const pid = s.ProductId;
      const qty = Number(s.NumberOfPackets || 0);
      map.set(pid, (map.get(pid) || 0) + qty);
    });
    const arr = Array.from(map.entries()).map(([pid, qty]) => {
      const prod = products.find((p) => p.ProductId === pid) || {};
      return { pid, name: prod.ProductName || `Product ${pid}`, qty };
    });
    arr.sort((a, b) => b.qty - a.qty);
    return arr.slice(0, topN);
  }, [sales, products, topN]);

  const productDistribution = useMemo(() => {
    const map = new Map();
    sales.forEach((s) => {
      const pid = s.ProductId;
      const qty = Number(s.NumberOfPackets || 0);
      map.set(pid, (map.get(pid) || 0) + qty);
    });
    const arr = Array.from(map.entries()).map(([pid, qty]) => {
      const prod = products.find((p) => p.ProductId === pid) || {};
      return { pid, name: prod.ProductName || `Product ${pid}`, qty };
    });
    arr.sort((a, b) => b.qty - a.qty);
    return arr;
  }, [sales, products]);

  const ordersStatus = useMemo(() => {
    const pending = orders.filter((o) => (o.Status || "").toLowerCase() === "pending").length;
    const delivered = orders.filter((o) => (o.Status || "").toLowerCase() === "delivered").length;
    return { pending, delivered };
  }, [orders]);

  const latestOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate)).slice(0, 6);
  }, [orders]);

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
        label: `Top ${topProducts.length} Products (packets)`,
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
    datasets: [
      {
        data: [ordersStatus.pending, ordersStatus.delivered],
        backgroundColor: ["#F59E0B", "#10B981"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-green-800 mb-6">Sales Manager Dashboard</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-green-700">Rs {totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">From all sales</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Sales Records</p>
          <p className="text-2xl font-bold text-green-700">{totalSalesCount}</p>
          <p className="text-xs text-gray-400 mt-1">Records in Sale table</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-green-700">{totalOrders}</p>
          <p className="text-xs text-gray-400 mt-1">Orders (pending/delivered)</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Customers</p>
          <p className="text-2xl font-bold text-green-700">{totalCustomers}</p>
          <p className="text-xs text-gray-400 mt-1">Registered Customers</p>
        </div>
      </div>

      {/* Period toggle */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded ${period === "daily" ? "bg-green-700 text-white" : "bg-white border"}`}
            onClick={() => setPeriod("daily")}
          >
            Daily
          </button>
          <button
            className={`px-3 py-1 rounded ${period === "weekly" ? "bg-green-700 text-white" : "bg-white border"}`}
            onClick={() => setPeriod("weekly")}
          >
            Weekly
          </button>
          <button
            className={`px-3 py-1 rounded ${period === "monthly" ? "bg-green-700 text-white" : "bg-white border"}`}
            onClick={() => setPeriod("monthly")}
          >
            Monthly
          </button>
        </div>

        <div className="ml-auto text-sm text-gray-600">
          Showing: <span className="font-medium">{period}</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Sales (Revenue & Packets)</h3>
          {timeLabels.length ? <Line data={timeSeriesData} options={timeSeriesOptions} /> : <p className="text-gray-500">No sales data available</p>}
        </div>

        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Orders Status</h3>
          <div className="max-w-xs">
            <Pie data={ordersPieData} />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <div>Pending: <strong>{ordersStatus.pending}</strong></div>
            <div>Delivered: <strong>{ordersStatus.delivered}</strong></div>
          </div>
        </div>

        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Top {topProducts.length} Selling Products</h3>
          {topProducts.length ? <Bar data={topProductsData} /> : <p className="text-gray-500">No product sales yet</p>}
        </div>

        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Product-wise Sales (Packets)</h3>
          {productDistribution.length ? <Pie data={productPieData} /> : <p className="text-gray-500">No distribution data</p>}
        </div>
      </div>

      {/* Latest Orders */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Latest Orders</h3>
        {latestOrders.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-3 text-sm">Order ID</th>
                  <th className="py-2 px-3 text-sm">Shop</th>
                  <th className="py-2 px-3 text-sm">ProductId</th>
                  <th className="py-2 px-3 text-sm">Qty</th>
                  <th className="py-2 px-3 text-sm">Order Date</th>
                  <th className="py-2 px-3 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {latestOrders.map((o) => (
                  <tr key={o.OrderId} className="border-b">
                    <td className="py-2 px-3 text-sm">{o.OrderId}</td>
                    <td className="py-2 px-3 text-sm">{o.ShopName}</td>
                    <td className="py-2 px-3 text-sm">{o.ProductId}</td>
                    <td className="py-2 px-3 text-sm">{o.Quantity}</td>
                    <td className="py-2 px-3 text-sm">{o.OrderDate ? new Date(o.OrderDate).toLocaleDateString() : "-"}</td>
                    <td className="py-2 px-3 text-sm">{o.Status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No recent orders</p>
        )}
      </div>
    </div>
  );
}
