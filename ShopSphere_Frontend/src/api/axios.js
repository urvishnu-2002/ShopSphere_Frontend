import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Helper to handle product images from public folder
export const formatImageUrl = (url) => {
  if (!url) return "/placeholder.jpg";

  // If the backend returns a full media URL, we strip the prefix to look in /public
  // because the user wants to use images from the frontend public folder.
  if (typeof url === 'string') {
    if (url.includes('/media/products/')) {
      return "/" + url.split('/media/products/').pop();
    }
    // If it's already an absolute URL but not from our media, keep it
    if (url.startsWith('http') && !url.includes(API_BASE_URL)) {
      return url;
    }
  }
  return url;
};

// LOGIN

export const loginUser = async (loginData) => {
  const response = await axios.post(
    `${API_BASE_URL}/user_login`,
    loginData
  );
  console.log(response.data);

  // Save tokens immediately after login
  if (response.data?.access) {
    localStorage.setItem("accessToken", response.data.access);
    localStorage.setItem("refreshToken", response.data.refresh);
  }

  return response.data;
};

// SIGNUP
export const signupUser = async (signupData) => {
  const response = await axios.post(
    `${API_BASE_URL}/register`,
    signupData
  );
  return response.data;
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// GET MY ORDERS (Protected)

export const getMyOrders = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No access token found");
  }

  const response = await axios.get(
    `${API_BASE_URL}/my_orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// PROCESS PAYMENT (Protected)
export const processPayment = async (paymentData) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No access token found. Please login first.");
  }

  const response = await axios.post(
    `${API_BASE_URL}/process_payment`,
    paymentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// ADDRESS MANAGEMENT (Protected)

export const getAddresses = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No access token found");

  const response = await axios.get(`${API_BASE_URL}/address`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addAddress = async (addressData) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No access token found");

  const response = await axios.post(`${API_BASE_URL}/address`, addressData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteAddress = async (id) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No access token found");

  const response = await axios.post(`${API_BASE_URL}/delete-address/${id}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// FETCH PRODUCTS (Public)
export const fetchProducts = async () => {
  // Using the root URL as requested by the user
  const response = await axios.get(`${API_BASE_URL}/`, {
    headers: {
      "Accept": "application/json"
    }
  });
  return response.data;
};

// ADD TO CART (Protected)
export const addToCart = async (productId) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Please login to add items to cart");

  try {
    const response = await axios.post(
      `${API_BASE_URL}/add_to_cart/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept": "application/json"
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Token might be expired
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  }
};

// REMOVE FROM CART (Protected)
export const removeFromCart = async (productId) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Please login to remove items from cart");

  try {
    const response = await axios.delete(
      `${API_BASE_URL}/remove_from_cart/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept": "application/json"
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  }
};

// UPDATE CART QUANTITY (Protected)
export const updateCartQuantity = async (productId, action) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Please login to update cart");

  try {
    const response = await axios.patch(
      `${API_BASE_URL}/update_cart_quantity/${productId}`,
      { action },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept": "application/json"
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  }
};

// FETCH CART (Protected)
export const fetchCart = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const response = await axios.get(`${API_BASE_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
    throw error;
  }
};
