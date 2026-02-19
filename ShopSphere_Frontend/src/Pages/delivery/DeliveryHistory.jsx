import { useState, useEffect } from 'react';
import { FaHistory, FaCheckCircle, FaRupeeSign, FaBox, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { fetchDeliveryHistory } from '../../api/delivery_axios';
import { toast } from 'react-hot-toast';

export default function DeliveryHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await fetchDeliveryHistory();
                setHistory(data);
            } catch (error) {
                console.error('Failed to load history:', error);
                toast.error('Failed to load delivery history');
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-[60vh]'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600'></div>
            </div>
        );
    }

    return (
        <div className='w-full p-8'>
            <header className='mb-8'>
                <h1 className='text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3'>
                    <FaHistory className='text-purple-600' />
                    Delivery History
                </h1>
                <p className='text-gray-500 mt-1'>Review your past completed deliveries and earnings.</p>
            </header>

            {history.length === 0 ? (
                <div className='text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100'>
                    <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300'>
                        <FaBox size={40} />
                    </div>
                    <h3 className='text-xl font-bold text-gray-900'>No History Yet</h3>
                    <p className='text-gray-500'>Your completed deliveries will appear here.</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 gap-6'>
                    {history.map((item) => (
                        <div key={item.id} className='bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-6'>
                            <div className='flex items-center gap-6 w-full md:w-auto'>
                                <div className='w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 flex-shrink-0'>
                                    <FaCheckCircle size={30} />
                                </div>
                                <div className='flex-grow'>
                                    <div className='flex items-center gap-2 mb-1'>
                                        <h3 className='font-bold text-lg text-gray-900'>Order #{item.order_id}</h3>
                                        <span className='text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider'>Assignment #{item.id}</span>
                                    </div>
                                    <p className='text-gray-500 font-medium flex items-center gap-2 text-sm italic'>
                                        {item.items && item.items.length > 0 ? item.items.map(i => `${i.quantity}x ${i.product_name}`).join(', ') : 'Order data unavailable'}
                                    </p>
                                    <div className='flex flex-wrap gap-4 mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest'>
                                        <div className='flex items-center gap-1'>
                                            <FaMapMarkerAlt className='text-purple-400' />
                                            {item.delivery_city}
                                        </div>
                                        <div className='flex items-center gap-1'>
                                            <FaCalendarAlt className='text-blue-400' />
                                            {new Date(item.assigned_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0'>
                                <div className='text-center md:text-right'>
                                    <p className='text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-1'>Fee Earned</p>
                                    <div className='text-2xl font-black text-green-600 flex items-center gap-1'>
                                        <FaRupeeSign size={18} />
                                        {item.delivery_fee}
                                    </div>
                                </div>
                                <div className='bg-purple-50 text-purple-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest'>
                                    Completed
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}