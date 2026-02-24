import { useEffect, useState } from "react";
import { getVendorOrders, updateVendorOrderItemStatus, API_BASE_URL } from "../../api/vendor_axios";
import {
  FaShoppingCart,
  FaEye,
  FaTimes,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCalendarAlt,
  FaBox,
  FaFileInvoice,
  FaDownload
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

export default function Orders() {
  const { isDarkMode } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getVendorOrders();
        setOrders(Array.isArray(data) ? data : (data.results || []));
      } catch (error) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleGetInvoice = async (orderNumber) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/vendor/orders/invoice/${orderNumber}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText || "Failed to fetch invoice");
      }

      const blob = new Blob([responseText], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${orderNumber}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Invoice downloaded");
    } catch (error) {
      toast.error("Failed to download invoice");
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      await updateVendorOrderItemStatus(selectedOrder.id, newStatus);
      toast.success("Order status updated");
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      received: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      processing: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      shipped: "bg-blue-400/10 text-purple-400 border-blue-400/20",
      picked: "bg-teal-400/10 text-indigo-400 border-teal-400/20",
      delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/20"
    };
    return (
      <span className={`px-4 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-widest border ${colors[status] || colors.received}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] transition-colors duration-300 ${isDarkMode ? 'bg-transparent' : 'bg-transparent'}`}>
        <div className={`w-12 h-12 border-4 rounded-full animate-spin mb-4 ${isDarkMode ? 'border-slate-800 border-t-teal-400' : 'border-slate-200 border-t-teal-500'}`}></div>
        <p className={`text-[10px] font-semibold uppercase tracking-normal ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Checking orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10 font-['Inter']">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-semibold tracking-normal flex items-center gap-4  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-teal-400/20">
              <FaShoppingCart size={20} />
            </div>
            My Orders
          </h1>
          <p className="text-[10px] font-semibold uppercase tracking-normal text-gray-500 mt-3 ml-1">
            Active requests: {orders.length}
          </p>
        </div>
      </header>

      {/* ORDERS TABLE */}
      <div className={`rounded-[32px] md:rounded-[40px] border shadow-2xl overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className={`border-b transition-colors ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <th className="px-8 py-6 text-[10px] font-semibold text-gray-500 uppercase tracking-normal">Order ID</th>
                <th className="px-8 py-6 text-[10px] font-semibold text-gray-500 uppercase tracking-normal">Item</th>
                <th className="px-8 py-6 text-[10px] font-semibold text-gray-500 uppercase tracking-normal">Earnings</th>
                <th className="px-8 py-6 text-[10px] font-semibold text-gray-500 uppercase tracking-normal">State</th>
                <th className="px-8 py-6 text-[10px] font-semibold text-gray-500 uppercase tracking-normal">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors ${isDarkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
              {orders.map((order) => (
                <tr key={order.id} className={`transition-colors group ${isDarkMode ? 'hover:bg-slate-900' : 'hover:bg-slate-50'}`}>
                  <td className="px-8 py-6">
                    <p className={`font-semibold tracking-normal  uppercase text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>#{order.order_number}</p>
                    <p className="text-[9px] text-gray-500 mt-1 uppercase font-bold">{order.created_at?.split('T')[0]}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-[#020617] border-slate-800 text-gray-400 group-hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:text-teal-500'}`}>
                        <FaBox size={16} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold  uppercase truncate max-w-[150px] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{order.product}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-widest">Qty: {order.quantity}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-semibold text-indigo-400 ">₹{order.price * order.quantity}</p>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className={`p-3 rounded-xl transition-all border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-gray-400 hover:bg-teal-500 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:bg-teal-500 hover:text-white shadow-sm'}`}
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        onClick={() => handleGetInvoice(order.order_number)}
                        className={`p-3 rounded-xl transition-all border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-gray-400 hover:bg-emerald-500 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:bg-emerald-500 hover:text-white shadow-sm'}`}
                        title="Get Invoice"
                      >
                        <FaDownload size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAIL MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#020617]/90 backdrop-blur-xl" onClick={() => setSelectedOrder(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`rounded-[32px] md:rounded-[56px] w-full max-w-2xl border shadow-3xl overflow-hidden ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100'}`}
              onClick={e => e.stopPropagation()}
            >
              <div className={`p-8 md:p-10 border-b flex items-center justify-between ${isDarkMode ? 'bg-[#020617] border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-teal-400/20">
                    <FaShoppingCart size={18} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold  uppercase tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Order Details</h3>
                    <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-normal mt-1">ID: #{selectedOrder.order_number}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className={`p-3 rounded-full transition-all ${isDarkMode ? 'bg-slate-900 hover:bg-white/10 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-600'}`}
                >
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="p-8 md:p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left side: Product & Shipping */}
                  <div className="space-y-8">
                    <section>
                      <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-normal mb-4 flex items-center gap-2">
                        <FaBox className="text-teal-400" /> Item Ordered
                      </h4>
                      <div className={`p-5 border rounded-3xl group ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                        <p className={`text-lg font-semibold  uppercase group-hover:text-indigo-400 transition-colors truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedOrder.product}</p>
                        <p className="text-xs text-gray-400 mt-1 font-bold">Qty: {selectedOrder.quantity}</p>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-normal mb-4 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-rose-500" /> Shipping Address
                      </h4>
                      <div className={`p-5 border rounded-3xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                        {selectedOrder.customer_address ? (
                          <div className="space-y-2">
                            <p className={`text-sm font-semibold uppercase tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              {selectedOrder.customer_address.name}
                            </p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                              {selectedOrder.customer_address.address_line1}, {selectedOrder.customer_address.address_line2 && `${selectedOrder.customer_address.address_line2}, `}
                              {selectedOrder.customer_address.city}, {selectedOrder.customer_address.state} - {selectedOrder.customer_address.pincode}
                            </p>
                            <div className="pt-2 flex flex-col gap-1">
                              <p className="text-[9px] text-indigo-400 font-semibold uppercase tracking-widest ">{selectedOrder.customer_address.phone}</p>
                              <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-widest ">{selectedOrder.customer_address.email}</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-widest  animate-pulse">
                            Address information cluster missing
                          </p>
                        )}
                      </div>
                    </section>
                  </div>

                  {/* Right side: Payment & Status */}
                  <div className="space-y-8">
                    <section>
                      <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-normal mb-4 flex items-center gap-2">
                        <FaCreditCard className="text-blue-400" /> Payment Node
                      </h4>
                      <div className={`p-5 border rounded-3xl space-y-3 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                        <div className={`flex justify-between items-center p-3 rounded-2xl border ${isDarkMode ? 'bg-[#020617] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                          <span className="text-[9px] font-semibold text-gray-500 uppercase">Amount Earned</span>
                          <span className="text-lg font-semibold text-indigo-400 ">₹{selectedOrder.price * selectedOrder.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-semibold uppercase ml-1 ">
                          <FaCalendarAlt /> Ordered: {selectedOrder.created_at?.split('T')[0]}
                        </div>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-normal mb-4 flex items-center gap-2">
                        <FaCalendarAlt className="text-amber-500" /> Update State
                      </h4>
                      <div className={`p-5 border rounded-3xl space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                        <select
                          defaultValue={selectedOrder.status}
                          onChange={(e) => handleStatusUpdate(e.target.value)}
                          disabled={isUpdating}
                          className={`w-full p-4 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-semibold text-[10px] uppercase tracking-normal appearance-none disabled:opacity-50 shadow-inner ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-white text-slate-800 border-slate-200'}`}
                        >
                          <option value="received">Received</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <p className="text-[9px] text-gray-500 font-bold  ml-1">Current state: {selectedOrder.status}</p>
                      </div>
                    </section>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleGetInvoice(selectedOrder.order_number)}
                    className="w-full flex items-center justify-center gap-4 py-5 bg-emerald-500 text-white text-[10px] font-semibold uppercase tracking-normal rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20"
                  >
                    <FaFileInvoice /> Get Order Invoice
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
    </div>
  );
}
