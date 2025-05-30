import axios from 'axios';
import { getBaseUrl } from '@/constants/config';

const api = axios.create({
    baseURL: typeof window !== 'undefined' ? getBaseUrl() : '', // Client-side only
    headers: {
        'Content-Type': 'application/json',
        'response':'json'
    },
});

export default api;
