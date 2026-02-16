import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";



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


export const addProduct = async (formData) => {
  const response = await axios.post(
    `${API_BASE_URL}/vendor/products/add/`,
    formData
  );

  return response.data;
};
