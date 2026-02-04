import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Navbar() {
  const cart = useSelector((state) => state.cart || []);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md py-4 px-6 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          {/* You might want to add a logo image here */}
          <Link to="/home" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ShopSphere
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-8 items-center">
          <Link to="/home" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
            Home
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
            About Us
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
            Contact Us
          </Link>
          <Link to="/wishlist" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
            Wishlist
          </Link>

          {/* Cart with Badge */}
          <Link to="/cart" className="relative group">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300 inline-block">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
