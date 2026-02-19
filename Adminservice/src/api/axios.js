import axios from 'axios';

const base_url = "http://localhost:8000";

export const axiosInstance = axios.create({
    baseURL: base_url,
    headers: {
        "Content-Type": "application/json",
    }
});
// const loadVendors = useCallback(async () => {
//     const token = localStorage.getItem("accessToken");

//     const res = await fetch("http://localhost:8000/admin/api/vendor-requests/", {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });

//     const data = await res.json();
//     setVendors(data);
// }, []);

export const fetchVendorRequests = async () => {
    const token = localStorage.getItem("authToken");

    const response = await axios.get(
        `${base_url}/superAdmin/api/vendor-requests/`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const fetchAllVendors = async () => {
    const token = localStorage.getItem("authToken");

    const response = await axios.get(
        `${base_url}/superAdmin/api/vendors/`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const fetchDashboardStats = async () => {
    const token = localStorage.getItem("authToken");

    const response = await axios.get(
        `${base_url}/superAdmin/api/dashboard/`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const approveVendorRequest = async (vendorId, reason = '') => {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
        `${base_url}/superAdmin/api/vendor-requests/${vendorId}/approve/`,
        { reason },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const rejectVendorRequest = async (vendorId, reason) => {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
        `${base_url}/superAdmin/api/vendor-requests/${vendorId}/reject/`,
        { reason },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const blockVendor = async (vendorId, reason) => {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
        `${base_url}/superAdmin/api/vendors/${vendorId}/block/`,
        { reason },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const unblockVendor = async (vendorId, reason = '') => {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
        `${base_url}/superAdmin/api/vendors/${vendorId}/unblock/`,
        { reason },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};


export const adminLogin = async (username, password) => {
    // We use the general login API which returns JWT tokens for any user role
    const response = await axios.post(
        `${base_url}/user_login`,
        { username, password },
        { headers: { 'Accept': 'application/json' } }
    );
    return response.data;
};

export const fetchAllProducts = async () => {
    const response = await axios.get(
        `${base_url}/userProducts`
    );

    return response.data;
};


export const fetchDeliveryRequests = async () => {
    const token = localStorage.getItem("authToken");

    const response = await axios.get(
        `${base_url}/superAdmin/api/delivery-agents/pending_approvals/`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const approveDeliveryRequest = async (agentId) => {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
        `${base_url}/superAdmin/api/delivery-agents/${agentId}/approve/`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const rejectDeliveryRequest = async (agentId, reason) => {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
        `${base_url}/superAdmin/api/delivery-agents/${agentId}/reject/`,
        { reason },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("adminAuthenticated");
};

// ── ORDER MANAGEMENT ──────────────────────────────────────────────────────────

export const fetchAllOrders = async () => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
        `${base_url}/superAdmin/api/orders/`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const fetchApprovedDeliveryAgents = async () => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
        `${base_url}/superAdmin/api/delivery-agents/`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const assignDeliveryAgent = async (orderId, agentId) => {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
        `${base_url}/superAdmin/api/orders/${orderId}/assign_delivery/`,
        { agent_id: agentId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const updateOrderItemStatus = async (itemId, newStatus) => {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(
        `${base_url}/superAdmin/api/orders/${itemId}/update_status/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export default axiosInstance;
