import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const getHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Delivery Agent Auth
export const deliveryRegister = async (agentData) => {
    const response = await axios.post(`${API_BASE_URL}/deliveryAgent/api/register/`, agentData);
    return response.data;
};

// Dashboard Stats
export const fetchDeliveryDashboard = async () => {
    const response = await axios.get(`${API_BASE_URL}/deliveryAgent/api/dashboard/`, {
        headers: getHeaders()
    });
    return response.data;
};

// Assignments
export const fetchAssignedOrders = async (status = '') => {
    const url = status ? `${API_BASE_URL}/deliveryAgent/api/assignments/?status=${status}` : `${API_BASE_URL}/deliveryAgent/api/assignments/`;
    const response = await axios.get(url, {
        headers: getHeaders()
    });
    return response.data;
};

export const acceptOrder = async (assignmentId) => {
    const response = await axios.post(`${API_BASE_URL}/deliveryAgent/api/assignments/${assignmentId}/accept/`, {}, {
        headers: getHeaders()
    });
    return response.data;
};

export const startDelivery = async (assignmentId) => {
    const response = await axios.post(`${API_BASE_URL}/deliveryAgent/api/assignments/${assignmentId}/start/`, {}, {
        headers: getHeaders()
    });
    return response.data;
};

export const completeDelivery = async (assignmentId, data) => {
    const response = await axios.post(`${API_BASE_URL}/deliveryAgent/api/assignments/${assignmentId}/complete/`, data, {
        headers: getHeaders()
    });
    return response.data;
};

// Earnings & Stats
export const fetchEarningsSummary = async (filter = 'monthly') => {
    const response = await axios.get(`${API_BASE_URL}/deliveryAgent/api/earnings/summary/?filter=${filter}`, {
        headers: getHeaders()
    });
    return response.data;
};

export const requestWithdrawal = async (amount, method = 'bank_transfer') => {
    const response = await axios.post(`${API_BASE_URL}/deliveryAgent/api/payments/withdraw/`, { amount, method }, {
        headers: getHeaders()
    });
    return response.data;
};

export const sendDeliveryOTP = async (assignmentId) => {
    const response = await axios.post(`${API_BASE_URL}/deliveryAgent/api/assignments/${assignmentId}/send_otp/`, {}, {
        headers: getHeaders()
    });
    return response.data;
};

export const verifyDeliveryOTP = async (assignmentId, otp) => {
    const response = await axios.post(`${API_BASE_URL}/deliveryAgent/api/assignments/${assignmentId}/verify_otp/`, { otp }, {
        headers: getHeaders()
    });
    return response.data;
};

export const fetchDeliveryHistory = async () => {
    const response = await axios.get(`${API_BASE_URL}/deliveryAgent/api/assignments/history/`, {
        headers: getHeaders()
    });
    return response.data;
};

export const fetchAgentProfile = async () => {
    const response = await axios.get(`${API_BASE_URL}/deliveryAgent/api/get_agent/`, {
        headers: getHeaders()
    });
    return response.data;
};
