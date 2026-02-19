import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const getHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Vendor Orders
export const fetchVendorOrders = async (status = '') => {
    const url = status ? `${API_BASE_URL}/vendor/api/orders/?status=${status}` : `${API_BASE_URL}/vendor/api/orders/`;
    const response = await axios.get(url, {
        headers: getHeaders()
    });
    return response.data;
};

export const findNearbyAgents = async (orderItemId) => {
    const response = await axios.get(`${API_BASE_URL}/vendor/api/orders/${orderItemId}/find_delivery_agents/`, {
        headers: getHeaders()
    });
    return response.data;
};

export const assignDeliveryAgent = async (orderItemId, agentId, fee) => {
    const response = await axios.post(`${API_BASE_URL}/vendor/api/orders/${orderItemId}/assign_delivery_agent/`, {
        agent_id: agentId,
        delivery_fee: fee
    }, {
        headers: getHeaders()
    });
    return response.data;
};

export const updateOrderItemStatus = async (orderItemId, status) => {
    const response = await axios.post(`${API_BASE_URL}/vendor/api/orders/${orderItemId}/update_status/`, {
        status: status
    }, {
        headers: getHeaders()
    });
    return response.data;
};

// Vendor Registration
export const vendorRegister = async (vendorData) => {
    const response = await axios.post(`${API_BASE_URL}/vendor_register`, vendorData, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    return response.data;
};

// Add Product
export const add_Product = async (productData) => {
    const formData = new FormData();

    // Add text fields
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('quantity', productData.stock); // Backend expects 'quantity'

    // Convert Category to lowercase to match backend choices
    const category = productData.category.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
    formData.append('category', category);

    // Add images if present
    if (productData.images && productData.images.length > 0) {
        productData.images.forEach((image) => {
            formData.append('images', image);
        });
    }

    const response = await axios.post(`${API_BASE_URL}/vendor/api/products/`, formData, {
        headers: {
            ...getHeaders(),
            'Content-Type': 'multipart/form-data',
        }
    });
    return response.data;
};

// Fetch Vendor Dashboard
export const fetchVendorDashboard = async () => {
    const response = await axios.get(`${API_BASE_URL}/vendor/api/dashboard/`, {
        headers: getHeaders()
    });
    return response.data;
};

// Fetch Vendor Products
export const fetchVendorProducts = async () => {
    const response = await axios.get(`${API_BASE_URL}/vendor/api/products/`, {
        headers: getHeaders()
    });
    return response.data;
};

// Update Product
export const updateProduct = async (productId, productData) => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('quantity', productData.quantity || productData.stock);

    if (productData.category) {
        const category = productData.category.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
        formData.append('category', category);
    }

    if (productData.newImages && productData.newImages.length > 0) {
        productData.newImages.forEach((image) => {
            formData.append('images', image);
        });
    }

    const response = await axios.patch(`${API_BASE_URL}/vendor/api/products/${productId}/`, formData, {
        headers: {
            ...getHeaders(),
            'Content-Type': 'multipart/form-data',
        }
    });
    return response.data;
};

// Delete Product
export const delete_Product = async (productId) => {
    const response = await axios.delete(`${API_BASE_URL}/vendor/api/products/${productId}/`, {
        headers: getHeaders()
    });
    return response.data;
};

// Toggle Product Block (Admin only)
export const toggleProductBlock = async (productId, reason = "Violation of terms") => {
    const response = await axios.post(`${API_BASE_URL}/vendor/api/products/${productId}/toggle_block/`, { reason }, {
        headers: getHeaders()
    });
    return response.data;
};

// Admin: Fetch all orders
export const fetchAdminOrders = async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/api/orders/`, {
        headers: getHeaders()
    });
    return response.data;
};

// Admin: Update order item status
export const adminUpdateOrderStatus = async (orderItemId, status) => {
    const response = await axios.post(`${API_BASE_URL}/admin/api/orders/${orderItemId}/update_status/`, { status }, {
        headers: getHeaders()
    });
    return response.data;
};

// Admin: Assign delivery agent to order
export const adminAssignDelivery = async (orderId, agentId) => {
    const response = await axios.post(`${API_BASE_URL}/admin/api/orders/${orderId}/assign_delivery/`, { agent_id: agentId }, {
        headers: getHeaders()
    });
    return response.data;
};

// Admin: Fetch all delivery agents
export const fetchAdminDeliveryAgents = async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/api/delivery-agents/`, {
        headers: getHeaders()
    });
    return response.data;
};

// Admin: Fetch product details
export const fetchAdminProductDetail = async (productId) => {
    const response = await axios.get(`${API_BASE_URL}/admin/api/products/${productId}/`, {
        headers: getHeaders()
    });
    return response.data;
};
// Admin: Fetch dashboard stats
export const fetchAdminDashboard = async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/api/dashboard/`, {
        headers: getHeaders()
    });
    return response.data;
};
// Admin: Fetch revenue reports
export const fetchAdminRevenueReport = async (days = 30) => {
    const response = await axios.get(`${API_BASE_URL}/admin/api/reports/sales_revenue/?days=${days}`, {
        headers: getHeaders()
    });
    return response.data;
};
