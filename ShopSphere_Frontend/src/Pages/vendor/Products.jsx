import React, { useEffect, useState } from "react";
import { fetchVendorProducts, updateProduct, delete_Product, toggleProductBlock } from "../../api/vendor_axios";
import { toast } from "react-hot-toast";
import { getUserInfo } from "../../api/axios";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const [sliderIndex, setSliderIndex] = useState({});
  const [viewSliderIndex, setViewSliderIndex] = useState(0);

  useEffect(() => {
    loadProducts();
    loadUser();
  }, []);

  const loadUser = async () => {
    const data = await getUserInfo();
    setUser(data);
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchVendorProducts();
      // Handle paginated response or direct array
      const productList = data.results || data || [];
      setProducts(productList);
      const initialIndex = {};
      productList.forEach(p => initialIndex[p.id] = 0);
      setSliderIndex(initialIndex);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (productId) => {
    try {
      const result = await toggleProductBlock(productId);
      toast.success(result.is_blocked ? "Product Blocked" : "Product Unblocked");
      loadProducts();
    } catch (error) {
      toast.error("Failed to toggle block status");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await delete_Product(productId);
      toast.success("Product deleted successfully");
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setEditForm({ ...product });
    setNewImages([]);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const handleSaveEdit = async () => {
    try {
      await updateProduct(editingProduct.id, {
        ...editForm,
        newImages: newImages
      });
      toast.success("Product updated successfully");
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.error || "Failed to update product");
    }
  };

  const nextSlide = (id, total) => {
    setSliderIndex(prev => ({
      ...prev,
      [id]: (prev[id] + 1) % total
    }));
  };

  const prevSlide = (id, total) => {
    setSliderIndex(prev => ({
      ...prev,
      [id]: (prev[id] - 1 + total) % total
    }));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/public/placeholder.jpg";
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/media/')) return `http://localhost:8000${imagePath}`;
    if (imagePath.startsWith('media/')) return `http://localhost:8000/${imagePath}`;
    return `http://localhost:8000/media/${imagePath}`;
  };

  if (loading) return <div className="p-8 text-center">Loading products...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Product Management</h2>
        <span className="bg-gray-100 px-4 py-2 rounded-xl">
          Total: {products.length}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow p-5 relative flex flex-col">
            {/* IMAGE SLIDER */}
            <div className="relative mb-3 aspect-square overflow-hidden rounded-xl">
              {p.images?.length > 0 ? (
                <>
                  <img
                    src={getImageUrl(p.images[sliderIndex[p.id]]?.image)}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                  {p.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevSlide(p.id, p.images.length); }}
                        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                      >
                        ‹
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextSlide(p.id, p.images.length); }}
                        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                      >
                        ›
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {p.images.map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === sliderIndex[p.id] ? 'bg-white' : 'bg-white/50'}`} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              {p.is_blocked && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Blocked
                </div>
              )}
            </div>

            <h3 className="font-bold text-lg line-clamp-1">{p.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{p.description || <span className="italic text-gray-400">No description</span>}</p>
            <div className="flex justify-between items-baseline mt-2">
              <p className="text-emerald-600 font-bold text-xl">₹ {p.price}</p>
              <p className="text-sm text-gray-500">Qty: {p.quantity}</p>
            </div>
            <p className="text-sm text-gray-400 mt-1 uppercase tracking-wider">{p.category}</p>

            <div className="flex gap-2 mt-auto pt-4 flex-wrap">
              <button
                onClick={() => startEdit(p)}
                className="flex-1 min-w-[80px] border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => setViewProduct(p)}
                className="flex-1 min-w-[80px] border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                View
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => handleToggleBlock(p.id)}
                  className={`flex-1 min-w-[80px] border rounded-lg py-2 transition-colors text-sm font-medium ${p.is_blocked
                    ? "border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
                    : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                >
                  {p.is_blocked ? "Unblock" : "Block"}
                </button>
              )}
              <button
                onClick={() => handleDelete(p.id)}
                className="p-2 border border-red-100 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl mt-8">
          <p className="text-gray-500">No products added yet.</p>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    value={editForm.price}
                    onChange={handleEditChange}
                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    name="quantity"
                    type="number"
                    value={editForm.quantity}
                    onChange={handleEditChange}
                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home_kitchen">Home & Kitchen</option>
                  <option value="grocery">Groceries</option>
                  <option value="beauty_personal_care">Beauty & Personal Care</option>
                  <option value="sports_fitness">Sports & Fitness</option>
                  <option value="toys_games">Toys & Games</option>
                  <option value="automotive">Automotive</option>
                  <option value="books">Books</option>
                  <option value="services">Services</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Add New Images (Replace All)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-dashed rounded-xl p-4 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Note: Uploading new images will replace all existing images.</p>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>

            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewProduct && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl relative shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Product Details</h2>

            <div className="relative aspect-video mb-6 rounded-2xl overflow-hidden bg-gray-100">
              {viewProduct.images?.length > 0 ? (
                <>
                  <img
                    src={getImageUrl(viewProduct.images[viewSliderIndex]?.image)}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                  {viewProduct.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setViewSliderIndex((viewSliderIndex - 1 + viewProduct.images.length) % viewProduct.images.length)}
                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => setViewSliderIndex((viewSliderIndex + 1) % viewProduct.images.length)}
                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md"
                      >
                        ›
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{viewProduct.name}</h3>
                  <p className="text-gray-500 uppercase text-xs tracking-widest mt-1">{viewProduct.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">₹ {viewProduct.price}</p>
                  <p className="text-sm text-gray-500">Stock: {viewProduct.quantity}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                <p className="text-gray-700 leading-relaxed">{viewProduct.description || "No description provided."}</p>
              </div>

              {viewProduct.is_blocked && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
                  <p className="text-sm font-bold">Blocked by Admin</p>
                  <p className="text-sm">{viewProduct.blocked_reason || "No reason specified."}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setViewProduct(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mt-8">
              <button
                onClick={() => setViewProduct(null)}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
