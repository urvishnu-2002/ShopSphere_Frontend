import axiosInstance from './axios';

export const orderApi = {
    createOrder: async (orderData) => {
        const response = await axiosInstance.post('/orders', orderData);
        return response.data;
    },

    getOrderById: async (id) => {
        const response = await axiosInstance.get(`/orders/${id}`);
        return response.data;
    },

    getMyOrders: async () => {
        const response = await axiosInstance.get('/orders/my-orders');
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await axiosInstance.patch(`/orders/${id}/status`, { status });
        return response.data;
    },

    cancelOrder: async (id) => {
        const response = await axiosInstance.patch(`/orders/${id}/cancel`);
        return response.data;
    },

    // Vendor endpoints
    getVendorOrders: async () => {
        const response = await axiosInstance.get('/orders/vendor');
        return response.data;
    },

    // Delivery endpoints
    getAssignedOrders: async () => {
        const response = await axiosInstance.get('/orders/delivery/assigned');
        return response.data;
    },

    updateDeliveryStatus: async (id, status) => {
        const response = await axiosInstance.patch(`/orders/${id}/delivery-status`, { status });
        return response.data;
    },
};

export default orderApi;
