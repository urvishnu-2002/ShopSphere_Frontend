import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RemoveFromWishlist, AddToCart } from '../../Store';
import { FaHeart, FaShoppingCart, FaTrash, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

// ============================================
// WISHLIST PAGE COMPONENT
// ============================================
function Wishlist() {
  // Get wishlist state from Redux store
  const wishlist = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ============================================
  // HANDLERS
  // ============================================
  const handleAddToCart = (item) => {
    dispatch(AddToCart(item));
    toast.success("Moved to cart!");
  };

  const handleRemoveFromWishlist = (item) => {
    dispatch(RemoveFromWishlist(item));
    toast.success("Removed from wishlist");
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            My Wishlist
          </h1>
          <p className="text-xl text-gray-600">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Wishlist Items */}
        {wishlist && wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                onClick={() => navigate(`/product/${encodeURIComponent(item.name)}`)}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-orange-100 cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gradient-to-br from-orange-100 to-purple-100 h-48 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Heart Badge */}
                  <div className="absolute top-4 right-4 bg-purple-500 text-white rounded-full p-2.5 shadow-lg animate-pulse">
                    <FaHeart size={18} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-400 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  {/* Price */}
                  <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent mb-4">
                    ₹{item.price}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-gradient-to-r from-orange-400 to-purple-500 hover:from-orange-600 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <FaShoppingCart />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center transform hover:scale-[1.05] active:scale-[0.95]"
                      title="Remove from wishlist"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <FaHeart size={48} className="text-orange-200" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                Start adding items to your wishlist by clicking the heart icon on products you love!
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-purple-500 hover:from-orange-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <FaArrowLeft className="text-sm" />
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;