import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Dummy orders data
    const fakeOrders = [
      {
        id: "ORD001",
        product: "Wireless Mouse",
        price: 799,
        status: "Delivered",
        date: "12/02/2026"
      },
      {
        id: "ORD002",
        product: "Bluetooth Headphones",
        price: 1499,
        status: "Delivered",
        date: "11/02/2026"
      },
      {
        id: "ORD003",
        product: "Laptop Stand",
        price: 999,
        status: "Delivered",
        date: "10/02/2026"
      }
    ];

    setOrders(fakeOrders);
  }, []);

  const deleteOrder = (id) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="text-gray-400 border-b">
            <tr>
              <th className="pb-3 text-left">Order ID</th>
              <th>Product</th>
              <th>Price</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {orders.map(order => (
              <tr key={order.id} className="border-b last:border-none">

                <td className="py-4 font-semibold">{order.id}</td>
                <td>{order.product}</td>
                <td>₹{order.price}</td>

                <td>
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                    {order.status}
                  </span>
                </td>

                <td>{order.date}</td>

                <td>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="text-red-500 font-semibold"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

        {orders.length === 0 && (
          <p className="text-center text-gray-400 py-6">No orders yet.</p>
        )}

      </div>

    </div>
  );
}
