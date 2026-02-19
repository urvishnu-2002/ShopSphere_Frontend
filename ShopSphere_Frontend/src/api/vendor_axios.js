import axios from "axios";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");



// vendor register
export const vendorRegister = async (signupData) => {
  const token = localStorage.getItem("accessToken");
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await axios.post(
    `${API_BASE_URL}/vendor/register/`,
    signupData,
    { headers }
  );
  return response.data;
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};


// Add Product

export const add_Product = async (product) => {
  const fd = new FormData();
  fd.append("name", product.name || "");
  fd.append("description", product.description || "");
  fd.append("price", product.price || "0");
  fd.append("quantity", product.stock || "0"); // Backend uses 'quantity'
  fd.append("category", product.category || "");

  // ✅ Send multiple images with key "images" (matching Django request.FILES.getlist('images'))
  if (product.images && product.images.length > 0) {
    product.images.forEach((file) => {
      fd.append("images", file);
    });
  }

  const token = localStorage.getItem("accessToken");
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await axios.post(
    `${API_BASE_URL}/api/vendor/products/`,
    fd,
    {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );

  return response.data;
};

// Get Vendor Products
export const getProducts = async () => {
  const token = localStorage.getItem("accessToken");
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await axios.get(
    `${API_BASE_URL}/api/vendor/products/`,
    {
      headers,
      withCredentials: true,
    }
  );

  return response.data;
};



