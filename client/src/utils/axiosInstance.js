import axios from 'axios';

// Extract and sanitize baseURL from environment
const rawBaseURL = (import.meta.env.VITE_API_BASE_URL || '').trim();
// Strip trailing /api or trailing slash to keep consistent with API_PATHS which start with /api/
const cleanBaseURL = rawBaseURL ? rawBaseURL.replace(/\/api\/?$/, '').replace(/\/+$/, '') : '';

const axiosInstance = axios.create({
  baseURL: cleanBaseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url) {
      // Prevent any double /api/api/ prefix accidental concatenation
      config.url = config.url.replace(/^\/api\/api\//, '/api/');
    }
    const token = localStorage.getItem('tdg_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only clear token if the request was to a verified protected endpoint and explicitly returned session expired
    if (
      error.response &&
      error.response.status === 401 &&
      error.config &&
      (error.config.url.includes('/api/auth/me') ||
        error.response.data?.message?.toLowerCase().includes('session expired') ||
        error.response.data?.message?.toLowerCase().includes('token expired'))
    ) {
      if (localStorage.getItem('tdg_auth_token')) {
        localStorage.removeItem('tdg_auth_token');
        localStorage.removeItem('tdg_user');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
