import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { FaBox, FaDollarSign, FaMapMarkerAlt, FaCheck, FaSignOutAlt, FaBars, FaTruck, FaClipboardList, FaMoneyBillWave, FaTachometerAlt } from 'react-icons/fa';


const toast = {
    success: (message) => {
        const toastEl = document.createElement('div');
        toastEl.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        toastEl.textContent = message;
        document.body.appendChild(toastEl);
        setTimeout(() => toastEl.remove(), 3000);
    }
};

import { useNavigate } from 'react-router-dom';


const mockOrders = [
    { id: 'ORD001', userName: 'John Doe', deliveryAddress: '123 Main St, New York, NY', status: 'confirmed', deliveryPersonId: null },
    { id: 'ORD002', userName: 'Jane Smith', deliveryAddress: '456 Park Ave, Los Angeles, CA', status: 'shipped', deliveryPersonId: 'd1' },
    { id: 'ORD003', userName: 'Mike Johnson', deliveryAddress: '789 Elm St, Chicago, IL', status: 'delivered', deliveryPersonId: 'd1' },
    { id: 'ORD004', userName: 'Sarah Wilson', deliveryAddress: '101 Pine St, Seattle, WA', status: 'confirmed', deliveryPersonId: null },
];

export default function DeliveryDashboard({ onLogout: propOnLogout }) {
    const navigate = useNavigate();


    const onLogout = propOnLogout || (() => {
        localStorage.removeItem("accessToken");
        navigate('/login');
    });

    const deliveryPersonId = 'd1';
    const [orders, setOrders] = useState(mockOrders);
    const [sidebarOpen, setSidebarOpen] = useState(true);


    const assignedOrders = orders.filter(o => o.deliveryPersonId === deliveryPersonId);
    const availableOrders = orders.filter(o => !o.deliveryPersonId && o.status === 'confirmed');
    const completedOrders = assignedOrders.filter(o => o.status === 'delivered');

    const totalEarnings = completedOrders.length * 10;


    const handleAcceptOrder = (orderId) => {
        setOrders(orders.map(o =>
            o.id === orderId
                ? { ...o, deliveryPersonId, deliveryPersonName: 'Delivery Person', status: 'shipped' }
                : o
        ));
        toast.success('Order accepted! Go to Assigned Orders to track it.');
    };


    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt, path: '/delivery/dashboard' },
        { id: 'assigned', label: 'Assigned Orders', icon: FaClipboardList, path: '/delivery/assigned' },
        { id: 'earnings', label: 'Earnings', icon: FaMoneyBillWave, path: '/delivery/earnings' },
    ];

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white flex flex-col transition-all duration-300`}>
                {/* Sidebar Header */}
                <div className="p-4 flex items-center gap-3 border-b border-gray-700">
                    <FaTruck className="w-6 h-6 text-purple-400" />
                    {sidebarOpen && <span className="font-bold text-lg">Delivery Portal</span>}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="ml-auto text-gray-400 hover:text-white"
                    >
                        <FaBars className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.id === 'dashboard';
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-purple-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {sidebarOpen && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                            D
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">Delivery Person</p>
                                <p className="text-sm text-gray-400 truncate">sdash6239@gmail.com</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                    >
                        <FaSignOutAlt className="w-5 h-5" />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <div className="bg-white border-b px-8 py-6">
                    <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
                        <p className="text-gray-500">Pick up new orders and track your earnings.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-700 font-semibold">Total Earnings</span>
                                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                                    <FaDollarSign className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">${totalEarnings.toFixed(2)}</div>
                            <p className="text-sm text-gray-500 mt-2">This month</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-700 font-semibold">Completed</span>
                                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                    <FaBox className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{completedOrders.length}</div>
                            <p className="text-sm text-gray-500 mt-2">Deliveries</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-700 font-semibold">Available</span>
                                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                                    <FaBox className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{availableOrders.length}</div>
                            <p className="text-sm text-gray-500 mt-2">New orders</p>
                        </div>
                    </div>

                    {/* Available Orders */}
                    {availableOrders.length > 0 ? (
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Available Orders</h3>
                            <div className="space-y-4">
                                {availableOrders.map((order) => (
                                    <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="font-bold text-gray-900">Order {order.id}</h4>
                                                <p className="text-gray-500">{order.userName}</p>
                                            </div>
                                            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                                                +$10.00
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2 mb-4 text-gray-500">
                                            <FaMapMarkerAlt className="w-4 h-4 mt-1 flex-shrink-0" />
                                            <p className="text-sm">{order.deliveryAddress}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleAcceptOrder(order.id)}
                                                className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FaCheck className="w-4 h-4" />
                                                Accept Order
                                            </button>
                                            <button className="px-6 py-3 border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaBox className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No New Orders</h3>
                            <p className="text-gray-500">Check back later for new delivery requests.</p>
                        </div>
                    )}

                    {/* Recent Deliveries */}
                    {completedOrders.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent History</h3>
                            <div className="bg-white rounded-xl shadow-sm border divide-y">
                                {completedOrders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{order.id}</p>
                                            <p className="text-sm text-gray-500">{order.userName}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-green-600">+$10.00</p>
                                            <p className="text-sm text-gray-500">Delivered</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
