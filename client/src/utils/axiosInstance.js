import axios from "axios";
import toast from "react-hot-toast";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

// Attach token to every request
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle refresh + logout
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config || {};

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/api/user/refresh-token")
        ) {
            originalRequest._retry = true;

            try {
                const res = await instance.post("/api/user/refresh-token");

                const newToken = res.data.accessToken;

                localStorage.setItem("token", newToken);

                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newToken}`,
                };

                return instance(originalRequest);
            } catch (err) {
                localStorage.removeItem("token");

                toast.error("Session expired. Please login again.");

            }
        }

        return Promise.reject(error);
    }
);

export default instance;