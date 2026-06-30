import axios from 'axios';

const api = axios.create({
    // Use environment variable or fallback to 127.0.0.1
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api',
});

// Interceptor to add token
api.interceptors.request.use((config) => {
    try {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            if (userInfo && userInfo.token) {
                config.headers.Authorization = `Bearer ${userInfo.token}`;
            }
        }
    } catch (e) {
        console.error("Auth Interceptor Error:", e);
    }
    return config;
});

export default api;
