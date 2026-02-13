import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {

  const [stats, setStats] = useState({});
  const [salesChart, setSalesChart] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {

    const products = JSON.parse(localStorage.getItem("products")) || [];
    const approved = products.filter(p => p.approved);

    const revenue = approved.reduce((sum, p) => sum + Number(p.price), 0);

    setStats({
      revenue: revenue.toFixed(2),
      products: products.length,
      orders: approved.length,
      avg: approved.length ? (revenue / approved.length).toFixed(2) : 0
    });

    // Fake Monthly Sales
    setSalesChart([
      { month: "Jan", sales: 1200 },
      { month: "Feb", sales: 950 },
      { month: "Mar", sales: 1800 },
      { month: "Apr", sales: 1600 },
      { month: "May", sales: revenue },
      { month: "Jun", sales: revenue - 300 }
    ]);

    // Recent Orders
    setRecentOrders(
      approved.slice(-3).map((p, i) => ({
        id: `ORD00${i + 1}`,
        name: "Customer",
        amount: p.price,
        status: "Shipped"
      }))
    );

  }, []);

  return (
    <div>
      

      {/* WELCOME */}
      <div className="  p-6 flex justify-between items-center mb-10">

        <div>
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-gray-400 mt-1">
            Here's what's happening with your store today.
          </p>
        </div>

      </div>

      {/* KPI CARDS */}
      <div className="grid lg:grid-cols-4 gap-6 mb-10">

        <Card title="Total Revenue" value={`₹${stats.revenue}`} />
        <Card title="Total Products" value={stats.products} />
        <Card title="Total Orders" value={stats.orders} />
        <Card title="Avg Order Value" value={`₹${stats.avg}`} />

      </div>

      {/* SALES OVERVIEW */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">

        <h2 className="font-bold mb-4">Sales Overview</h2>

        <ResponsiveContainer height={280}>
          <LineChart data={salesChart}>
            <XAxis dataKey="month"/>
            <YAxis/>
            <Tooltip/>
            <Line dataKey="sales" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>

      </div>

      {/* RECENT ORDERS (CARD STYLE LIKE IMAGE) */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="font-bold mb-6">Recent Orders</h2>

        <div className="space-y-4">

          {recentOrders.map(order => (

            <div
              key={order.id}
              className="flex justify-between items-center border rounded-lg p-4"
            >

              <div>
                <p className="font-semibold">{order.id}</p>
                <p className="text-sm text-gray-400">{order.name}</p>
              </div>

              <div className="text-right">
                <p className="font-semibold">₹{order.amount}</p>

                <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
                  {order.status}
                </span>
              </div>

            </div>

          ))}

          {recentOrders.length === 0 && (
            <p className="text-center text-gray-400">No orders yet.</p>
          )}

        </div>

      </div>

    </div>
  );
}

/* KPI CARD */

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}
