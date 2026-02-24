import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { add_Product } from "../../api/vendor_axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaCloudUploadAlt,
  FaTimes,
  FaBoxOpen,
  FaTag,
  FaDollarSign,
  FaLayerGroup,
  FaInfoCircle
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

export default function AddProduct() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
    approved: false,
  });

  const [previews, setPreviews] = useState([]);
  const [customCategory, setCustomCategory] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    if (name === "category" && value !== "other") {
      setCustomCategory("");
    }
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    ).then((newImages) => {
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
      setPreviews((prev) => [...prev, ...newImages]);
    });
  };

  const removeImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.stock || !product.category) {
      toast.error("Please fill all required fields");
      return;
    }

    if (product.category === "other" && !customCategory.trim()) {
      toast.error("Please specify a category");
      return;
    }

    if (product.images.length < 4) {
      toast.error("Please upload at least 4 images");
      return;
    }

    try {
      setLoading(true);
      await add_Product({
        ...product,
        category: product.category === "other" ? customCategory.trim() : product.category,
      });
      toast.success("Product added successfully! Waiting for approval.");
      navigate("/vendorallproducts");
    } catch (error) {
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10 font-['Inter']">
      <header className="mb-8 md:mb-12">
        <h1 className={`text-3xl md:text-4xl font-semibold tracking-normal flex items-center gap-4  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-teal-400/20">
            <FaPlus size={22} />
          </div>
          Add New Product
        </h1>
        <p className="text-[10px] font-semibold uppercase tracking-normal text-gray-500 mt-3 ml-1 ">
          List a new item in your store
        </p>
      </header>

      <form onSubmit={submitProduct} className="space-y-8 md:space-y-10">
        <div className={`rounded-[40px] md:rounded-[48px] border p-6 md:p-12 shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30"></div>

          {/* Basic Info */}
          <div className="space-y-6 relative z-10">
            <label className="text-[10px] font-semibold uppercase tracking-normal text-gray-500 flex items-center gap-2 ">
              <FaInfoCircle size={10} className="text-indigo-400" /> Basic Details
            </label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Product Name"
              className={`w-full p-4 md:p-5 border-2 border-transparent focus:border-teal-500 rounded-2xl md:rounded-3xl outline-none font-semibold text-sm  transition-all shadow-inner ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-800'}`}
            />
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              placeholder="Product Brand"
              className={`w-full p-4 md:p-5 border-2 border-transparent focus:border-teal-500 rounded-2xl md:rounded-3xl outline-none font-semibold text-sm  transition-all shadow-inner ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-800'}`}
            />
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Product Description"
              rows="4"
              className={`w-full p-4 md:p-5 border-2 border-transparent focus:border-teal-500 rounded-2xl md:rounded-3xl outline-none font-medium text-sm transition-all h-32 md:h-40 shadow-inner ${isDarkMode ? 'bg-[#020617] text-gray-300' : 'bg-slate-50 text-slate-600'}`}
            />
          </div>

          {/* Pricing and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 relative z-10">
            <div className="space-y-6">
              <label className="text-[10px] font-semibold uppercase tracking-normal text-gray-500 flex items-center gap-2 ">
                <FaDollarSign size={10} className="text-emerald-400" /> Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="500"
                className={`w-full p-4 md:p-5 border-2 border-transparent focus:border-teal-500 rounded-2xl md:rounded-3xl outline-none font-semibold text-sm transition-all shadow-inner ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-800'}`}
              />
            </div>
            <div className="space-y-6">
              <label className="text-[10px] font-semibold uppercase tracking-normal text-gray-500 flex items-center gap-2 ">
                <FaBoxOpen size={10} className="text-amber-400" /> Initial Stock
              </label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                placeholder="10"
                className={`w-full p-4 md:p-5 border-2 border-transparent focus:border-teal-500 rounded-2xl md:rounded-3xl outline-none font-semibold text-sm transition-all shadow-inner ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-800'}`}
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-6 relative z-10">
            <label className="text-[10px] font-semibold uppercase tracking-normal text-gray-500 flex items-center gap-2 ">
              <FaLayerGroup size={10} className="text-purple-400" /> Category
            </label>
            <div className="relative">
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className={`w-full p-4 md:p-5 border-2 border-transparent focus:border-teal-500 rounded-2xl md:rounded-3xl outline-none font-semibold text-sm  transition-all appearance-none cursor-pointer shadow-inner ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-800'}`}
              >
                <option value="">Select Category</option>
                <option value="electronics" className={!isDarkMode ? 'text-slate-800' : ''}>Electronics</option>
                <option value="fashion" className={!isDarkMode ? 'text-slate-800' : ''}>Fashion</option>
                <option value="grocery" className={!isDarkMode ? 'text-slate-800' : ''}>Groceries</option>
                <option value="home_kitchen" className={!isDarkMode ? 'text-slate-800' : ''}>Home & Kitchen</option>
                <option value="beauty_personal_care" className={!isDarkMode ? 'text-slate-800' : ''}>Beauty & Personal Care</option>
                <option value="sports_fitness" className={!isDarkMode ? 'text-slate-800' : ''}>Sports & Fitness</option>
                <option value="other" className={!isDarkMode ? 'text-slate-800' : ''}>Other</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <FaLayerGroup size={14} />
              </div>
            </div>

            {product.category === "other" && (
              <motion.input
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter custom category"
                className={`w-full p-4 md:p-5 border-2 border-transparent focus:border-teal-500 rounded-2xl md:rounded-3xl outline-none font-semibold text-sm  transition-all mt-4 shadow-inner ${isDarkMode ? 'bg-teal-400/10 text-white' : 'bg-indigo-50 text-indigo-900'}`}
              />
            )}
          </div>
        </div>

        {/* Media Upload */}
        <div className={`rounded-[40px] md:rounded-[48px] border p-6 md:p-12 shadow-2xl space-y-8 relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
            <label className="text-[10px] font-semibold uppercase tracking-normal text-gray-500 flex items-center gap-2 ">
              <FaCloudUploadAlt size={14} className="text-indigo-400" /> Product Images
            </label>
            <span className={`text-[9px] font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border ${product.images.length >= 4 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
              {product.images.length} / 4 Required
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 relative z-10">
            <AnimatePresence>
              {previews.map((img, i) => (
                <motion.div
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  key={i}
                  className={`relative aspect-square rounded-[24px] md:rounded-[32px] overflow-hidden border group shadow-lg ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}
                >
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 p-2 bg-rose-400 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <FaTimes size={10} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            <label className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-[24px] md:rounded-[32px] hover:border-teal-400 transition-all cursor-pointer group shadow-inner ${isDarkMode ? 'border-slate-800 bg-slate-900 hover:bg-teal-400/5' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}>
              <FaCloudUploadAlt size={28} className={`mb-2 transition-colors ${isDarkMode ? 'text-gray-600 group-hover:text-indigo-400' : 'text-slate-400 group-hover:text-teal-500'}`} />
              <p className={`text-[8px] font-semibold uppercase tracking-widest transition-colors ${isDarkMode ? 'text-gray-600 group-hover:text-indigo-400' : 'text-slate-400 group-hover:text-teal-500'}`}>Upload</p>
              <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
            </label>
          </div>
        </div>

        {/* Final Actions */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-5 md:py-6 bg-teal-500 text-white text-[10px] font-semibold uppercase tracking-normal rounded-[24px] md:rounded-[32px] hover:bg-teal-400 transition-all shadow-xl shadow-teal-400/30 disabled:opacity-50"
          >
            {loading ? "Adding Product..." : "Submit Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/vendorallproducts")}
            className={`px-10 py-5 md:py-6 border text-[10px] font-semibold uppercase tracking-normal rounded-[24px] md:rounded-[32px] transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-gray-500 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}
          >
            Cancel
          </button>
        </div>
      </form>

      <style>{`
  .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`}</style>
    </div>
  );
}
