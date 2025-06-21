import axios from 'axios';
import { getBaseUrl } from '@/constants/config';
import { getToken } from '@/utils';

const api = axios.create({
    baseURL: typeof window !== 'undefined' ? getBaseUrl() : '', // Client-side only
    headers: {
        'Content-Type': 'application/json',
        'response':'json'
    },
    // add Authorization token to header
    transformRequest: [
        (data, headers) => {
        console.log("headers1",headers)
            headers.token = getToken();
            console.log("headers",headers)

            if (typeof data === 'object') data = JSON.stringify(data);
            return data;
        },
    ],
});
// api.
// add Authorization token to header
// api.transformRequest((req) => {
//     console.log("hidwfede")
//     // const st = store.getState() || {};
//     if (!req.headers) req.headers = {};
//
//     // req.headers.lan = st?.lan;
//     req.headers.token  = getToken();
// });
export default api;
