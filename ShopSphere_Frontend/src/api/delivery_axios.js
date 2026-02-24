import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const getHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Delivery Agent Auth
export const checkEmailStatus = async (email) => {
    const response = await axios.post(`${API_BASE_URL}/check-email`, { email });
    return response.data;
};

export const deliveryRegister = async (agentData, files = {}) => {
    const formData = new FormData();

    // Append text data
    Object.keys(agentData).forEach(key => {
        if (agentData[key] !== null && agentData[key] !== undefined) {
            // If the value is an object or array (and not a File), stringify it for FormData
            if (typeof agentData[key] === 'object' && !(agentData[key] instanceof File)) {
                formData.append(key, JSON.stringify(agentData[key]));
            } else {
                formData.append(key, agentData[key]);
            }
        }
    });

    // Append files
    Object.keys(files).forEach(key => {
        if (files[key]) {
            formData.append(key, files[key]);
        }
    });

    const response = await axios.post(`${API_BASE_URL}/api/delivery/profiles/register/`, formData, {
        headers: {
            ...getHeaders()
            // Do NOT set 'Content-Type': 'multipart/form-data' manually.
            // Axios/Browser will set it automatically with the correct boundary.
        }
    });
    return response.data;
};

export const requestDeletion = async (reason) => {
    const response = await axios.post(`${API_BASE_URL}/api/delivery/profiles/request_deletion/`, { reason }, {
        headers: getHeaders()
    });
    return response.data;
};


// Dashboard Stats
export const fetchDeliveryDashboard = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/delivery/dashboard/`, {
        headers: getHeaders()
    });
    return response.data;
};

// Assignments
export const fetchAssignedOrders = async (status = '') => {
    const url = status ? `${API_BASE_URL}/api/delivery/assignments/?status=${status}` : `${API_BASE_URL}/api/delivery/assignments/`;
    const response = await axios.get(url, {
        headers: getHeaders()
    });
    return response.data;
};

export const acceptOrder = async (assignmentId) => {
    const response = await axios.post(`${API_BASE_URL}/api/delivery/assignments/${assignmentId}/accept/`, {}, {
        headers: getHeaders()
    });
    return response.data;
};

export const rejectOrder = async (assignmentId) => {
    const response = await axios.post(`${API_BASE_URL}/api/delivery/assignments/${assignmentId}/reject/`, {}, {
        headers: getHeaders()
    });
    return response.data;
};

export const startDelivery = async (assignmentId) => {
    const response = await axios.post(`${API_BASE_URL}/api/delivery/assignments/${assignmentId}/start/`, {}, {
        headers: getHeaders()
    });
    return response.data;
};

export const completeDelivery = async (assignmentId, data) => {
    const response = await axios.post(`${API_BASE_URL}/api/delivery/assignments/${assignmentId}/complete/`, data, {
        headers: getHeaders()
    });
    return response.data;
};

export const markPickedUp = async (assignmentId, notes = '') => {
    const response = await axios.post(`${API_BASE_URL}/api/delivery/assignments/${assignmentId}/update-status/`,
        { status: 'picked_up', notes },
        { headers: getHeaders() }
    );
    return response.data;
};

export const markInTransit = async (assignmentId, notes = '') => {
    const response = await axios.post(`${API_BASE_URL}/api/delivery/assignments/${assignmentId}/update-status/`,
        { status: 'in_transit', notes },
        { headers: getHeaders() }
    );
    return response.data;
};

export const markArrived = async (assignmentId, notes = '') => {
    const response = await axios.post(`${API_BASE_URL}/api/delivery/assignments/${assignmentId}/update-status/`,
        { status: 'arrived', notes },
        { headers: getHeaders() }
    );
    return response.data;
};

export const failDelivery = async (assignmentId, notes = '') => {
    const response = await axios.post(`${API_BASE_URL}/api/delivery/assignments/${assignmentId}/update-status/`,
        { status: 'failed', notes },
        { headers: getHeaders() }
    );
    return response.data;
};

// Earnings & Stats
export const fetchEarningsSummary = async (filter = 'monthly') => {
    const response = await axios.get(`${API_BASE_URL}/api/delivery/earnings/summary/?filter=${filter}`, {
        headers: getHeaders()
    });
    return response.data;
};

export const fetchCommissionList = async (status = '') => {
    const url = status
        ? `${API_BASE_URL}/api/delivery/earnings/?status=${status}`
        : `${API_BASE_URL}/api/delivery/earnings/`;
    const response = await axios.get(url, {
        headers: getHeaders()
    });
    return response.data;
};

export const requestWithdrawal = async (amount, method = 'bank_transfer') => {
    const response = await axios.post(`${API_BASE_URL}/api/delivery/payments/withdraw/`, { amount, method }, {
        headers: getHeaders()
    });
    return response.data;
};

// Profile Management
export const fetchAgentProfile = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/delivery/profiles/get_agent/`, {
        headers: getHeaders()
    });
    return response.data;
};

export const updateAgentProfile = async (profileData) => {
    const response = await axios.put(`${API_BASE_URL}/api/delivery/profiles/update_profile/`, profileData, {
        headers: getHeaders()
    });
    return response.data;
};