
import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-purple-600">ShopSphere</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-600 hover:text-gray-900">Home</button>
                        <button className="text-gray-600 hover:text-gray-900">Products</button>
                        <button className="text-gray-600 hover:text-gray-900">Cart</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
