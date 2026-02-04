import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AddToCart, AddToWishlist, RemoveFromWishlist } from "../../Store";
import { FaHeart } from "react-icons/fa";


function Home() {
  const { fruit } = useSelector((state) => state.products);
  const wishlist = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const isInWishlist = (itemName) => {
    return wishlist.some(item => item.name === itemName);
  };

  const handleWishlistClick = (item) => {
    if (isInWishlist(item.name)) {
      dispatch(RemoveFromWishlist(item));
    } else {
      dispatch(AddToWishlist(item));
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 drop-shadow-lg">
            Fresh & Organic Fruits
          </h1>
          <p className="text-xl text-gray-600">
            Premium quality fruits delivered fresh to your doorstep
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-yellow-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {fruit.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden bg-gradient-to-br from-green-100 to-yellow-100 h-48 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => handleWishlistClick(item)}
                    className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                  >
                    <FaHeart
                      size={22}
                      className={isInWishlist(item.name) ? "text-red-500" : "text-gray-300"}
                    />
                  </button>
                </div>



              </div>

              {/* Content Container */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {item.name}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Price and Button */}
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ₹{item.price}
                  </span>
                  <button
                    onClick={() => dispatch(AddToCart(item))}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Home;
