import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../../Store";
import { FaCheckCircle } from "react-icons/fa";

function Success() {
  const [order, setOrder] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const data = localStorage.getItem("orderSuccess");
    if (data) {
      const parsedOrder = JSON.parse(data);
      setOrder(parsedOrder);

      // Save to orders history (only if not already saved)
      const existingHistory = JSON.parse(localStorage.getItem("ordersHistory") || "[]");
      const alreadyExists = existingHistory.some(
        (o) => o.transactionId === parsedOrder.transactionId
      );
      
      if (!alreadyExists) {
        const updatedHistory = [parsedOrder, ...existingHistory];
        localStorage.setItem("ordersHistory", JSON.stringify(updatedHistory));
        
        // Clear the cart after successful order
        dispatch(clearCart());
      }
    }
  }, [dispatch]);

  if (!order) {
    return <h2 className="text-center mt-20">No Order Found</h2>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white max-w-xl w-full rounded-3xl shadow-lg p-8">
        
        <div className="text-center mb-6">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-2xl font-black text-gray-900">
            Order Placed Successfully 🎉
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Transaction ID: <span className="font-bold">{order.transactionId}</span>
          </p>
        </div>

        <div className="border-t pt-4">
          <h2 className="font-black text-lg mb-4">Order Items</h2>

          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-3 text-sm font-semibold text-gray-700"
            >
              <span>{item.image}</span>
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 flex justify-between font-black text-lg">
          <span>Total Paid</span>
          <span className="text-blue-600">₹{order.totalAmount.toFixed(2)}</span>
        </div>

        <p className="text-xs text-center text-gray-400 mt-6">
          Payment Date: {order.date}
        </p>
      </div>
    </div>
  );
}

export default Success;
