import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
    approved: false
  });

  const [previews, setPreviews] = useState([]);

  const [customCategory, setCustomCategory] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });

    if (name === 'category' && value !== 'Other') {
      setCustomCategory("");
    }
  };

  // ✅ Pick many images + add more later
  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    Promise.all(
      files.map(file =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
      )
    ).then((newImages) => {
      setProduct(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));

      setPreviews(prev => [...prev, ...newImages]);
    });
  };

  // ✅ Remove single image
  const removeImage = (index) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));

    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const submitProduct = () => {
    if (!product.name || !product.price) {
      alert("Please fill required fields");
      return;
    }

    if (product.category === 'Other' && !customCategory.trim()) {
      alert('Please specify a category');
      return;
    }

    const existing = JSON.parse(localStorage.getItem("products")) || [];

    existing.push({
      ...product,
      category: product.category === 'Other' ? customCategory.trim() : product.category,
      id: Date.now()
    });

    localStorage.setItem("products", JSON.stringify(existing));

    alert("Submitted for approval!");
    navigate("/vendorallproducts");
  };

  return (
    
    <div>
      <h1 className="text-2xl font-bold mb-6">Product Information</h1>

      <div>

        {/* NAME */}
        <label className="text-sm font-semibold">Product Name *</label>
        <input
          name="name"
          placeholder="Enter product name"
          value={product.name}
          onChange={handleChange}
          className="w-full bg-gray-50 border rounded-md px-4 py-3 mt-2 mb-4"
        />

        {/* DESCRIPTION */}
        <label className="text-sm font-semibold">Description *</label>
        <textarea
          name="description"
          placeholder="Enter product description"
          rows="4"
          value={product.description}
          onChange={handleChange}
          className="w-full bg-gray-50 border rounded-md px-4 py-3 mt-2 mb-4"
        />

        {/* PRICE + STOCK */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">

          <div>
            <label className="text-sm font-semibold">Price ($) *</label>
            <input
              name="price"
              placeholder="0.00"
              value={product.price}
              onChange={handleChange}
              className="w-full bg-gray-50 border rounded-md px-4 py-3 mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Stock Quantity *</label>
            <input
              name="stock"
              placeholder="0"
              value={product.stock}
              onChange={handleChange}
              className="w-full bg-gray-50 border rounded-md px-4 py-3 mt-2"
            />
          </div>

        </div>

        {/* CATEGORY */}
        <label className="text-sm font-semibold">Category *</label>
        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          className="w-full bg-gray-50 border rounded-md px-4 py-3 mt-2 mb-4"
        >
          <option value="">Select a category</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Groceries</option>
          <option>Home</option>
          <option>Other</option>
        </select>

        {product.category === 'Other' && (
          <div className="mb-4">
            <label className="text-sm font-semibold">Specify Category *</label>
            <input
              name="customCategory"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter category"
              className="w-full bg-gray-50 border rounded-md px-4 py-3 mt-2"
            />
          </div>
        )}

        {/* MULTIPLE IMAGE PICKER */}
        <label className="text-sm font-semibold">Product Images *</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImages}
          className="w-full bg-gray-50 border rounded-md px-4 py-3 mt-2 mb-4"
        />

        {/* IMAGE PREVIEW + REMOVE */}
        <div className="flex gap-3 flex-wrap mb-8">
          {previews.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img}
                alt=""
                className="w-24 h-24 object-cover rounded"
              />

              <button
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">

          <button
            onClick={submitProduct}
            className="flex-1 bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-900"
          >
            Submit for Approval
          </button>

          <button
            onClick={() => navigate("/products")}
            className="flex-1 border py-3 rounded-md font-semibold"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}
