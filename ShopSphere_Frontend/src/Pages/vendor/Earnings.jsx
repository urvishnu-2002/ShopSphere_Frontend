import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Earnings() {

  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0
  });

  const [chart, setChart] = useState([]);

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const approved = products.filter(p => p.approved);

    const revenue = approved.reduce((sum, p) => sum + Number(p.price), 0);

    setStats({
      revenue,
      orders: approved.length
    });

    const data = approved.map((p, i) => ({
      name: p.name,
      value: p.price
    }));

    setChart(data);

  }, []);

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">Earnings</h1>

      {/* STATS */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-400 text-sm">Total Revenue</h3>
          <p className="text-2xl font-bold mt-2">₹{stats.revenue}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-gray-400 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold mt-2">{stats.orders}</p>
        </div>

      </div>

      {/* CHART */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <h2 className="font-bold mb-4">Revenue by Product</h2>

        <div className="h-64">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#000" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* WITHDRAW */}
      <button
        onClick={() => alert("Withdrawal successful (demo)")}
        className="bg-black text-white px-8 py-3 rounded-md font-semibold"
      >
        Withdraw Earnings
      </button>

    </div>
  );
}
