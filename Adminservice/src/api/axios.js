import axios from 'axios';

const base_url = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// ── Token helper ─────────────────────────────────────────────────────────────
const getAdminToken = () => {
    const token = localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("accessToken") ||
        sessionStorage.getItem("authToken");

    if (!token) {
        console.warn("[Admin Auth] No token found in storage.");
        return "";
    }
    return token;
};

// ── Shared axios instance with auto-auth ──────────────────────────────────────
const axiosInstance = axios.create({
    baseURL: base_url,
    headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
    const token = getAdminToken();
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        // console.log(`[Admin API] Sent Request: ${config.method.toUpperCase()} ${config.url}`);
    } else {
        console.warn(`[Admin API] No Token for Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const currentPath = window.location.pathname;

        // If 401 (Unauthenticated) or 403 (Unauthorized/Forbidden for Admin)
        if ((status === 401 || status === 403) && currentPath !== "/login") {
            console.error(`[Admin API] ${status} Error — ${status === 401 ? 'Auth required' : 'Access denied'}. Forcing logout...`);
            logout();
        }
        return Promise.reject(error);
    }
);

export { axiosInstance };

// ── Auth ──────────────────────────────────────────────────────────────────────

export const adminLogin = async (username, password) => {
    try {
        // Uses dedicated admin-only endpoint that enforces is_staff / is_superuser
        const response = await axios.post(
            `${base_url}/superAdmin/api/admin-login/`,
            { username, password },
            { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.data?.access) {
            console.log("[Admin Login] Saving fresh admin tokens...");
            const token = response.data.access;
            localStorage.setItem("accessToken", token);
            localStorage.setItem("authToken", token);
            localStorage.setItem("refreshToken", response.data.refresh || '');
            localStorage.setItem("adminAuthenticated", "true");
            localStorage.setItem("adminUsername", response.data.username || username);
        }
        return response.data;
    } catch (err) {
        console.error("[Admin Login] Login API failed:", err.response?.data || err.message);
        throw err;
    }
};

export const logout = () => {
    console.log("[Admin Auth] Logging out and clearing all storage...");
    const keys = ["accessToken", "authToken", "refreshToken", "adminAuthenticated", "adminUsername"];
    keys.forEach(k => {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
    });
    // Redirect to login explicitly
    window.location.href = "/login";
};

// Debug helper — call from browser console: import { whoAmI } from './api/axios'; whoAmI().then(console.log)
export const whoAmI = async () => {
    const response = await axiosInstance.get('/superAdmin/api/whoami/');
    return response.data;
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const fetchDashboardStats = async () => {
    const response = await axiosInstance.get('/superAdmin/api/dashboard/');
    return response.data;
};

// ── Vendors ───────────────────────────────────────────────────────────────────

export const fetchVendorRequests = async () => {
    const response = await axiosInstance.get('/superAdmin/api/vendor-requests/');
    return response.data;
};

export const fetchAllVendors = async () => {
    const response = await axiosInstance.get('/superAdmin/api/vendors/');
    return response.data;
};

export const fetchVendorDetail = async (id) => {
    const response = await axiosInstance.get(`/superAdmin/api/vendors/${id}/`);
    return response.data;
};

export const approveVendorRequest = async (vendorId, reason = '') => {
    const response = await axiosInstance.post(`/superAdmin/api/vendor-requests/${vendorId}/approve/`, { reason });
    return response.data;
};

export const rejectVendorRequest = async (vendorId, reason) => {
    const response = await axiosInstance.post(`/superAdmin/api/vendor-requests/${vendorId}/reject/`, { reason });
    return response.data;
};

export const blockVendor = async (vendorId, reason) => {
    const response = await axiosInstance.post(`/superAdmin/api/vendors/${vendorId}/block/`, { reason });
    return response.data;
};

export const unblockVendor = async (vendorId, reason = '') => {
    const response = await axiosInstance.post(`/superAdmin/api/vendors/${vendorId}/unblock/`, { reason });
    return response.data;
};

// ── Products ──────────────────────────────────────────────────────────────────

export const fetchProductsByVendor = async (vendorId) => {
    const response = await axiosInstance.get(`/superAdmin/api/products/?vendor_id=${vendorId}`);
    return response.data;
};

export const fetchAllProducts = async ({ page = 1, search = '', vendorId = null, status = '' } = {}) => {
    const params = { page };
    if (search) params.search = search;
    if (vendorId) params.vendor_id = vendorId;
    if (status) params.status = status;
    const response = await axiosInstance.get('/superAdmin/api/products/', { params });
    return response.data;
};

// ── Delivery Agents ───────────────────────────────────────────────────────────

export const fetchDeliveryRequests = async () => {
    const response = await axiosInstance.get('/superAdmin/api/delivery-requests/');
    return response.data;
};

export const fetchAllDeliveryAgents = async () => {
    const response = await axiosInstance.get('/superAdmin/api/delivery-agents/');
    return response.data;
};

export const fetchDeliveryAgentDetail = async (id) => {
    const response = await axiosInstance.get(`/superAdmin/api/delivery-agents/${id}/`);
    return response.data;
};

export const approveDeliveryAgent = async (id, reason = '') => {
    const response = await axiosInstance.post(`/superAdmin/api/delivery-requests/${id}/approve/`, { reason });
    return response.data;
};

export const rejectDeliveryAgent = async (id, reason) => {
    const response = await axiosInstance.post(`/superAdmin/api/delivery-requests/${id}/reject/`, { reason });
    return response.data;
};

export const blockDeliveryAgent = async (id, reason) => {
    const response = await axiosInstance.post(`/superAdmin/api/delivery-agents/${id}/block/`, { reason });
    return response.data;
};

export const unblockDeliveryAgent = async (id) => {
    const response = await axiosInstance.post(`/superAdmin/api/delivery-agents/${id}/unblock/`, {});
    return response.data;
};

// ── Commission Settings ───────────────────────────────────────────────────────

export const fetchGlobalCommission = async () => {
    const response = await axiosInstance.get('/superAdmin/api/commission-settings/global/');
    return response.data;
};

export const updateGlobalCommission = async (data) => {
    const response = await axiosInstance.post('/superAdmin/api/commission-settings/global/', data);
    return response.data;
};

export const fetchCategoryCommissions = async () => {
    const response = await axiosInstance.get('/superAdmin/api/commission-settings/');
    return response.data;
};

export const saveCategoryCommission = async (data) => {
    const response = await axiosInstance.post('/superAdmin/api/commission-settings/', data);
    return response.data;
};

export const updateCategoryCommission = async (id, data) => {
    const response = await axiosInstance.patch(`/superAdmin/api/commission-settings/${id}/`, data);
    return response.data;
};

export const deleteCategoryCommission = async (id) => {
    const response = await axiosInstance.delete(`/superAdmin/api/commission-settings/${id}/`);
    return response.data;
};

// ── Reports ───────────────────────────────────────────────────────────────────

export const fetchReports = async () => {
    const response = await axiosInstance.get('/superAdmin/api/reports/');
    return response.data;
};

// ── Users ─────────────────────────────────────────────────────────────────────

export const fetchUsers = async ({ search = '', role = '', status = '' } = {}) => {
    const params = {};
    if (search) params.search = search;
    if (role) params.role = role;
    if (status) params.status = status;
    const response = await axiosInstance.get('/superAdmin/api/users/', { params });
    return response.data;
};

export const toggleUserBlock = async (userId, action, reason = '') => {
    const response = await axiosInstance.post(`/superAdmin/api/users/${userId}/toggle-block/`, { action, reason });
    return response.data;
};

// ── Orders ────────────────────────────────────────────────────────────────────

export const fetchAdminOrders = async ({ page = 1, search = '', status = '' } = {}) => {
    const params = { page };
    if (search) params.search = search;
    if (status) params.status = status;
    const response = await axiosInstance.get('/superAdmin/api/orders/', { params });
    return response.data;
};

export const fetchAdminOrderDetail = async (id) => {
    const response = await axiosInstance.get(`/superAdmin/api/orders/${id}/`);
    return response.data;
};

export const triggerAssignment = async (orderId) => {
    const response = await axiosInstance.post(`/superAdmin/api/trigger-assignment/${orderId}/`, {});
    return response.data;
};

// ── Delivery Simulation (Agent Actions) ───────────────────────────────────────

export const updateDeliveryStatus = async (assignmentId, status, notes = "") => {
    const response = await axiosInstance.post(`/api/delivery/assignments/${assignmentId}/update-status/`, {
        status,
        notes
    });
    return response.data;
};

export const completeDeliveryOTP = async (assignmentId, otpCode) => {
    const response = await axiosInstance.post(`/api/delivery/assignments/${assignmentId}/complete/`, {
        otp_code: otpCode
    });
    return response.data;
};
