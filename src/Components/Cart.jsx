import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DecrCart, IncrCart, RemoveFromCart } from "../Store";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartObjects = useSelector((state) => state.cart || []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      {cartObjects && cartObjects.length > 0 ? (
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">🛒 Your Cart Items</h1>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cartObjects.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col"
              >
                {/* Product Image */}
                <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 h-48 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                {/* Price */}
                <div className="text-2xl font-bold text-green-600 mb-4">₹{item.price}</div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mb-6 bg-gray-100 rounded-lg p-3">
                  <button 
                    onClick={() => dispatch(DecrCart(item))}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold w-8 h-8 rounded-full transition-colors"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold text-gray-900">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => dispatch(IncrCart(item))}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold w-8 h-8 rounded-full transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Total */}
                <div className="text-lg font-semibold text-gray-900 mb-6">
                  Total: ₹{(item.price * item.quantity).toFixed(2)}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => dispatch(RemoveFromCart(item))}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Remove from Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty 😕</h2>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart!</p>
            <button 
              onClick={() => navigate("/home")}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Shop Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
