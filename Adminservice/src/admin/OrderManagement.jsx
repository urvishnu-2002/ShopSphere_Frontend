import React, { useEffect, useState } from 'react';
import { fetchAllOrders, fetchApprovedDeliveryAgents, assignDeliveryAgent } from '../api/axios';
import {
    Package, Truck, MapPin, User, Store, X, RefreshCw, ChevronDown, ChevronUp, Check
} from 'lucide-react';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpanded] = useState(null);
    const [assignModal, setAssignModal] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [assigning, setAssigning] = useState(false);
    const [toastMsg, setToastMsg] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToastMsg({ msg, type });
        setTimeout(() => setToastMsg(null), 3500);
    };

    const load = async () => {
        try {
            setLoading(true);
            const [ordersData, agentsData] = await Promise.all([
                fetchAllOrders(),
                fetchApprovedDeliveryAgents(),
            ]);

            const allOrders = Array.isArray(ordersData) ? ordersData : (ordersData.results || []);
            const allAgents = Array.isArray(agentsData) ? agentsData : (agentsData.results || []);

            // Filter: Show orders that are SHIPPED (Ready) OR Out for Delivery OR Delivered
            const relevantOrders = allOrders.filter(o => {
                if (o.status === 'cancelled') return false;

                // Show delivered orders
                if (o.status === 'delivered') return true;

                // 1. If it has a delivery agent, it's "Out for Delivery"
                if (o.delivery_agent) return true;

                // 2. If it's "Shipped" by vendor, it's "Ready to out for delivery"
                if (o.status === 'shipping' || o.status === 'shipped') return true;

                // Check Item Level (at least one item is shipped)
                if (o.items && o.items.some(i => i.vendor_status && (i.vendor_status.toLowerCase() === 'shipped' || i.vendor_status.toLowerCase() === 'out_for_delivery'))) {
                    return true;
                }

                return false;
            });

            setOrders(relevantOrders);
            setAgents(allAgents);
        } catch (e) {
            console.error(e);
            showToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleAssign = async () => {
        if (!selectedAgent) { showToast('Please select a delivery agent', 'error'); return; }
        setAssigning(true);
        try {
            await assignDeliveryAgent(assignModal.id, selectedAgent);
            showToast(`Agent assigned! Order #${assignModal.order_number} moved to "Out for Delivery".`);
            setAssignModal(null);
            setSelectedAgent('');
            load(); // Reload to remove the assigned order from list
        } catch (e) {
            console.error(e);
            showToast(e?.response?.data?.error || 'Failed to assign agent', 'error');
        } finally {
            setAssigning(false);
        }
    };

    const approvedAgents = agents.filter(a => a.approval_status === 'approved' && !a.is_blocked);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Toast */}
            {toastMsg && (
                <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-xl font-semibold text-sm ${toastMsg.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                    {toastMsg.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Order Dispatch</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Manage orders ready for dispatch and those out for delivery.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="bg-violet-100 text-violet-700 text-sm font-bold px-4 py-2 rounded-full">
                        {orders.length} ready
                    </span>
                    <button onClick={load} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <RefreshCw size={16} className="text-gray-500" />
                    </button>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <Package size={44} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-semibold text-gray-400">No orders ready for delivery</p>
                    <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                        Orders will appear here only when vendors mark items as <strong>"Shipped"</strong>.
                        Currently, all active orders are either processing, waiting, or already assigned.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => {
                        const isOpen = expandedOrder === order.id;
                        const dispatchItems = order.items?.filter(i =>
                            i.vendor_status?.toLowerCase() === 'shipped' ||
                            i.vendor_status?.toLowerCase() === 'out_for_delivery'
                        ) || [];
                        const itemCount = dispatchItems.length > 0 ? dispatchItems.length : order.items?.length;

                        return (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-violet-100 overflow-hidden">
                                {/* Collapsed Header */}
                                <button
                                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                                    onClick={() => setExpanded(isOpen ? null : order.id)}
                                >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center shrink-0 text-violet-600">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900">#{order.order_number}</span>
                                                {order.status === 'delivered' ? (
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                                                        <Check size={12} /> Delivered
                                                    </span>
                                                ) : order.delivery_agent ? (
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 flex items-center gap-1">
                                                        <Truck size={12} /> Out for Delivery
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                        Ready to Out for Delivery
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {order.customer} · {itemCount} item{itemCount !== 1 ? 's' : ''} shipped
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-gray-900">₹{order.total_amount}</span>
                                        {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                    </div>
                                </button>

                                {/* Expanded Details */}
                                {isOpen && (
                                    <div className="border-t border-gray-100 px-5 py-5 space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Addresses */}
                                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer</p>
                                                    <p className="font-bold text-gray-800">{order.customer}</p>
                                                    <p className="text-xs text-gray-500">{order.customer_email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Address</p>
                                                    <p className="font-semibold text-gray-800 text-sm">{order.delivery_city || 'City N/A'}</p>
                                                    <p className="text-xs text-gray-500 leading-relaxed">{order.delivery_address || 'No address'}</p>
                                                </div>
                                            </div>

                                            {/* Assign Action or Agent Info */}
                                            <div className={`${order.status === 'delivered' ? 'bg-emerald-50' : order.delivery_agent ? 'bg-amber-50' : 'bg-violet-50'} rounded-xl p-4 flex flex-col justify-center transition-colors`}>
                                                <div className={`flex items-center gap-2 mb-2 ${order.status === 'delivered' ? 'text-emerald-700' : order.delivery_agent ? 'text-amber-700' : 'text-violet-700'} font-bold text-sm`}>
                                                    {order.status === 'delivered' ? <Check size={16} /> : <Truck size={16} />}
                                                    <span>{order.status === 'delivered' ? 'Delivery Completed' : order.delivery_agent ? 'Delivery in Progress' : 'Assign Delivery Agent'}</span>
                                                </div>
                                                <p className={`text-xs ${order.status === 'delivered' ? 'text-emerald-600/80' : order.delivery_agent ? 'text-amber-600/80' : 'text-violet-600/80'} mb-3`}>
                                                    {order.status === 'delivered'
                                                        ? `Order has been successfully delivered by ${order.delivery_agent}.`
                                                        : order.delivery_agent
                                                            ? `Assigned to ${order.delivery_agent}. Item is currently with the delivery partner.`
                                                            : 'Vendor has shipped the item(s). Assign an agent to start delivery.'
                                                    }
                                                </p>
                                                {!order.delivery_agent ? (
                                                    <button
                                                        onClick={() => { setAssignModal(order); setSelectedAgent(''); }}
                                                        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                                                    >
                                                        Choose Agent
                                                    </button>
                                                ) : (
                                                    <div className={`flex items-center gap-2 px-4 py-2 bg-white rounded-lg border ${order.status === 'delivered' ? 'border-emerald-200' : 'border-amber-200'}`}>
                                                        <User size={14} className={order.status === 'delivered' ? 'text-emerald-500' : 'text-amber-500'} />
                                                        <span className={`text-xs font-bold ${order.status === 'delivered' ? 'text-emerald-700' : 'text-amber-700'}`}>{order.delivery_agent}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Items List */}
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Items Status</p>
                                            <div className="space-y-2">
                                                {order.items?.map((item, idx) => {
                                                    const isActive = item.vendor_status?.toLowerCase() === 'shipped' || item.vendor_status?.toLowerCase() === 'out_for_delivery';
                                                    return (
                                                        <div key={idx} className={`flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 ${!isActive ? 'opacity-50' : ''
                                                            }`}>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-white rounded border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                                    V{item.vendor_id}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-800">{item.product_name}</p>
                                                                    <p className="text-[10px] text-gray-500">
                                                                        Qty: {item.quantity} · Vendor: {item.vendor_name}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${item.vendor_status?.toLowerCase() === 'shipped'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : item.vendor_status?.toLowerCase() === 'out_for_delivery'
                                                                        ? 'bg-amber-100 text-amber-700'
                                                                        : 'bg-gray-200 text-gray-500'
                                                                    }`}>
                                                                    {item.vendor_status?.replace(/_/g, ' ')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {assignModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h3 className="font-bold text-lg text-gray-900">Assign Delivery Agent</h3>
                            <button onClick={() => setAssignModal(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={18} /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                Order <strong>#{assignModal.order_number}</strong> will be marked <strong>Out for Delivery</strong>.
                            </div>
                            <select
                                value={selectedAgent}
                                onChange={e => setSelectedAgent(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-300 outline-none bg-white"
                            >
                                <option value="">Select an agent...</option>
                                {approvedAgents.map(a => (
                                    <option key={a.id} value={a.id}>{a.username} ({a.city})</option>
                                ))}
                            </select>
                            {approvedAgents.length === 0 && (
                                <p className="text-xs text-red-500 font-bold">No approved delivery agents found.</p>
                            )}
                        </div>
                        <div className="flex gap-3 px-5 pb-5">
                            <button onClick={() => setAssignModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50">Cancel</button>
                            <button
                                onClick={handleAssign}
                                disabled={!selectedAgent || assigning}
                                className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 disabled:opacity-50"
                            >
                                {assigning ? 'Assigning...' : 'Assign & Dispatch'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
