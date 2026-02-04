import axiosInstance from './axios';

export const authApi = {
    login: async (email, password) => {
        const response = await axiosInstance.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
    },

    logout: async () => {
        const response = await axiosInstance.post('/auth/logout');
        localStorage.removeItem('authToken');
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await axiosInstance.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (token, newPassword) => {
        const response = await axiosInstance.post('/auth/reset-password', { token, newPassword });
        return response.data;
    },
};

export default authApi;
