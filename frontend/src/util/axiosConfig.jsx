import axios from "axios";
import { BASE_URL } from "./apiEndpoints";
import { getToken, removeToken, removeUser } from "./storage";

const axiosConfig = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
});

const excludedEndpoints = ["/login", "/register", "/status", "/activate", "health"];

axiosConfig.interceptors.request.use((config) => {
    const shouldSkipToken = excludedEndpoints.some((endpoint) => config.url?.includes(endpoint));
    if (!shouldSkipToken) {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

axiosConfig.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
            removeToken();
            removeUser();
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default axiosConfig;