import axios from "axios";

export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// ─── JWT AUTO-REFRESH INTERCEPTOR ───────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        return axios(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
                    refresh: refreshToken,
                });

                const newAccessToken = res.data.access;
                localStorage.setItem("accessToken", newAccessToken);

                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);

                return axios(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
// ────────────────────────────────────────────────────────────────────────────



// vendor register
export const vendorRegister = async (signupData, files = {}) => {
    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // Use FormData so file uploads work correctly
    const formData = new FormData();

    // Append all regular text fields
    Object.keys(signupData).forEach((key) => {
        if (signupData[key] !== undefined && signupData[key] !== null) {
            formData.append(key, signupData[key]);
        }
    });

    // Append file fields
    if (files.additional_documents) {
        formData.append('additional_documents', files.additional_documents);
    }
    if (files.selfie_with_id) {
        formData.append('selfie_with_id', files.selfie_with_id);
    }
    if (files.pan_card_file) {
        formData.append('pan_card_file', files.pan_card_file);
    }
    if (files.id_proof_file) {
        formData.append('id_proof_file', files.id_proof_file);
    }

    const response = await axios.post(
        `${API_BASE_URL}/vendor/register/`,
        formData,
        { headers }
    );
    return response.data;
};


// Get vendor approval status
export const getVendorStatus = async () => {
    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.get(
        `${API_BASE_URL}/api/vendor/approval-status/`,
        { headers }
    );
    return response.data;
};

// LOGOUT
export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};


export const add_Product = async (productData) => {
    const token = localStorage.getItem("accessToken");
    const headers = {
        "Content-Type": "multipart/form-data",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
        if (key === "images") {
            productData.images.forEach((image) => {
                formData.append("images", image);
            });
        } else if (key === "stock") {
            // Map 'stock' from frontend to 'quantity' for backend
            formData.append("quantity", productData[key]);
        } else {
            formData.append(key, productData[key]);
        }
    });

    const response = await axios.post(
        `${API_BASE_URL}/api/vendor/products/`,
        formData,
        { headers }
    );

    return response.data;
};

// Get vendor products
export const getVendorProducts = async () => {
    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.get(
        `${API_BASE_URL}/api/vendor/products/`,
        { headers }
    );
    return response.data;
};

// Delete vendor product
export const deleteVendorProduct = async (productId) => {
    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.delete(
        `${API_BASE_URL}/api/vendor/products/${productId}/`,
        { headers }
    );
    return response.data;
};
// Update vendor product
export const updateVendorProduct = async (productId, productData) => {
    const token = localStorage.getItem("accessToken");
    const headers = {
        "Content-Type": "multipart/form-data",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
        if (key === "images") {
            // Only append new images if any are provided
            if (Array.isArray(productData.images)) {
                productData.images.forEach((image) => {
                    if (image instanceof File) {
                        formData.append("images", image);
                    }
                });
            }
        } else if (key === "quantity") {
            formData.append("quantity", productData[key]);
        } else {
            formData.append(key, productData[key]);
        }
    });

    const response = await axios.put(
        `${API_BASE_URL}/api/vendor/products/${productId}/`,
        formData,
        { headers }
    );
    return response.data;
};

// Get commission settings
export const fetchCommissionInfo = async () => {
    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.get(
        `${API_BASE_URL}/api/finance/commission/info/`,
        { headers }
    );
    return response.data;
};

// Get vendor orders
export const getVendorOrders = async () => {
    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.get(
        `${API_BASE_URL}/api/vendor/orders/`,
        { headers }
    );
    return response.data;
};

// Update vendor order item status
export const updateVendorOrderItemStatus = async (orderItemId, status) => {
    const token = localStorage.getItem("accessToken");
    const headers = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.patch(
        `${API_BASE_URL}/api/vendor/orders/${orderItemId}/update-status/`,
        { vendor_status: status },
        { headers }
    );
    return response.data;
};

// Get vendor profile details
export const getVendorProfile = async () => {
    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.get(
        `${API_BASE_URL}/api/vendor/profile/`,
        { headers }
    );
    return response.data;
};

export const requestVendorDeletion = async (reason) => {
    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.post(
        `${API_BASE_URL}/api/vendor/request_deletion/`,
        { reason },
        { headers }
    );
    return response.data;
};


// Update vendor profile details
export const updateVendorProfile = async (profileData) => {
    const token = localStorage.getItem("accessToken");
    const headers = {
        "Content-Type": "multipart/form-data",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
        if (key === "id_proof_file" && profileData[key] instanceof File) {
            formData.append(key, profileData[key]);
        } else if (key !== "id_proof_file") {
            formData.append(key, profileData[key]);
        }
    });

    const response = await axios.patch(
        `${API_BASE_URL}/api/vendor/profile/`,
        formData,
        { headers }
    );
    return response.data;
};

// Get vendor earnings summary
export const getVendorEarningsSummary = async () => {
    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.get(
        `${API_BASE_URL}/api/finance/earnings/`,
        { headers }
    );
    return response.data;
};

// Get vendor earnings analytics
export const getVendorEarningsAnalytics = async (period = 'weekly') => {
    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.get(
        `${API_BASE_URL}/api/finance/earnings/analytics/?period=${period}`,
        { headers }
    );
    return response.data;
};
