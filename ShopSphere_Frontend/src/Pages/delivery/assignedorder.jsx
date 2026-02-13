import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaMapMarkerAlt, FaCheck, FaSignOutAlt, FaBars, FaTruck, FaClipboardList, FaMoneyBillWave, FaTachometerAlt, FaPhoneAlt, FaDirections, FaDotCircle, FaStore, FaUser, FaClock, FaListUl } from 'react-icons/fa';

const toast = {
    success: (message) => {
        const toastEl = document.createElement('div');
        toastEl.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        toastEl.textContent = message;
        document.body.appendChild(toastEl);
        setTimeout(() => toastEl.remove(), 3000);
    }
};

const mockOrders = [
    { id: 'ORD001', userName: 'John Doe', deliveryAddress: '123 Main St, New York, NY', status: 'confirmed', deliveryPersonId: null },
    { id: 'ORD002', userName: 'Jane Smith', deliveryAddress: '456 Park Ave, Los Angeles, CA', status: 'shipped', deliveryPersonId: 'd1' },
    { id: 'ORD003', userName: 'Mike Johnson', deliveryAddress: '789 Elm St, Chicago, IL', status: 'delivered', deliveryPersonId: 'd1' },
    { id: 'ORD004', userName: 'Sarah Wilson', deliveryAddress: '101 Pine St, Seattle, WA', status: 'confirmed', deliveryPersonId: null },
];

export default function AssignedOrders() {
    const navigate = useNavigate();
    const deliveryPersonId = 'd1';

    const [orders, setOrders] = useState(mockOrders);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'

    const onLogout = () => {
        navigate('/login');
    };

    const activeDeliveries = orders.filter(o =>
        o.deliveryPersonId === deliveryPersonId && o.status === 'shipped'
    );

    const handleUpdateStatus = (orderId, newStatus) => {
        setOrders(orders.map(o =>
            o.id === orderId
                ? { ...o, status: newStatus }
                : o
        ));
        toast.success(newStatus === 'delivered' ? 'Delivery completed!' : 'Status updated!');
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt, path: '/delivery/dashboard' },
        { id: 'assigned', label: 'Assigned Orders', icon: FaClipboardList, path: '/delivery/assigned' },
        { id: 'earnings', label: 'Earnings', icon: FaMoneyBillWave, path: '/delivery/earnings' },
    ];

    return (
        <div className="min-h-screen flex bg-gray-50 font-sans">
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white flex flex-col transition-all duration-300 fixed h-full z-20`}>
                <div className="p-4 flex items-center gap-3 border-b border-gray-700">
                    <FaTruck className="w-6 h-6 text-purple-400" />
                    {sidebarOpen && <span className="font-bold text-lg">Delivery Portal</span>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto text-gray-400 hover:text-white">
                        <FaBars className="w-5 h-5" />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.id === 'assigned';
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <Icon className="w-5 h-5" />
                                {sidebarOpen && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">D</div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">Delivery Person</p>
                                <p className="text-sm text-gray-400 truncate">sdash@example.com</p>
                            </div>
                        )}
                    </div>
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                        <FaSignOutAlt className="w-5 h-5" />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Current Task</h1>
                        <p className="text-gray-500 mt-1">Focus on your active delivery.</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex gap-2">
                        <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold flex items-center gap-2">
                            <FaDotCircle className="animate-pulse w-3 h-3" />
                            {activeDeliveries.length} Active
                        </span>
                    </div>
                </header>

                {activeDeliveries.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaTruck className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">You're All Caught Up!</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">No active deliveries right now. Head over to the dashboard to find new orders nearby.</p>
                        <button
                            onClick={() => navigate('/delivery/dashboard')}
                            className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition shadow-xl shadow-purple-200"
                        >
                            Find New Orders
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {activeDeliveries.map((order) => (
                            <div key={order.id} className="bg-white rounded-[2rem] p-8 shadow-xl border border-purple-50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none"></div>

                                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="bg-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                                                On Route
                                            </span>
                                            <span className="text-gray-400 font-bold">#{order.id}</span>
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900">Delivery for {order.userName}</h2>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl font-black text-green-500">$12.50</div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Est. Earning</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                                    <div className="lg:col-span-2 space-y-8">
                                        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                                            <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest mb-6">Delivery Timeline</h3>
                                            <div className="relative pl-8 space-y-8 border-l-2 border-dashed border-gray-300 ml-2">
                                                {/* Pickup Point */}
                                                <div className="relative">
                                                    <div className="absolute -left-[41px] bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                                                        <FaCheck className="text-white w-2 h-2" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-green-600 font-bold uppercase mb-1">Completed 10:45 AM</p>
                                                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                            <FaStore className="text-gray-400" />
                                                            Vendor Location
                                                        </h4>
                                                        <p className="text-gray-500 text-sm">Burger King, 4th Avenue Street</p>
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <div className="absolute -left-[41px] bg-purple-600 w-6 h-6 rounded-full border-4 border-white shadow-md flex items-center justify-center animate-pulse">
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-purple-600 font-bold uppercase mb-1">Estimated 11:15 AM</p>
                                                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                            <FaMapMarkerAlt className="text-purple-600" />
                                                            {order.deliveryAddress}
                                                        </h4>
                                                        <p className="text-gray-500 text-sm">Navigate to customer location</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                                            <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                                                <FaListUl /> Order Items
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-orange-100 text-orange-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">1x</div>
                                                        <span className="font-bold text-gray-700">Spicy Chicken Deluxe</span>
                                                    </div>
                                                    <FaCheck className="text-gray-300" />
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-orange-100 text-orange-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">2x</div>
                                                        <span className="font-bold text-gray-700">Large Fries</span>
                                                    </div>
                                                    <FaCheck className="text-gray-300" />
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-orange-100 text-orange-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">1x</div>
                                                        <span className="font-bold text-gray-700">Cola (Medium)</span>
                                                    </div>
                                                    <FaCheck className="text-gray-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="bg-purple-600 text-white rounded-3xl p-6 shadow-xl shadow-purple-200 text-center">
                                            <p className="text-purple-200 text-xs font-bold uppercase tracking-widest mb-2">Time Remaining</p>
                                            <div className="text-4xl font-black mb-1">12 min</div>
                                            <p className="text-purple-200 text-sm">On Time</p>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <button className="w-full py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition">
                                                <div className="bg-green-100 p-2 rounded-full text-green-600"><FaPhoneAlt /></div>
                                                Call {order.userName.split(' ')[0]}
                                            </button>
                                            <button className="w-full py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition">
                                                <div className="bg-blue-100 p-2 rounded-full text-blue-600"><FaDirections /></div>
                                                Open Maps
                                            </button>
                                        </div>

                                        <div className="mt-auto pt-8">
                                            <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Delivery Actions</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button className="py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition text-sm">
                                                    Report Issue
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                                    className="py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition shadow-lg shadow-green-200 text-sm flex items-center justify-center gap-2"
                                                >
                                                    <FaCheck /> Delivered
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}