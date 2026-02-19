import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

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

// GET USER INFO (Protected)
export const getUserInfo = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  const response = await axios.get(`${API_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
// ADDRESS MANAGEMENT (Protected)
// ... (omitted)

export const getProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/userProducts`);
  return response.data;
};
