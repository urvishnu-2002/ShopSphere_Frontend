import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";



// vendor register
export const vendorRegister = async (signupData) => {
    const token = localStorage.getItem("accessToken");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    console.log(signupData);
    const response = await axios.post(
        `${API_BASE_URL}/vendor/register/`,
        signupData,
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
        `${API_BASE_URL}/vendor/products/add/`,
        formData,
        { headers }
    );

    return response.data;
};
