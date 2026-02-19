import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaStore,
    FaMapMarkerAlt,
    FaCheck,
    FaPhoneAlt,
    FaDirections,
    FaClock,
    FaBox,
    FaListUl,
    FaDotCircle,
    FaTruck
} from 'react-icons/fa';
import { fetchAssignedOrders, completeDelivery as apiCompleteDelivery, acceptOrder as apiAcceptOrder } from '../../api/delivery_axios';
import { toast } from 'react-hot-toast';

export default function AssignedOrders() {
    const navigate = useNavigate();
    const [activeDeliveries, setActiveDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadDeliveries = async () => {
        try {
            const data = await fetchAssignedOrders('assigned'); // Load ONLY newly assigned orders
            setActiveDeliveries(data);
        } catch (error) {
            console.error("Failed to load deliveries:", error);
            toast.error("Failed to load assigned deliveries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDeliveries();
    }, []);

    const handleUpdateStatus = async (assignmentId, newStatus) => {
        try {
            if (newStatus === 'delivered') {
                await apiCompleteDelivery(assignmentId, { status: 'delivered' });
                toast.success('Delivery completed!');
            }
            loadDeliveries();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleAcceptOrder = async (assignmentId) => {
        try {
            await apiAcceptOrder(assignmentId);
            toast.success('Order accepted! You can now track it from your dashboard.');
            loadDeliveries();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to accept order");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full p-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">New Delivery Requests</h1>
                    <p className="text-gray-500 mt-1">Review and accept new assignments.</p>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex gap-2">
                    <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold flex items-center gap-2">
                        <FaDotCircle className="animate-pulse w-3 h-3" />
                        {activeDeliveries.length} New
                    </span>
                </div>
            </header>

            {activeDeliveries.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaTruck className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No New Requests</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">You don't have any pending assignments at the moment. Please wait for the admin to assign new orders to you.</p>
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
                                    <h2 className="text-3xl font-bold text-gray-900">Delivery for {order.customer_name}</h2>
                                    <p className="text-gray-500 font-medium tracking-tight">Assignment #{order.id}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-black text-green-500">₹{order.delivery_fee}</div>
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
                                                    <p className="text-xs text-green-600 font-bold uppercase mb-1">Pickup Information</p>
                                                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                        <FaStore className="text-gray-400" />
                                                        Vendor Location
                                                    </h4>
                                                    <p className="text-gray-500 text-sm">{order.pickup_address}</p>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <div className="absolute -left-[41px] bg-purple-600 w-6 h-6 rounded-full border-4 border-white shadow-md flex items-center justify-center animate-pulse">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-purple-600 font-bold uppercase mb-1">Delivery Destination</p>
                                                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                        <FaMapMarkerAlt className="text-purple-600" />
                                                        {order.delivery_address}
                                                    </h4>
                                                    <p className="text-gray-500 text-sm">{order.delivery_city}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                                        <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                                            <FaListUl /> Order Items
                                        </h3>
                                        <div className="space-y-3">
                                            {order.items ? order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-orange-100 text-orange-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">{item.quantity}x</div>
                                                        <span className="font-bold text-gray-700">{item.product_name}</span>
                                                    </div>
                                                    <FaCheck className="text-gray-300" />
                                                </div>
                                            )) : (
                                                <p className="text-gray-400 text-sm italic">Item details not available</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="bg-purple-600 text-white rounded-3xl p-6 shadow-xl shadow-purple-200 text-center">
                                        <p className="text-purple-200 text-xs font-bold uppercase tracking-widest mb-2">Delivery Status</p>
                                        <div className="text-2xl font-black mb-1 uppercase tracking-tight">{order.status}</div>
                                        <p className="text-purple-200 text-sm">Action Required</p>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button className="w-full py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition">
                                            <div className="bg-green-100 p-2 rounded-full text-green-600"><FaPhoneAlt /></div>
                                            Call Customer
                                        </button>
                                    </div>

                                    <div className="mt-auto pt-8">
                                        <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Delivery Actions</p>
                                        <div className="grid grid-cols-1 gap-3">
                                            {order.status === 'assigned' && (
                                                <button
                                                    onClick={() => handleAcceptOrder(order.id)}
                                                    className="py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition shadow-lg shadow-purple-200"
                                                >
                                                    Accept Task
                                                </button>
                                            )}
                                            {order.status === 'accepted' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                                    className="py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                                                >
                                                    <FaCheck /> Mark as Delivered
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}