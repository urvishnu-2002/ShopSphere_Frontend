import React, { useEffect, useState } from "react";
import { fetchAdminOrders, adminUpdateOrderStatus, adminAssignDelivery, fetchAdminDeliveryAgents } from "../../api/vendor_axios";
import { toast } from "react-hot-toast";
import { Package, Truck, MapPin, User, Phone, Store, ChevronDown, ChevronUp, X } from "lucide-react";

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-700",
    waiting: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    shipping: "bg-purple-100 text-purple-700",
    out_for_delivery: "bg-orange-100 text-orange-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
    pending: "Pending",
    waiting: "Waiting",
    confirmed: "Confirmed",
    shipped: "Shipped",
    shipping: "Shipping",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

const ITEM_STATUS_OPTIONS = ["waiting", "confirmed", "shipped", "out_for_delivery", "delivered", "cancelled"];

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [agents, setAgents] = useState([]);
    const [expandedOrder, setExpanded] = useState(null);
    const [assignModal, setAssignModal] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState("");
    const [assigning, setAssigning] = useState(false);
    const [filter, setFilter] = useState("all");

    const load = async () => {
        try {
            setLoading(true);
            const [ordersData, agentsData] = await Promise.all([
                fetchAdminOrders(),
                fetchAdminDeliveryAgents(),
            ]);
            setOrders(ordersData.results || ordersData || []);
            setAgents(agentsData.results || agentsData || []);
        } catch {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleItemStatus = async (itemId, newStatus) => {
        try {
            await adminUpdateOrderStatus(itemId, newStatus);
            toast.success(`Status updated to: ${STATUS_LABELS[newStatus] || newStatus}`);
            load();
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleAssign = async () => {
        if (!selectedAgent) { toast.error("Please select an agent"); return; }
        setAssigning(true);
        try {
            await adminAssignDelivery(assignModal, selectedAgent);
            toast.success("Agent assigned! Order is now Out for Delivery.");
            setAssignModal(null);
            setSelectedAgent("");
            load();
        } catch {
            toast.error("Failed to assign agent");
        } finally {
            setAssigning(false);
        }
    };

    const filteredOrders = filter === "all"
        ? orders
        : orders.filter(o => o.status === filter || o.status === filter.replace("pending", "waiting"));

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Orders</h1>
                    <p className="text-sm text-gray-500 mt-0.5">View details, assign delivery agents</p>
                </div>
                <span className="bg-indigo-50 text-indigo-700 text-sm font-bold px-4 py-2 rounded-full">
                    {orders.length} total
                </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
                {["all", "pending", "confirmed", "shipping", "delivered", "cancelled"].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all capitalize ${filter === s
                                ? "bg-gray-900 text-white shadow"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {s === "all" ? "All Orders" : s}
                    </button>
                ))}
            </div>

            {/* Orders */}
            <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl text-gray-400">
                        <Package size={44} className="mx-auto mb-3 opacity-30" />
                        <p className="font-semibold">No orders found</p>
                    </div>
                ) : filteredOrders.map(order => {
                    const isOpen = expandedOrder === order.id;
                    const statusColor = STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600";

                    return (
                        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Collapsed Row — always visible */}
                            <button
                                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                                onClick={() => setExpanded(isOpen ? null : order.id)}
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                                        <Package size={18} className="text-indigo-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-bold text-gray-900">#{order.order_number}</span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${statusColor}`}>
                                                {STATUS_LABELS[order.status] || order.status}
                                            </span>
                                            {order.delivery_agent && (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700">
                                                    🚚 {order.delivery_agent}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-0.5 truncate">
                                            {order.customer} · {order.customer_email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 shrink-0 ml-4">
                                    <span className="font-black text-gray-900">₹{order.total_amount}</span>
                                    {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                </div>
                            </button>

                            {/* Expanded Details */}
                            {isOpen && (
                                <div className="border-t border-gray-100 px-5 py-5 space-y-5">

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {/* Customer */}
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <User size={14} className="text-gray-400" />
                                                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Customer</span>
                                            </div>
                                            <p className="font-bold text-gray-800">{order.customer}</p>
                                            <p className="text-sm text-gray-500">{order.customer_email}</p>
                                            <p className="text-xs text-gray-400 mt-1">{order.payment_method} · {order.payment_status}</p>
                                        </div>

                                        {/* Delivery Address */}
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MapPin size={14} className="text-gray-400" />
                                                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Delivery Address</span>
                                            </div>
                                            <p className="font-bold text-gray-800">{order.delivery_city || "—"}</p>
                                            <p className="text-sm text-gray-500 leading-relaxed">{order.delivery_address || "No address on file"}</p>
                                        </div>

                                        {/* Delivery Agent */}
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Truck size={14} className="text-gray-400" />
                                                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Delivery Agent</span>
                                            </div>
                                            {order.delivery_agent ? (
                                                <p className="font-bold text-teal-700">{order.delivery_agent}</p>
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">Not assigned yet</p>
                                            )}
                                            {order.status !== "delivered" && order.status !== "cancelled" && (
                                                <button
                                                    onClick={() => { setAssignModal(order.id); setSelectedAgent(""); }}
                                                    className="mt-3 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                                                >
                                                    <Truck size={13} />
                                                    {order.delivery_agent ? "Reassign Agent" : "Assign Agent"}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Order Items</p>
                                        <div className="space-y-2">
                                            {order.items?.map(item => (
                                                <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                                                            <Store size={14} className="text-gray-400" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-gray-800 truncate">{item.product_name}</p>
                                                            <p className="text-xs text-gray-400">
                                                                Qty: {item.quantity} · Vendor: <span className="font-semibold text-gray-600">{item.vendor_name}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0 ml-3">
                                                        <span className="font-bold text-gray-700">₹{item.subtotal}</span>
                                                        <select
                                                            value={item.vendor_status}
                                                            onChange={e => handleItemStatus(item.id, e.target.value)}
                                                            className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-300 ${STATUS_COLORS[item.vendor_status] || "bg-gray-100 text-gray-600"}`}
                                                        >
                                                            {ITEM_STATUS_OPTIONS.map(s => (
                                                                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Date */}
                                    <p className="text-xs text-gray-400 text-right">
                                        Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Assign Agent Modal */}
            {assignModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h3 className="font-black text-xl text-gray-900">Assign Delivery Agent</h3>
                                <p className="text-sm text-gray-500 mt-0.5">Order will move to "Out for Delivery"</p>
                            </div>
                            <button onClick={() => setAssignModal(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Select Agent</label>
                            <select
                                value={selectedAgent}
                                onChange={e => setSelectedAgent(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-300 outline-none bg-gray-50"
                            >
                                <option value="">-- Choose a delivery agent --</option>
                                {agents
                                    .filter(a => a.approval_status === "approved" && !a.is_blocked)
                                    .map(a => (
                                        <option key={a.id} value={a.id}>
                                            {a.username || a.name} · {a.vehicle_type || "Vehicle N/A"} · {a.city || "City N/A"}
                                        </option>
                                    ))
                                }
                            </select>
                            {agents.filter(a => a.approval_status === "approved" && !a.is_blocked).length === 0 && (
                                <p className="text-sm text-red-500 mt-2 font-medium">⚠ No approved delivery agents available.</p>
                            )}
                        </div>
                        <div className="flex gap-3 px-6 pb-6">
                            <button
                                onClick={() => setAssignModal(null)}
                                className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssign}
                                disabled={assigning || !selectedAgent}
                                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                            >
                                {assigning
                                    ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                    : <Truck size={16} />
                                }
                                Assign & Dispatch
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
