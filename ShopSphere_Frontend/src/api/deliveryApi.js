import axiosInstance from './axios';

// Delivery Agent API endpoints
export const deliveryApi = {
    // Authentication
    login: async (email, password) => {
        const response = await axiosInstance.post('/delivery/login', { email, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await axiosInstance.post('/delivery/register', userData);
        return response.data;
    },

    // Get current delivery agent profile
    getProfile: async () => {
        const response = await axiosInstance.get('/delivery/profile');
        return response.data;
    },

    // Update delivery agent profile
    updateProfile: async (profileData) => {
        const response = await axiosInstance.put('/delivery/profile', profileData);
        return response.data;
    },

    // Orders
    getAvailableOrders: async () => {
        const response = await axiosInstance.get('/delivery/orders/available');
        return response.data;
    },

    getAssignedOrders: async () => {
        const response = await axiosInstance.get('/delivery/orders/assigned');
        return response.data;
    },

    getCompletedOrders: async () => {
        const response = await axiosInstance.get('/delivery/orders/completed');
        return response.data;
    },

    acceptOrder: async (orderId) => {
        const response = await axiosInstance.post(`/delivery/orders/${orderId}/accept`);
        return response.data;
    },

    rejectOrder: async (orderId) => {
        const response = await axiosInstance.post(`/delivery/orders/${orderId}/reject`);
        return response.data;
    },

    markDelivered: async (orderId) => {
        const response = await axiosInstance.post(`/delivery/orders/${orderId}/delivered`);
        return response.data;
    },

    // Get order details
    getOrderDetails: async (orderId) => {
        const response = await axiosInstance.get(`/delivery/orders/${orderId}`);
        return response.data;
    },

    // Earnings
    getEarnings: async () => {
        const response = await axiosInstance.get('/delivery/earnings');
        return response.data;
    },

    getEarningsHistory: async (startDate, endDate) => {
        const response = await axiosInstance.get('/delivery/earnings/history', {
            params: { start_date: startDate, end_date: endDate }
        });
        return response.data;
    },

    // Stats/Dashboard
    getDashboardStats: async () => {
        const response = await axiosInstance.get('/delivery/dashboard/stats');
        return response.data;
    },

    // Password reset
    forgotPassword: async (email) => {
        const response = await axiosInstance.post('/delivery/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (token, newPassword) => {
        const response = await axiosInstance.post('/delivery/reset-password', {
            token,
            new_password: newPassword
        });
        return response.data;
    },
};

export default deliveryApi;
