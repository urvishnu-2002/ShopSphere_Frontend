import axiosInstance from './axios';

export const productApi = {
    getAllProducts: async (params = {}) => {
        const response = await axiosInstance.get('/products', { params });
        return response.data;
    },

    getProductById: async (id) => {
        const response = await axiosInstance.get(`/products/${id}`);
        return response.data;
    },

    getProductsByCategory: async (category) => {
        const response = await axiosInstance.get(`/products/category/${category}`);
        return response.data;
    },

    searchProducts: async (query) => {
        const response = await axiosInstance.get('/products/search', { params: { q: query } });
        return response.data;
    },

    // Vendor endpoints
    createProduct: async (productData) => {
        const response = await axiosInstance.post('/products', productData);
        return response.data;
    },

    updateProduct: async (id, productData) => {
        const response = await axiosInstance.put(`/products/${id}`, productData);
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await axiosInstance.delete(`/products/${id}`);
        return response.data;
    },
};

export default productApi;
