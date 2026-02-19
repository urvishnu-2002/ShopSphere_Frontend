import React, { useEffect, useState } from "react";
import { fetchVendorOrders, updateOrderItemStatus } from "../../api/vendor_axios";
import { toast } from "react-hot-toast";
import { Package, Clock, CheckCircle, Truck, MapPin, XCircle, ChevronDown } from "lucide-react";

const STATUS_FLOW = {
  waiting: { label: "Wait", color: "bg-yellow-100 text-yellow-700", next: "confirmed", nextLabel: "Accept Order" },
  confirmed: { label: "Order Confirmed", color: "bg-blue-100 text-blue-700", next: "shipped", nextLabel: "Mark Shipped" },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-700", next: null, nextLabel: null },
  out_for_delivery: { label: "Out for Delivery", color: "bg-orange-100 text-orange-700", next: null, nextLabel: null },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700", next: null, nextLabel: null },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", next: null, nextLabel: null },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_FLOW[status] || { label: status, color: "bg-gray-100 text-gray-600" };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchVendorOrders();
      setOrders(data.results || data || []);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatusUpdate = async (itemId, newStatus) => {
    setUpdatingId(itemId);
    try {
      await updateOrderItemStatus(itemId, newStatus);
      toast.success(`Status updated to: ${STATUS_FLOW[newStatus]?.label || newStatus}`);
      loadOrders();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = filter === "all"
    ? orders
    : orders.filter(o => o.vendor_status === filter);

  const counts = {};
  orders.forEach(o => {
    counts[o.vendor_status] = (counts[o.vendor_status] || 0) + 1;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <span className="text-sm text-gray-500">{orders.length} total orders</span>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {["all", "waiting", "confirmed", "shipped", "out_for_delivery", "delivered", "cancelled"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === s
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {s === "all" ? "All" : STATUS_FLOW[s]?.label || s}
            {s !== "all" && counts[s] ? (
              <span className="ml-1.5 bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                {counts[s]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Package size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map(order => {
                  const cfg = STATUS_FLOW[order.vendor_status];
                  const isUpdating = updatingId === order.id;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">#{order.order_number}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{order.product}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">₹{order.total}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.vendor_status} />
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4">
                        {cfg?.next ? (
                          <button
                            onClick={() => handleStatusUpdate(order.id, cfg.next)}
                            disabled={isUpdating}
                            className="bg-gray-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {isUpdating ? (
                              <span className="animate-spin rounded-full h-3 w-3 border-b border-white"></span>
                            ) : (
                              <CheckCircle size={13} />
                            )}
                            {cfg.nextLabel}
                          </button>
                        ) : order.vendor_status === "waiting" ? null : (
                          <span className="text-xs text-gray-400 italic">
                            {order.vendor_status === "out_for_delivery" ? "Awaiting delivery" :
                              order.vendor_status === "delivered" ? "Completed ✓" :
                                order.vendor_status === "cancelled" ? "Cancelled" : "—"}
                          </span>
                        )}
                        {order.vendor_status === "waiting" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusUpdate(order.id, "confirmed")}
                              disabled={isUpdating}
                              className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                              <CheckCircle size={13} /> Accept
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(order.id, "cancelled")}
                              disabled={isUpdating}
                              className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                              <XCircle size={13} /> Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
