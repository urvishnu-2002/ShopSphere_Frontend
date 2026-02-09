import { useEffect, useState } from "react";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [previews, setPreviews] = useState([]);
  const [sliderIndex, setSliderIndex] = useState({});
  const [viewIndex, setViewIndex] = useState(null); // New state for view modal
  const [viewSliderIndex, setViewSliderIndex] = useState(0); // Image slider in view

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const saved = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(saved);
    const initialIndex = {};
    saved.forEach((_, i) => initialIndex[i] = 0);
    setSliderIndex(initialIndex);
  };

  const deleteProduct = (index) => {
    if (!window.confirm("Delete this product?")) return;
    const updated = [...products];
    updated.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(updated));
    setProducts(updated);
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditedProduct(products[index]);
    setPreviews(products[index].images || []);
  };

  const handleEditChange = (e) => {
    setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map(file =>
        new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
      )
    ).then((imgs) => {
      setEditedProduct(prev => ({
        ...prev,
        images: [...(prev.images || []), ...imgs]
      }));
      setPreviews(prev => [...prev, ...imgs]);
    });
  };

  const removeImage = (index) => {
    setEditedProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const saveEdit = () => {
    const updated = [...products];
    updated[editingIndex] = editedProduct;
    localStorage.setItem("products", JSON.stringify(updated));
    setProducts(updated);
    setEditingIndex(null);
  };

  const nextSlide = (i) => {
    setSliderIndex(prev => ({
      ...prev,
      [i]: (prev[i] + 1) % (products[i].images?.length || 1)
    }));
  };

  const prevSlide = (i) => {
    setSliderIndex(prev => ({
      ...prev,
      [i]: (prev[i] - 1 + (products[i].images?.length || 1)) % (products[i].images?.length || 1)
    }));
  };

  const nextViewSlide = () => {
    if (!products[viewIndex]?.images) return;
    setViewSliderIndex((viewSliderIndex + 1) % products[viewIndex].images.length);
  };

  const prevViewSlide = () => {
    if (!products[viewIndex]?.images) return;
    setViewSliderIndex((viewSliderIndex - 1 + products[viewIndex].images.length) % products[viewIndex].images.length);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 relative">

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Product Management</h2>
        <span className="bg-gray-100 px-4 py-2 rounded-xl">
          Total: {products.length}
        </span>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid md:grid-cols-3 gap-8">
        {products.map((p, i) => (
          <div key={i} className="bg-white rounded-2xl shadow p-5 relative">

            {/* IMAGE SLIDER */}
            <div className="relative mb-3">
              {p.images?.length > 0 ? (
                <>
                  <img
                    src={p.images[sliderIndex[i]]}
                    className="h-44 w-full object-cover rounded-xl"
                  />
                  {p.images.length > 1 && (
                    <>
                      <button
                        onClick={() => prevSlide(i)}
                        className="absolute top-1/2 left-2 bg-white px-2 py-1 rounded-full text-lg"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => nextSlide(i)}
                        className="absolute top-1/2 right-2 bg-white px-2 py-1 rounded-full text-lg"
                      >
                        ›
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="h-44 w-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            <h3 className="font-bold text-lg">{p.name}</h3>
            <p className="text-emerald-600 font-semibold mt-1">₹ {p.price}</p>
            <p className="text-sm text-gray-500">{p.category}</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => startEdit(i)}
                className="flex-1 border rounded-lg py-2 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => setViewIndex(i)}
                className="flex-1 border rounded-lg py-2 hover:bg-gray-100"
              >
                View
              </button>
              <button
                onClick={() => deleteProduct(i)}
                className="flex-1 bg-red-500 text-white rounded-lg py-2 hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-20">No products added yet.</p>
      )}

      {/* EDIT OVERLAY */}
      {editingIndex !== null && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-2xl relative shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

            <input
              name="name"
              value={editedProduct.name}
              onChange={handleEditChange}
              className="border rounded-lg p-2 w-full mb-2"
              placeholder="Product Name"
            />
            <textarea
              name="description"
              value={editedProduct.description}
              onChange={handleEditChange}
              className="border rounded-lg p-2 w-full mb-2"
              rows={3}
              placeholder="Description"
            />
            <input
              name="price"
              value={editedProduct.price}
              onChange={handleEditChange}
              className="border rounded-lg p-2 w-full mb-2"
              placeholder="Price"
            />
            <input
              name="stock"
              value={editedProduct.stock}
              onChange={handleEditChange}
              className="border rounded-lg p-2 w-full mb-2"
              placeholder="Stock"
            />
            <input
              name="category"
              value={editedProduct.category}
              onChange={handleEditChange}
              className="border rounded-lg p-2 w-full mb-2"
              placeholder="Category"
            />

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
              className="border rounded-lg p-2 w-full mb-3"
            />

            {/* IMAGE PREVIEWS */}
            <div className="flex gap-2 flex-wrap mb-4">
              {previews.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img} className="w-24 h-24 object-cover rounded" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={saveEdit}
                className="flex-1 bg-emerald-500 text-white py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setEditingIndex(null)}
                className="flex-1 border py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>

            <button
              onClick={() => setEditingIndex(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* VIEW OVERLAY */}
      {viewIndex !== null && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-2xl relative shadow-xl">
            <h2 className="text-2xl font-bold mb-4">View Product</h2>

            {/* IMAGE SLIDER */}
            <div className="relative mb-4">
              {products[viewIndex]?.images?.length > 0 ? (
                <>
                  <img
                    src={products[viewIndex].images[viewSliderIndex]}
                    className="h-44 w-full object-cover rounded-xl"
                  />
                  {products[viewIndex].images.length > 1 && (
                    <>
                      <button
                        onClick={prevViewSlide}
                        className="absolute top-1/2 left-2 bg-white px-2 py-1 rounded-full text-lg"
                      >
                        ‹
                      </button>
                      <button
                        onClick={nextViewSlide}
                        className="absolute top-1/2 right-2 bg-white px-2 py-1 rounded-full text-lg"
                      >
                        ›
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="h-44 w-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            <p><strong>Name:</strong> {products[viewIndex]?.name}</p>
            <p><strong>Description:</strong> {products[viewIndex]?.description}</p>
            <p><strong>Price:</strong> ₹ {products[viewIndex]?.price}</p>
            <p><strong>Stock:</strong> {products[viewIndex]?.stock}</p>
            <p><strong>Category:</strong> {products[viewIndex]?.category}</p>

            <button
              onClick={() => setViewIndex(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
