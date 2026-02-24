import { useEffect, useState } from "react";
import { getVendorProducts, deleteVendorProduct, updateVendorProduct, API_BASE_URL } from "../../api/vendor_axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBoxOpen,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaUpload,
  FaTag
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";



export default function ProductList() {
  const { isDarkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sliderIndices, setSliderIndices] = useState({});
  const [viewSliderIndex, setViewSliderIndex] = useState(0);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getVendorProducts();
      const list = Array.isArray(data) ? data : (data.results || []);
      setProducts(list);
      const indices = {};
      list.forEach((_, i) => indices[i] = 0);
      setSliderIndices(indices);
    } catch (error) {
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteVendorProduct(id);
      toast.success("Product removed");
      loadProducts();
    } catch (error) {
      toast.error("Failed to remove product");
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...editingProduct };
      if (payload.stock) payload.quantity = payload.stock;
      await updateVendorProduct(editingProduct.id, payload);
      toast.success("Changes saved");
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const cycleSlider = (i, delta) => {
    const total = products[i].images?.length || 1;
    setSliderIndices(prev => ({
      ...prev,
      [i]: (prev[i] + delta + total) % total
    }));
  };

  if (loading && products.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] transition-colors duration-300 ${isDarkMode ? 'bg-transparent' : 'bg-transparent'}`}>
        <div className={`w-12 h-12 border-4 rounded-full animate-spin mb-4 ${isDarkMode ? 'border-slate-800 border-t-teal-400' : 'border-slate-200 border-t-teal-500'}`}></div>
        <p className={`text-[10px] font-semibold uppercase tracking-normal ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Scanning inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10 font-['Inter']">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-semibold tracking-normal flex items-center gap-4  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-teal-400/20">
              <FaBoxOpen size={22} />
            </div>
            My Products
          </h1>
          <p className="text-[10px] font-semibold uppercase tracking-normal text-gray-500 mt-3 ml-1">
            Total Items: {products.length}
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/vendoraddproduct'}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-teal-500 text-white rounded-2xl text-[10px] font-semibold uppercase tracking-normal hover:bg-teal-400 transition-all shadow-xl shadow-teal-400/20 group"
        >
          <FaPlus className="group-hover:rotate-90 transition-transform" />
          Add New Item
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {products.map((product, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={product.id}
              className={`rounded-[32px] md:rounded-[40px] border p-6 shadow-2xl transition-all group relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-teal-400/30' : 'bg-white border-slate-100 hover:border-indigo-200 shadow-teal-400/5'}`}
            >
              <div className={`relative h-48 md:h-56 w-full mb-6 rounded-[24px] md:rounded-[32px] overflow-hidden border flex items-center justify-center ${isDarkMode ? 'bg-[#020617] border-slate-800' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                {product.images?.length > 0 ? (
                  <>
                    <img
                      src={product.images[sliderIndices[i]]?.url?.startsWith('http') ? product.images[sliderIndices[i]].url : `${API_BASE_URL}${product.images[sliderIndices[i]]?.url}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={product.name}
                    />
                    {product.images.length > 1 && (
                      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); cycleSlider(i, -1); }} className="p-2 bg-teal-500/90 backdrop-blur-md rounded-full text-white shadow-lg"><FaChevronLeft size={10} /></button>
                        <button onClick={(e) => { e.stopPropagation(); cycleSlider(i, 1); }} className="p-2 bg-teal-500/90 backdrop-blur-md rounded-full text-white shadow-lg"><FaChevronRight size={10} /></button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={`flex flex-col items-center gap-2 ${isDarkMode ? 'text-gray-700' : 'text-slate-300'}`}>
                    <FaUpload size={24} />
                    <p className="text-[10px] font-semibold uppercase tracking-widest ">No image</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className={`text-lg font-semibold tracking-normal  uppercase line-clamp-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{product.name}</h3>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-1 flex items-center gap-2 truncate">
                      <FaTag size={8} />
                      {product.category}
                    </p>
                  </div>
                  <div className={`px-3 py-2 border rounded-xl ${isDarkMode ? 'bg-teal-400/10 border-teal-400/20' : 'bg-indigo-50 border-indigo-100 shadow-sm'}`}>
                    <p className="text-base font-semibold text-indigo-400 tracking-normal">₹{product.price}</p>
                  </div>
                </div>

                <div className={`w-fit px-4 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-widest ${product.quantity > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  Stock: {product.quantity}
                </div>

                <div className={`grid grid-cols-3 gap-3 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <button
                    onClick={() => { setViewingProduct(product); setViewSliderIndex(0); }}
                    className={`p-4 border text-gray-500 transition-all flex items-center justify-center rounded-2xl ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-white/10 hover:text-white' : 'bg-white border-slate-200 hover:bg-slate-50 hover:text-teal-500 shadow-sm'}`}
                    title="View"
                  >
                    <FaEye size={16} />
                  </button>
                  <button
                    onClick={() => setEditingProduct(product)}
                    className={`p-4 border text-gray-500 transition-all flex items-center justify-center rounded-2xl ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-white/10 hover:text-white' : 'bg-white border-slate-200 hover:bg-slate-50 hover:text-teal-500 shadow-sm'}`}
                    title="Edit"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className={`p-4 border text-gray-500 transition-all flex items-center justify-center rounded-2xl ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-rose-500/20 hover:text-rose-400' : 'bg-white border-slate-200 hover:bg-rose-50 hover:text-rose-400 shadow-sm'}`}
                    title="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* VIEW MODAL */}
      <AnimatePresence>
        {viewingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#020617]/90 backdrop-blur-xl" onClick={() => setViewingProduct(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`rounded-[32px] md:rounded-[56px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-3xl p-6 md:p-12 relative border ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setViewingProduct(null)} className={`absolute top-6 md:top-10 right-6 md:right-10 p-3 rounded-full transition-all z-10 border flex items-center justify-center ${isDarkMode ? 'bg-slate-900 hover:bg-white/10 text-white border-slate-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'}`}><FaTimes size={18} /></button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 overflow-y-auto max-h-[75vh] pr-2 custom-scrollbar text-left">
                <div className="space-y-6">
                  <div className={`h-64 sm:h-80 md:h-96 w-full rounded-[24px] md:rounded-[48px] overflow-hidden border flex items-center justify-center shadow-inner ${isDarkMode ? 'bg-[#020617] border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <img
                      src={viewingProduct.images[viewSliderIndex]?.url?.startsWith('http') ? viewingProduct.images[viewSliderIndex].url : `${API_BASE_URL}${viewingProduct.images[viewSliderIndex]?.url}`}
                      className="w-full h-full object-contain"
                      alt="Product"
                    />
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {viewingProduct.images?.map((img, idx) => (
                      <button key={idx} onClick={() => setViewSliderIndex(idx)} className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 transition-all overflow-hidden flex-shrink-0 ${viewSliderIndex === idx ? 'border-teal-400 scale-105 shadow-lg' : isDarkMode ? 'border-slate-800 bg-[#020617]' : 'border-slate-100 bg-slate-50'}`}>
                        <img src={img.url?.startsWith('http') ? img.url : `${API_BASE_URL}${img.url}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-8 md:space-y-10 py-2 md:py-6">
                  <div>
                    <h2 className={`text-3xl md:text-4xl font-semibold tracking-normal  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{viewingProduct.brand} {viewingProduct.name}</h2>
                    <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-normal mt-2 ">{viewingProduct.category}</p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Description</p>
                    <p className={`font-medium leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{viewingProduct.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className={`p-5 md:p-6 border rounded-2xl md:rounded-3xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                      <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest mb-1">Price</p>
                      <p className="text-xl md:text-2xl font-semibold text-indigo-400 tracking-normal ">₹{viewingProduct.price}</p>
                    </div>
                    <div className={`p-5 md:p-6 border rounded-2xl md:rounded-3xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                      <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest mb-1">Stock</p>
                      <p className={`text-xl md:text-2xl font-semibold tracking-normal  ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{viewingProduct.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {editingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#020617]/90 backdrop-blur-xl" onClick={() => setEditingProduct(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`rounded-[32px] md:rounded-[56px] w-full max-w-2xl shadow-3xl p-8 md:p-12 relative border ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'}`}
              onClick={e => e.stopPropagation()}
            >
              <h2 className={`text-2xl md:text-3xl font-semibold tracking-normal  uppercase mb-8 md:mb-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Edit Item Details</h2>
              <form onSubmit={updateProduct} className="space-y-6">
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Product Name</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className={`w-full p-4 md:p-5 border-2 border-transparent focus:border-teal-400 rounded-2xl md:rounded-3xl outline-none font-semibold text-sm  transition-all shadow-inner ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}
                    placeholder="Item Name"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Brand</label>
                  <input
                    type="text"
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className={`w-full p-4 md:p-5 border-2 border-transparent focus:border-teal-400 rounded-2xl md:rounded-3xl outline-none font-semibold text-sm  transition-all shadow-inner ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}
                    placeholder="Brand"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Price (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      className={`w-full p-4 md:p-5 border-2 border-transparent focus:border-teal-400 rounded-2xl md:rounded-3xl outline-none font-semibold text-sm transition-all shadow-inner ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Stock</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                      className={`w-full p-4 md:p-5 border-2 border-transparent focus:border-teal-400 rounded-2xl md:rounded-3xl outline-none font-semibold text-sm transition-all shadow-inner ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Description</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className={`w-full p-4 md:p-5 border-2 border-transparent focus:border-teal-400 rounded-2xl md:rounded-3xl outline-none font-medium text-sm h-32 transition-all shadow-inner ${isDarkMode ? 'bg-slate-900 text-gray-300' : 'bg-slate-50 text-slate-600'}`}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-6">
                  <button type="submit" className="flex-1 py-4 md:py-5 bg-teal-500 text-white text-[10px] font-semibold uppercase tracking-normal rounded-2xl hover:bg-teal-400 transition-all shadow-lg shadow-teal-400/20">Save Changes</button>
                  <button type="button" onClick={() => setEditingProduct(null)} className={`flex-1 py-4 md:py-5 border text-[10px] font-semibold uppercase tracking-normal rounded-2xl transition-all ${isDarkMode ? 'bg-slate-900 text-gray-400 hover:bg-white/10 border-slate-800' : 'bg-white text-slate-400 hover:bg-slate-50 border-slate-200 shadow-sm'}`}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
