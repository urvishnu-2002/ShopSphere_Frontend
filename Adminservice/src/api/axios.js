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
    const token = localStorage.getItem("accessToken");

    const response = await axios.get(
        `${base_url}/vendor-requests/`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};
