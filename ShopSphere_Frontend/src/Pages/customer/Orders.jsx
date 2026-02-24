// import React, { useEffect, useState } from "react";

// import { useDispatch, useSelector } from "react-redux";

// import { useNavigate } from "react-router-dom";
// import { FaStar, FaCamera, FaTimes } from "react-icons/fa";
// import { getProductDetail, submitReview } from "../../api/axios";
// import toast from "react-hot-toast";

// import {

//   Package,

//   Receipt,

//   Calendar,

//   ChevronDown,

//   ChevronUp,

//   ShoppingBag,

//   AlertCircle,

//   Truck,

//   ArrowRight

// } from "lucide-react";

// import { motion, AnimatePresence } from "framer-motion";

// import { fetchOrders, fetchProducts } from "../../Store";


// function Orders() {

//   const dispatch = useDispatch();

//   const navigate = useNavigate();

//   const { orders, isLoading, error } = useSelector((state) => state.order);
//   const { all: allProducts } = useSelector((state) => state.products);

//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [selectedProductName, setSelectedProductName] = useState("");
//   const [newReview, setNewReview] = useState({
//     name: "",
//     rating: 5,
//     comment: "",
//     image: null,
//     imagePreview: null
//   });

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setNewReview({
//           ...newReview,
//           image: file,
//           imagePreview: reader.result
//         });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedProductId) {
//       toast.error("Invalid product ID. Cannot submit review.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const formData = new FormData();
//       formData.append('reviewer_name', newReview.name);
//       formData.append('rating', newReview.rating);
//       formData.append('comment', newReview.comment);
//       if (newReview.image) {
//         formData.append('pictures', newReview.image);
//       }

//       await submitReview(selectedProductId, formData);

//       setIsReviewModalOpen(false);
//       setNewReview({
//         name: "",
//         rating: 5,
//         comment: "",
//         image: null,
//         imagePreview: null
//       });
//       toast.success("Review submitted successfully!");
//       dispatch(fetchOrders());
//       navigate(`/product/${encodeURIComponent(selectedProductName)}`);
//     } catch (err) {
//       console.error("Submission error:", err);
//       const errorMsg = err.response?.data?.error ||
//         (err.response?.data && typeof err.response.data === 'object' ? Object.values(err.response.data)[0] : null) ||
//         "Error submitting review";
//       toast.error(typeof errorMsg === 'string' ? errorMsg : "Error submitting review");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const openReviewModal = (item) => {
//     let productId = item.product;

//     // Fallback: If product ID is null in the order item, try to find it in the products store by name
//     if (!productId && allProducts?.length > 0) {
//       const found = allProducts.find(p => p.name === item.product_name);
//       if (found) {
//         productId = found.id;
//       }
//     }

//     if (!productId) {
//       toast.error("Product information missing for this order item. If this is an old order or the product was deleted, it might not be reviewable.");
//       return;
//     }

//     setSelectedProductId(productId);
//     setSelectedProductName(item.product_name);

//     if (item.user_review) {
//       setNewReview({
//         name: item.user_review.reviewer_name || "",
//         rating: item.user_review.rating || 5,
//         comment: item.user_review.comment || "",
//         image: null,
//         imagePreview: item.user_review.pictures ? `http://127.0.0.1:8000${item.user_review.pictures}` : null
//       });
//     } else {
//       setNewReview({
//         name: "",
//         rating: 5,
//         comment: "",
//         image: null,
//         imagePreview: null
//       });
//     }

//     setIsReviewModalOpen(true);
//   };


//   useEffect(() => {

//     const token = localStorage.getItem("accessToken");

//     if (!token) {

//       navigate("/login");

//       return;

//     }

//     dispatch(fetchOrders());
//     if (!allProducts || allProducts.length === 0) {
//       dispatch(fetchProducts());
//     }
//   }, [dispatch, navigate, allProducts]);


//   const toggleExpand = (transactionId) => {

//     setExpandedOrder(expandedOrder === transactionId ? null : transactionId);

//   };


//   if (isLoading) {

//     return (

//       <div className="min-h-[60vh] flex flex-col items-center justify-center">

//         <div className="relative w-16 h-16">

//           <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>

//           <div className="absolute inset-0 border-4 border-orange-400 rounded-full border-t-transparent animate-spin"></div>

//         </div>

//         <p className="mt-4 text-gray-500 font-black uppercase tracking-widest text-[10px] animate-pulse">

//           Retrieving Orders...

//         </p>

//       </div>

//     );

//   }


//   if (error) {

//     const errorMessage = typeof error === 'string'

//       ? error

//       : error?.detail || error?.message || "Something went wrong. Please login again.";


//     return (

//       <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">

//         <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-red-100">

//           <AlertCircle size={32} />


//         </div>

//         <h2 className="text-xl font-black text-gray-900">Oops! Something went wrong</h2>

//         <p className="text-gray-400 font-bold text-center mt-2 max-w-xs">{errorMessage}</p>

//         <button

//           onClick={() => navigate("/login")}

//           className="mt-8 px-8 py-3 bg-gradient-to-r from-orange-400 to-purple-500 text-white font-black rounded-xl shadow-lg shadow-orange-400/20 hover:shadow-orange-400/30 transition-all active:scale-95"

//         >

//           Return to Login

//         </button>

//       </div>

//     );

//   }


//   if (orders.length === 0) {

//     return (

//       <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">

//         <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-[40px] flex items-center justify-center mb-8 border border-gray-100">

//           <ShoppingBag size={48} />

//         </div>

//         <h2 className="text-3xl font-black text-gray-900 tracking-tight">No Orders Found</h2>

//         <p className="text-gray-400 font-bold text-center mt-3 max-w-sm leading-relaxed">

//           Your order history is currently empty. Start shopping to fill it with amazing products!

//         </p>

//         <button

//           onClick={() => navigate("/")}

//           className="mt-10 px-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all flex items-center gap-3 shadow-xl"

//         >

//           Explore Shop <ArrowRight size={18} />

//         </button>

//       </div>

//     );

//   }


//   return (

//     <div className="max-w-4xl mx-auto px-4 py-16">

//       <div className="flex items-center justify-between mb-12">

//         <div>

//           <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">

//             <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-purple-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-orange-400/20">

//               <Receipt size={28} />

//             </div>

//             Order History

//           </h1>

//           <p className="text-gray-400 font-bold mt-2 ml-1">Managing {orders.length} orders across your history.</p>

//         </div>

//       </div>


//       <div className="space-y-6">

//         {orders.map((order, index) => (

//           <motion.div

//             initial={{ opacity: 0, y: 20 }}

//             animate={{ opacity: 1, y: 0 }}

//             transition={{ delay: index * 0.05 }}

//             key={order.id || index}

//             className="group bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-2xl hover:shadow-gray-200/40 hover:border-orange-100"

//           >

//             {/* Order Header */}

//             <div

//               onClick={() => toggleExpand(order.id)}

//               className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"

//             >

//               <div className="flex items-center gap-5">

//                 <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-orange-400 shadow-inner group-hover:bg-orange-50 transition-colors">

//                   <Package size={28} />

//                 </div>


//                 <div>

//                   <div className="flex items-center gap-2 mb-1.5">

//                     <p className="font-black text-gray-900 text-lg uppercase tracking-tight">

//                       {order.transaction_id || `ORD-${order.id}`}

//                     </p>

//                     <span className={`text-[9px] font-black uppercase tracking-[2px] px-3 py-1 rounded-full border flex items-center gap-1.5

//                       ${order.payment_status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :

//                         order.payment_status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :

//                           order.payment_status === 'failed' ? 'bg-red-50 text-red-600 border-red-100' :

//                             'bg-gray-50 text-gray-600 border-gray-100'}`}>

//                       <div className={`w-1.5 h-1.5 rounded-full animate-pulse

//                         ${order.payment_status === 'completed' ? 'bg-emerald-500' :

//                           order.payment_status === 'pending' ? 'bg-amber-500' :

//                             order.payment_status === 'failed' ? 'bg-red-500' :

//                               'bg-gray-500'}`}></div>

//                       {order.payment_status === 'completed' ? 'PAID' : order.payment_status || 'PENDING'}

//                     </span>

//                   </div>


//                   <p className="text-[11px] text-gray-400 font-bold flex items-center gap-2 uppercase tracking-widest">

//                     <Calendar size={12} className="text-gray-300" />

//                     {new Date(order.created_at).toLocaleDateString('en-IN', {

//                       day: '2-digit',

//                       month: 'short',

//                       year: 'numeric',

//                       hour: '2-digit',

//                       minute: '2-digit'

//                     })}

//                   </p>

//                 </div>

//               </div>


//               <div className="flex items-center justify-between sm:justify-end gap-10 border-t sm:border-t-0 pt-4 sm:pt-0">

//                 <div className="text-left sm:text-right">

//                   <p className="text-[10px] font-black text-gray-300 uppercase tracking-[2px] mb-0.5">Grand Total</p>

//                   <p className="text-2xl font-black text-orange-400 tracking-tighter">

//                     ₹{Number(order.total_amount).toFixed(2)}

//                   </p>

//                 </div>


//                 <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${expandedOrder === order.id ? "bg-gray-900 text-white rotate-180" : "bg-gray-50 text-gray-400"}`}>

//                   <ChevronDown size={22} />

//                 </div>

//               </div>

//             </div>


//             {/* Order Details */}

//             < AnimatePresence >

//               {expandedOrder === order.id && (

//                 <motion.div

//                   initial={{ height: 0, opacity: 0 }}

//                   animate={{ height: "auto", opacity: 1 }}

//                   exit={{ height: 0, opacity: 0 }}

//                   transition={{ duration: 0.3, ease: "easeOut" }}

//                 >

//                   <div className="border-t border-gray-50 px-8 py-10 bg-gray-50/20">

//                     <div className="flex items-center gap-3 mb-6">

//                       <Truck size={16} className="text-orange-400" />

//                       <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[3px]">

//                         Package Contents

//                       </h3>

//                     </div>


//                     <div className="space-y-4">

//                       {order.items?.map((item, idx) => (

//                         <div

//                           key={idx}

//                           className="flex justify-between items-center bg-white rounded-3xl p-5 border border-gray-100 shadow-sm transition-all hover:border-blue-100 group/item"

//                         >

//                           <div className="flex items-center gap-5">

//                             <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xs font-black text-gray-500 border border-gray-100 group-hover/item:bg-gradient-to-r from-orange-400 to-purple-500 group-hover/item:text-white group-hover/item:border-orange-400 transition-all">

//                               {item.quantity}×

//                             </div>

//                             <div>

//                               <span className="font-bold text-gray-800 text-sm block mb-0.5">

//                                 {item.product_name}

//                               </span>

//                               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">

//                                 Unit Price: ₹{Number(item.product_price).toFixed(2)}

//                               </span>

//                             </div>

//                           </div>


//                           <div className="flex items-center gap-4">
//                             <button
//                               onClick={() => openReviewModal(item)}
//                               className="px-4 py-2 bg-orange-50 text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gradient-to-r from-orange-400 to-purple-500 hover:text-white transition-all border border-orange-100 shadow-sm"
//                             >
//                               {item.user_review ? "Edit Review" : "Write Review"}
//                             </button>
//                             <span className="font-black text-gray-900">
//                               ₹{(Number(item.product_price) * item.quantity).toFixed(2)}
//                             </span>
//                           </div>
//                         </div>

//                       ))}

//                     </div>


//                     <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

//                       <div className="flex items-start gap-4">

//                         <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">

//                           <AlertCircle size={18} className="text-orange-400" />

//                         </div>

//                         <div>

//                           <p className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-1">Payment Info</p>

//                           <p className="text-xs text-gray-400 font-medium capitalize">Method: {order.payment_method?.replace('_', ' ')}</p>

//                           <p className="text-xs text-gray-400 font-medium truncate max-w-[200px]">ID: {order.transaction_id || 'N/A'}</p>

//                         </div>


//                       </div>


//                       <div className="flex gap-3 w-full md:w-auto">

//                         <button

//                           className="flex-1 md:flex-none px-6 py-3 bg-white text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"

//                         >

//                           Need Help?

//                         </button>

//                         <button
//                           onClick={() => navigate(`/track-order/${order.id}`)}
//                           className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-orange-400 to-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-orange-600 hover:to-purple-600 transition-all shadow-xl shadow-orange-200"
//                         >
//                           Track Order
//                         </button>
//                         <button
//                           className="flex-1 md:flex-none px-8 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
//                         >
//                           Invoice

//                         </button>

//                       </div>

//                     </div>

//                   </div>

//                 </motion.div>

//               )}

//             </AnimatePresence>

//           </motion.div>

//         ))

//         }

//       </div >

//       {/* WRITE REVIEW MODAL */}
//       <AnimatePresence>
//         {isReviewModalOpen && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsReviewModalOpen(false)}
//               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//             ></motion.div>
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-8 md:p-12 overflow-hidden"
//             >
//               <button
//                 onClick={() => setIsReviewModalOpen(false)}
//                 className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <FaTimes size={24} />
//               </button>
//               <h2 className="text-3xl font-black text-gray-900 mb-1">{selectedProductId && orders.some(o => o.items.some(i => i.product === selectedProductId && i.user_review)) ? "Edit Review" : "Write a Review"}</h2>
//               <p className="text-[10px] font-black text-orange-400 uppercase tracking-[2px] mb-6">{selectedProductName}</p>

//               <form onSubmit={handleReviewSubmit} className="space-y-6">
//                 <div className="space-y-2">
//                   <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] block">Your Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={newReview.name}
//                     onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
//                     className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-all"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] block">Rating</label>
//                   <div className="flex gap-2">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <button
//                         key={star}
//                         type="button"
//                         onClick={() => setNewReview({ ...newReview, rating: star })}
//                         className={`text-2xl transition-all ${star <= newReview.rating ? "text-yellow-400 scale-110" : "text-gray-200 hover:text-yellow-200"}`}
//                       >
//                         <FaStar />
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] block">Your Comment</label>
//                   <textarea
//                     required
//                     rows="4"
//                     value={newReview.comment}
//                     onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
//                     className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-all resize-none"
//                   ></textarea>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] block">Upload Photo</label>
//                   <div className="flex items-center gap-4">
//                     <label className="cursor-pointer group relative w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition-all overflow-hidden font-bold">
//                       {newReview.imagePreview ? (
//                         <img src={newReview.imagePreview} className="w-full h-full object-cover" alt="Preview" />
//                       ) : (
//                         <FaCamera className="text-gray-400 group-hover:text-orange-400 transition-colors" />
//                       )}
//                       <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
//                     </label>
//                     <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Add a photo to your review</p>
//                   </div>
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className={`w-full py-5 bg-gradient-to-br from-orange-400 to-purple-500 text-white rounded-[24px] font-black text-lg shadow-xl shadow-orange-400/20 hover:shadow-orange-400/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
//                 >
//                   {isSubmitting ? (
//                     <div className="flex items-center gap-3">
//                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                       <span>Processing...</span>
//                     </div>
//                   ) : (
//                     <>
//                       {selectedProductId && orders.some(o => o.items.some(i => String(i.product) === String(selectedProductId) && i.user_review)) ? "Update Review" : "Submit Review"}
//                     </>
//                   )}
//                 </button>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div >

//   );

// }


// export default Orders;
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { FaStar, FaCamera, FaTimes } from "react-icons/fa";
import { getProductDetail, submitReview, deleteReview } from "../../api/axios";
import toast from "react-hot-toast";

import {

  Package,

  Receipt,

  Calendar,

  ChevronDown,

  ChevronUp,

  ShoppingBag,

  AlertCircle,

  Truck,

  ArrowRight,
  Trash2

} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { fetchOrders, fetchProducts } from "../../Store";


function Orders() {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { orders, isLoading, error } = useSelector((state) => state.order);
  const { all: allProducts } = useSelector((state) => state.products);

  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    comment: "",
    image: null,
    imagePreview: null,
    isAltering: false
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReview({
          ...newReview,
          image: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      toast.error("Invalid product ID. Cannot submit review.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('reviewer_name', newReview.name);
      formData.append('rating', newReview.rating);
      formData.append('comment', newReview.comment);
      if (newReview.image) {
        formData.append('pictures', newReview.image);
      }

      await submitReview(selectedProductId, formData);

      setIsReviewModalOpen(false);
      setNewReview({
        name: "",
        rating: 5,
        comment: "",
        image: null,
        imagePreview: null,
        isAltering: false
      });
      toast.success("Review submitted successfully!");
      dispatch(fetchOrders());
      dispatch(fetchProducts());
      navigate(`/product/${selectedProductId}`);
    } catch (err) {
      console.error("Submission error:", err);
      const errorMsg = err.response?.data?.error ||
        (err.response?.data && typeof err.response.data === 'object' ? Object.values(err.response.data)[0] : null) ||
        "Error submitting review";
      toast.error(typeof errorMsg === 'string' ? errorMsg : "Error submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!selectedProductId) {
      toast.error("Invalid product ID. Cannot delete review.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this review?")) return;

    setIsSubmitting(true);
    try {
      await deleteReview(selectedProductId);
      setIsReviewModalOpen(false);
      setNewReview({
        name: "",
        rating: 5,
        comment: "",
        image: null,
        imagePreview: null,
        isAltering: false
      });
      toast.success("Review deleted successfully!");
      dispatch(fetchOrders());
      dispatch(fetchProducts());
    } catch (err) {
      console.error("Deletion error:", err);
      toast.error(err.response?.data?.error || "Error deleting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openReviewModal = (item) => {
    let productId = item.product;

    // Fallback: If product ID is null in the order item, try to find it in the products store by name
    if (!productId && allProducts?.length > 0) {
      const found = allProducts.find(p => p.name === item.product_name);
      if (found) {
        productId = found.id;
      }
    }

    if (!productId) {
      toast.error("Product information missing for this order item. If this is an old order or the product was deleted, it might not be reviewable.");
      return;
    }

    setSelectedProductId(productId);
    setSelectedProductName(item.product_name);

    if (item.user_review) {
      setNewReview({
        name: item.user_review.reviewer_name || "",
        rating: item.user_review.rating || 5,
        comment: item.user_review.comment || "",
        image: null,
        imagePreview: item.user_review.pictures ? `http://127.0.0.1:8000${item.user_review.pictures}` : null,
        isAltering: true
      });
    } else {
      setNewReview({
        name: "",
        rating: 5,
        comment: "",
        image: null,
        imagePreview: null,
        isAltering: false
      });
    }

    setIsReviewModalOpen(true);
  };


  useEffect(() => {

    const token = localStorage.getItem("accessToken");

    if (!token) {

      navigate("/login");

      return;

    }

    dispatch(fetchOrders());
    if (!allProducts || allProducts.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, navigate, allProducts]);

  const toggleExpand = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };


  const getStatusDetails = (order) => {
    const status = (order.status || order.order_status || 'pending').toLowerCase();
    const payment = (order.payment_status || 'pending').toLowerCase();

    // Priority 1: Operational Status (Beyond initial state)
    if (status === 'delivered') return { label: 'Delivered', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', borderColor: 'border-emerald-100', dotColor: 'bg-emerald-500' };
    if (status === 'out_for_delivery') return { label: 'Out for Delivery', bgColor: 'bg-orange-50', textColor: 'text-orange-600', borderColor: 'border-orange-100', dotColor: 'bg-orange-500' };
    if (status === 'shipping') return { label: 'In Transit', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600', borderColor: 'border-indigo-100', dotColor: 'bg-indigo-500' };
    if (status === 'confirmed') return { label: 'Confirmed', bgColor: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-100', dotColor: 'bg-blue-500' };
    if (status === 'cancelled') return { label: 'Cancelled', bgColor: 'bg-red-50', textColor: 'text-red-600', borderColor: 'border-red-100', dotColor: 'bg-red-500' };

    // Priority 2: Payment Status
    if (payment === 'completed') return { label: 'Paid', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', borderColor: 'border-emerald-100', dotColor: 'bg-emerald-500' };
    if (payment === 'failed') return { label: 'Failed', bgColor: 'bg-red-50', textColor: 'text-red-600', borderColor: 'border-red-100', dotColor: 'bg-red-500' };

    return { label: 'Order Placed', bgColor: 'bg-amber-50', textColor: 'text-amber-600', borderColor: 'border-amber-100', dotColor: 'bg-amber-500' };
  };

  if (isLoading) {

    return (

      <div className="min-h-[60vh] flex flex-col items-center justify-center">

        <div className="relative w-16 h-16">

          <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>

          <div className="absolute inset-0 border-4 border-orange-400 rounded-full border-t-transparent animate-spin"></div>

        </div>

        <p className="mt-4 text-gray-500 font-black uppercase tracking-widest text-[10px] animate-pulse">

          Retrieving Orders...

        </p>

      </div>

    );

  }


  if (error) {

    const errorMessage = typeof error === 'string'

      ? error

      : error?.detail || error?.message || "Something went wrong. Please login again.";


    return (

      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">

        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-red-100">

          <AlertCircle size={32} />


        </div>

        <h2 className="text-xl font-black text-gray-900">Oops! Something went wrong</h2>

        <p className="text-gray-400 font-bold text-center mt-2 max-w-xs">{errorMessage}</p>

        <button

          onClick={() => navigate("/login")}

          className="mt-8 px-8 py-3 bg-gradient-to-r from-orange-400 to-purple-500 text-white font-black rounded-xl shadow-lg shadow-orange-400/20 hover:shadow-orange-400/30 transition-all active:scale-95"

        >

          Return to Login
        </button>

      </div>

    );

  }


  if (orders.length === 0) {

    return (

      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">

        <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-[40px] flex items-center justify-center mb-8 border border-gray-100">

          <ShoppingBag size={48} />

        </div>

        <h2 className="text-3xl font-black text-gray-900 tracking-tight">No Orders Found</h2>

        <p className="text-gray-400 font-bold text-center mt-3 max-w-sm leading-relaxed">

          Your order history is currently empty. Start shopping to fill it with amazing products!

        </p>

        <button

          onClick={() => navigate("/")}

          className="mt-10 px-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all flex items-center gap-3 shadow-xl"

        >

          Explore Shop <ArrowRight size={18} />

        </button>

      </div>

    );

  }


  return (

    <div className="max-w-4xl mx-auto px-4 py-16">

      <div className="flex items-center justify-between mb-12">

        <div>

          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">

            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-purple-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-orange-400/20">

              <Receipt size={28} />

            </div>

            Order History

          </h1>

          <p className="text-gray-400 font-bold mt-2 ml-1">Managing {orders.length} orders across your history.</p>

        </div>

      </div>


      <div className="space-y-6">

        {orders.map((order, index) => {
          const status = getStatusDetails(order);
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={order.id || index}
              className="group bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-2xl hover:shadow-gray-200/40 hover:border-orange-100"
            >
              {/* Order Header */}
              <div
                onClick={() => toggleExpand(order.id)}
                className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-orange-400 shadow-inner group-hover:bg-orange-50 transition-colors">
                    <Package size={28} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="font-black text-gray-900 text-lg uppercase tracking-tight">
                        {order.transaction_id || `ORD-${order.id}`}
                      </p>
                      <span className={`text-[9px] font-black uppercase tracking-[2px] px-3 py-1 rounded-full border flex items-center gap-1.5 ${status.bgColor} ${status.textColor} ${status.borderColor}`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${status.dotColor}`}></div>
                        {status.label}
                      </span>
                    </div>


                    <p className="text-[11px] text-gray-400 font-bold flex items-center gap-2 uppercase tracking-widest">

                      <Calendar size={12} className="text-gray-300" />

                      {new Date(order.created_at).toLocaleDateString('en-IN', {

                        day: '2-digit',

                        month: 'short',

                        year: 'numeric',

                        hour: '2-digit',

                        minute: '2-digit'

                      })}

                    </p>

                  </div>

                </div>


                <div className="flex items-center justify-between sm:justify-end gap-10 border-t sm:border-t-0 pt-4 sm:pt-0">

                  <div className="text-left sm:text-right">

                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[2px] mb-0.5">Grand Total</p>

                    <p className="text-2xl font-black text-orange-400 tracking-tighter">

                      ₹{Number(order.total_amount).toFixed(2)}

                    </p>

                  </div>


                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${expandedOrder === order.id ? "bg-gray-900 text-white rotate-180" : "bg-gray-50 text-gray-400"}`}>

                    <ChevronDown size={22} />

                  </div>

                </div>

              </div>


              {/* Order Details */}

              < AnimatePresence >

                {expandedOrder === order.id && (

                  <motion.div

                    initial={{ height: 0, opacity: 0 }}

                    animate={{ height: "auto", opacity: 1 }}

                    exit={{ height: 0, opacity: 0 }}

                    transition={{ duration: 0.3, ease: "easeOut" }}

                  >

                    <div className="border-t border-gray-50 px-8 py-10 bg-gray-50/20">

                      <div className="flex items-center gap-3 mb-6">

                        <Truck size={16} className="text-orange-400" />

                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[3px]">

                          Package Contents

                        </h3>

                      </div>


                      <div className="space-y-4">

                        {order.items?.map((item, idx) => (

                          <div

                            key={idx}

                            className="flex justify-between items-center bg-white rounded-3xl p-5 border border-gray-100 shadow-sm transition-all hover:border-blue-100 group/item"

                          >

                            <div className="flex items-center gap-5">

                              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xs font-black text-gray-500 border border-gray-100 group-hover/item:bg-gradient-to-r from-orange-400 to-purple-500 group-hover/item:text-white group-hover/item:border-orange-400 transition-all">

                                {item.quantity}×

                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black text-gray-900 line-clamp-1 mb-1 group-hover:text-orange-400 transition-colors">
                                  {item.product_name}
                                </h4>
                                {item.user_review && (
                                  <div className="flex flex-col gap-1 mb-2 bg-orange-50/50 p-3 rounded-xl border border-orange-100/50 w-fit max-w-md">
                                    <div className="flex gap-0.5">
                                      {[...Array(5)].map((_, i) => (
                                        <FaStar
                                          key={i}
                                          className={`text-[10px] ${i < item.user_review.rating ? "text-yellow-400" : "text-gray-200"}`}
                                        />
                                      ))}
                                    </div>
                                    <p className="text-[11px] text-gray-600 font-medium italic line-clamp-2">
                                      "{item.user_review.comment}"
                                    </p>
                                  </div>
                                )}
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">

                                    Unit Price: ₹{Number(item.product_price).toFixed(2)}

                                  </span>
                                </div>
                              </div>

                            </div>


                            <div className="flex items-center gap-4">
                              {status.label === 'Delivered' && (
                                item.user_review ? (
                                  item.user_review.can_edit_review ? (
                                    <button
                                      onClick={() => openReviewModal(item)}
                                      className="px-4 py-2 bg-orange-50 text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gradient-to-r from-orange-400 to-purple-500 hover:text-white transition-all border border-orange-100 shadow-sm"
                                    >
                                      Alter the Review
                                    </button>
                                  ) : (
                                    <span className="text-[9px] font-black text-gray-400 uppercase bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 tracking-wider">
                                      Review Closed
                                    </span>
                                  )
                                ) : (
                                  <button
                                    onClick={() => openReviewModal(item)}
                                    className="px-4 py-2 bg-orange-50 text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gradient-to-r from-orange-400 to-purple-500 hover:text-white transition-all border border-orange-100 shadow-sm"
                                  >
                                    Write a Review
                                  </button>
                                )
                              )}
                              <span className="font-black text-gray-900">
                                ₹{(Number(item.product_price) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>

                        ))}

                      </div>


                      <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                        <div className="flex items-start gap-4">

                          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">

                            <AlertCircle size={18} className="text-orange-400" />

                          </div>

                          <div>

                            <p className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-1">Payment Info</p>

                            <p className="text-xs text-gray-400 font-medium capitalize">Method: {order.payment_method?.replace('_', ' ')}</p>

                            <p className="text-xs text-gray-400 font-medium truncate max-w-[200px]">ID: {order.transaction_id || 'N/A'}</p>

                          </div>


                        </div>


                        <div className="flex gap-3 w-full md:w-auto">

                          <button

                            className="flex-1 md:flex-none px-6 py-3 bg-white text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"

                          >

                            Need Help?

                          </button>

                          <button
                            onClick={() => navigate(`/track-order/${order.id}`)}
                            className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-orange-400 to-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-orange-600 hover:to-purple-600 transition-all shadow-xl shadow-orange-200"
                          >
                            Track Order
                          </button>
                          <button
                            onClick={() => {
                              const handleGetInvoice = async (orderId, orderNumber) => {
                                try {
                                  const token = localStorage.getItem("accessToken");
                                  const response = await fetch(`http://localhost:8000/invoice/${orderId}`, {
                                    headers: {
                                      'Authorization': `Bearer ${token}`
                                    }
                                  });
                                  const responseText = await response.text();
                                  if (!response.ok) {
                                    throw new Error(responseText || "Failed to fetch invoice");
                                  }

                                  const blob = new Blob([responseText], { type: 'text/html' });
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `Invoice_${orderNumber}.html`;
                                  document.body.appendChild(a);
                                  a.click();
                                  window.URL.revokeObjectURL(url);
                                  document.body.removeChild(a);

                                  toast.success("Invoice downloaded");
                                } catch (error) {
                                  console.error(error);
                                  toast.error("Failed to download invoice");
                                }
                              };
                              handleGetInvoice(order.id, order.order_number);
                            }}
                            className="flex-1 md:flex-none px-8 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                          >
                            Invoice

                          </button>

                        </div>

                      </div>

                    </div>

                  </motion.div>

                )}

              </AnimatePresence>

            </motion.div>
          );
        })}

      </div >

      {/* WRITE REVIEW MODAL */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-8 md:p-12 overflow-hidden"
            >
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={24} />
              </button>
              <div className="flex items-center justify-between pr-10">
                <h2 className="text-3xl font-black text-gray-900 mb-1">
                  {newReview.isAltering ? "Alter the Review" : "Write a Review"}
                </h2>
                {newReview.isAltering && (
                  <button
                    type="button"
                    onClick={handleDeleteReview}
                    className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 group"
                    title="Delete Review"
                  >
                    <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-[2px] mb-6">{selectedProductName}</p>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] block">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] block">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className={`text-2xl transition-all ${star <= newReview.rating ? "text-yellow-400 scale-110" : "text-gray-200 hover:text-yellow-200"}`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] block">Your Comment</label>
                  <textarea
                    required
                    rows="4"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-all resize-none"
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] block">Upload Photo</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer group relative w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition-all overflow-hidden font-bold">
                      {newReview.imagePreview ? (
                        <img src={newReview.imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <FaCamera className="text-gray-400 group-hover:text-orange-400 transition-colors" />
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Add a photo to your review</p>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-5 bg-gradient-to-br from-orange-400 to-purple-500 text-white rounded-[24px] font-black text-lg shadow-xl shadow-orange-400/20 hover:shadow-orange-400/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      {newReview.isAltering ? "Update Review" : "Submit Review"}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div >

  );

}


export default Orders;