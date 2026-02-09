import React, { useEffect, useState } from "react";
import { FaBox, FaReceipt, FaCalendarAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const history = localStorage.getItem("ordersHistory");
    if (history) {
      setOrders(JSON.parse(history));
    }
  }, []);

  const toggleExpand = (transactionId) => {
    setExpandedOrder(expandedOrder === transactionId ? null : transactionId);
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400">
        <MdOutlineShoppingBag className="text-6xl mb-4" />
        <h2 className="text-xl font-bold">No Orders Yet</h2>
        <p className="text-sm mt-2">Your order history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
        <FaReceipt className="text-violet-600" />
        Order History
      </h1>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={order.transactionId || index}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Order Header */}
            <div
              onClick={() => toggleExpand(order.transactionId)}
              className="p-5 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
                  <FaBox className="text-violet-600 text-xl" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    Order #{order.transactionId?.slice(-8).toUpperCase() || `ORD-${index + 1}`}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <FaCalendarAlt size={10} />
                    {order.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-black text-violet-600">₹{order.totalAmount?.toFixed(2)}</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    {order.status || "Completed"}
                  </span>
                </div>
                {expandedOrder === order.transactionId ? (
                  <FaChevronUp className="text-gray-400" />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </div>
            </div>

            {/* Order Details (Expandable) */}
            {expandedOrder === order.transactionId && (
              <div className="border-t border-gray-100 p-5 bg-gray-50/50 animate-in fade-in slide-in-from-top-2 duration-300">
                <h3 className="font-bold text-gray-700 text-sm mb-3">Items Ordered</h3>
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm bg-white rounded-xl p-3 border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">
                          {item.quantity}x
                        </div>
                        <span className="font-semibold text-gray-800">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    Transaction ID: {order.transactionId}
                  </span>
                  <span className="font-black text-gray-900">
                    Total: ₹{order.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
