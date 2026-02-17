// import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
// import { useNotifications } from './NotificationContext';

// const VendorContext = createContext();

// export const useVendors = () => {
//     const context = useContext(VendorContext);
//     if (!context) {
//         throw new Error('useVendors must be used within a VendorProvider');
//     }
//     return context;
// };

// // --- Initial Master Data ---
// const INITIAL_VENDORS = [
//     {
//         id: 'VND-2024-001',
//         storeName: 'Bharat Electronics',
//         legalName: 'Bharat Electronics & Solutions Pvt Ltd',
//         email: 'partners@bharatelectro.in',
//         status: 'Approved',
//         registrationDate: '2024-01-12',
//         owner: 'Rajesh Kumar',
//         phone: '+91 98765 43210',
//         address: 'Sector 62, Noida, Uttar Pradesh',
//         category: 'Electronics',
//         description: 'Leading distributor of consumer electronics and home appliances across Northern India.',
//         documents: [
//             { name: 'GST Certificate', type: 'PDF', size: '2.4 MB' },
//             { name: 'Trade License', type: 'PDF', size: '1.2 MB' }
//         ]
//     },
//     {
//         id: 'VND-2024-999',
//         notifId: 'notif-1',
//         storeName: 'Mumbai Gadget Mart',
//         legalName: 'Mumbai Gadgets and Tech LLP',
//         email: 'sales@mumbaigadgets.com',
//         status: 'Pending',
//         registrationDate: '2024-02-09',
//         owner: 'Sanjay Mehta',
//         phone: '+91 91234 56789',
//         address: 'Andheri West, Mumbai, Maharashtra',
//         category: 'Gadgets',
//         description: 'Curating the latest lifestyle tech and mobile accessories for the modern consumer.',
//         documents: [
//             { name: 'Shop Establishment License', type: 'PDF', size: '3.1 MB' }
//         ]
//     },
//     {
//         id: 'VND-2024-888',
//         notifId: 'notif-2',
//         storeName: 'Jaipur Organic Hub',
//         legalName: 'Organic Hub Rajasthan Pvt Ltd',
//         email: 'hello@jaipurorganics.in',
//         status: 'Pending',
//         registrationDate: '2024-02-08',
//         owner: 'Priyanka Sharma',
//         phone: '+91 99887 76655',
//         address: 'Malviya Nagar, Jaipur, Rajasthan',
//         category: 'Organic Foods',
//         description: 'Quality organic produce sourced directly from farmers across Rajasthan.',
//         documents: [
//             { name: 'FSSAI License', type: 'PDF', size: '1.8 MB' }
//         ]
//     },
//     {
//         id: 'VND-2026-IQO',
//         storeName: 'IQO',
//         legalName: 'IQO Technologies Ltd',
//         email: 'contact@iqo.com',
//         status: 'Blocked',
//         registrationDate: '2026-02-11',
//         owner: 'Luna Star',
//         phone: '+91 88888 77777',
//         address: '12 Galaxy Way, Neo City',
//         category: 'Mobile Devices',
//         description: 'Innovative mobile technology and smartphones for the high-performance market.',
//         documents: [{ name: 'Tech License', type: 'PDF', size: '1.5 MB' }]
//     },
//     {
//         id: 'VND-2026-RAZER',
//         storeName: 'Razer',
//         legalName: 'Razer Gaming Gear Co.',
//         email: 'support@razer.com',
//         status: 'Pending',
//         registrationDate: '2024-02-10',
//         owner: 'Arjun Singh',
//         phone: '+91 90000 11111',
//         address: 'Whitefield, Bengaluru, Karnataka',
//         category: 'Gaming Hardware',
//         description: 'The world leader in high-performance gaming hardware, software, and systems.',
//         documents: [
//             { name: 'Brand Authorization', type: 'PDF', size: '4.5 MB' }
//         ]
//     }
// ];

// export const VendorProvider = ({ children }) => {
//     const [vendors, setVendors] = useState([]);
//     const [toasts, setToasts] = useState([]);
//     const { addNotification, markAsRead, handleVendorAction } = useNotifications();

//     const addToast = useCallback((message, type = 'success') => {
//         const id = Date.now();
//         setToasts(prev => [...prev, { id, message, type }]);
//         setTimeout(() => {
//             setToasts(prev => prev.filter(t => t.id !== id));
//         }, 3000);
//     }, []);

//     // .............

//     const updateVendorStatus = async (vendorId, newStatus) => {
//         const token = localStorage.getItem("accessToken");

//         if (newStatus === "Approved") {
//             await fetch(
//                 `http://localhost:8000/admin/api/vendor-requests/${vendorId}/approve/`,
//                 { method: "POST", headers: { Authorization: `Bearer ${token}` } }
//             );
//         }

//         if (newStatus === "Blocked") {
//             await fetch(
//                 `http://localhost:8000/admin/api/vendor-requests/${vendorId}/reject/`,
//                 { method: "POST", headers: { Authorization: `Bearer ${token}` } }
//             );
//         }

//         await loadVendors(); // 🔥 THIS IS KEY
//         return true;
//     };


//     const value = useMemo(() => ({
//         vendors,
//         updateVendorStatus,
//         toasts,
//         removeToast: (id) => setToasts(prev => prev.filter(t => t.id !== id))
//     }), [vendors, updateVendorStatus, toasts]);

//     // Simulate New Registration
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             const newVendor = {
//                 id: 'VND-NEW-99',
//                 notifId: 'notif-new-99',
//                 storeName: 'Stellar Artisans',
//                 legalName: 'Stellar Artisans Co.',
//                 email: 'hello@stellar.art',
//                 status: 'Pending',
//                 registrationDate: new Date().toISOString().split('T')[0],
//                 owner: 'Luna Star',
//                 phone: '+1 555-8888',
//                 address: '12 Galaxy Way, Neo City',
//                 category: 'Handmade Crafts',
//                 description: 'Unique boutique for handcrafted jewelry and artisanal home decor.',
//                 documents: [{ name: 'Artisan License', type: 'PDF', size: '1.5 MB' }]
//             };

//             setVendors(prev => {
//                 if (prev.find(v => v.id === newVendor.id)) return prev;
//                 return [newVendor, ...prev];
//             });

//             addNotification({
//                 id: newVendor.notifId,
//                 type: 'VENDOR_REGISTRATION',
//                 vendorId: newVendor.id,
//                 vendorName: newVendor.storeName,
//                 vendorEmail: newVendor.email,
//                 registrationDate: newVendor.registrationDate,
//                 status: 'Pending',
//             });
//         }, 20000);
//         return () => clearTimeout(timer);
//     }, [addNotification]);

//     return (
//         <VendorContext.Provider value={value}>
//             {children}
//             {/* Custom Toast Container */}
//             <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
//                 {toasts.map(toast => (
//                     <div
//                         key={toast.id}
//                         className={`pointer-events-auto px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-right duration-300 ${toast.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'
//                             }`}
//                     >
//                         <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
//                         <span className="text-sm font-bold">{toast.message}</span>
//                     </div>
//                 ))}
//             </div>
//         </VendorContext.Provider>
//     );
// };
