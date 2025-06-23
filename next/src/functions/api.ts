import axios, { InternalAxiosRequestConfig } from 'axios'; // Add InternalAxiosRequestConfig import
import { getBaseUrl } from '@/constants/config';
import { getToken, clearToken } from '@/utils';
import { logout } from '@/store/slices/userSlice';
import { AppStore } from '@/store'; // Import AppStore type

// Create Axios instance
const api = axios.create({
    baseURL: typeof window !== 'undefined' ? getBaseUrl() : '',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'response': 'json',
    },
    timeout: 10000,
});

// Store reference variable
let currentStore: AppStore | null = null;

// Function to set store reference
export const setApiStore = (store: AppStore) => {
    currentStore = store;
};

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const token = getToken();
            if (token) {
                config.headers = config.headers || {};
                config.headers.token = `${token}`;
            }
        }
        return config;
    }
);

// Response interceptor
// api.interceptors.response.use(
//     (response: AxiosResponse) => response,
//     (error: AxiosError) => {
//         if (error.response?.status === 401) {
//             clearToken();
//
//             // Dispatch logout action if store is available
//             if (currentStore) {
//                 currentStore.dispatch(logout());
//             }
//         }
//         return Promise.reject(error);
//     }
// );

export default api;