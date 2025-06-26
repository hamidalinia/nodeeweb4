import api from './api';
import {getBaseUrl} from '@/constants/config';
import { logout } from '@/store/slices/userSlice';

import type { CartItem } from "@/types/cart";



export async function fetchEntity(
    entity: string,
    offset: number,
    limit: number,
    customQuery?: string | Record<string, any>
) {
    try {
        let url = `${getBaseUrl()}/customer/${entity}/${offset}/${limit}`;
        let queryObj: Record<string, any> = {};

        if (customQuery) {
            queryObj = typeof customQuery === 'string' ? JSON.parse(customQuery) : customQuery;
        }
        console.log("queryObj", queryObj)
        const res = await api.get(url, {params: queryObj});

        return res.data;
    } catch (err: any) {
        console.error(`Axios error fetching ${entity}:`, err);
        throw new Error(err?.response?.data?.message || err.message || 'Unknown error');
    }
}

export async function register(
    number: string, fd: string, method: string
) {
    try {
        let url = `${getBaseUrl()}/customer/customer/authCustomer`;

        const res = await api.post(url, {

            phoneNumber: number,
            countryCode: fd,
            method: method,
        })
        console.log("res",res)
        return res?.data;
        // user = {...user, ...{phoneNumber: number, countryCode: fd}};
        // if (data.success) SaveData({user: user});

    } catch (err) {
        console.error(`Axios error fetching:`, err);
        // throw new Error(err?.response?.data?.message || err.message || 'Unknown error');


    }
}


interface AuthSuccessResponse {
    success: boolean;
    token: string;
    customer: {
        firstName: string;
        address: any;
        token: string;
        lastName: string;
    };
    // Add other success response fields as needed
}

interface AuthErrorResponse {
    error: true;
    status: number;
    message: string;
    requiresToast?: boolean;
}

export async function authCustomerWithPassword(
    phoneNumber: string,
    password: string
): Promise<AuthSuccessResponse | AuthErrorResponse> {
    try {
        const url = `${getBaseUrl()}/customer/customer/authCustomerWithPassword`;

        const res = await api.post<AuthSuccessResponse>(url, {
            phoneNumber: parseInt(phoneNumber),
            password
        });

        return res.data;

    } catch (err: any) {
        // Handle 401 Unauthorized
        if (err?.response?.status === 401) {
            // Dispatch logout action to clear token from Redux state
            // store.dispatch(logout());

            return {
                error: true,
                status: 401,
                message: err?.response?.data?.message || 'Invalid credentials',
                requiresToast: true
            };
        }

        // Handle other errors
        return {
            error: true,
            status: err?.response?.status || 500,
            message: err?.response?.data?.message ||
            err.message ||
            'Authentication failed',
            requiresToast: true
        };
    }
}

export async function authCustomerForgotPass(
    phoneNumber: string,
    countryCode: string,
    method: string,
) {
    try {
        let url = `${getBaseUrl()}/customer/customer/authCustomerForgotPass`;

        const res = await api.post(url, {

            phoneNumber: parseInt(phoneNumber),
            countryCode: parseInt(countryCode),
            method: method,
        })
        console.log("res",res)
        return res?.data;

    } catch (err) {
        console.error(`Axios error fetching:`, err);
        // throw new Error(err?.response?.data?.message || err.message || 'Unknown error');


    }
}


export async function authenticateCustomerWithOTP(
    phoneNumber: string,
    activationCode: string
) {
    try {
        let url = `${getBaseUrl()}/customer/customer/activateCustomer`;

// console.log("parseInt(phoneNumber)",Number(phoneNumber),phoneNumber)
        const res = await api.post(url, {

            phoneNumber: phoneNumber,
            activationCode: activationCode
        })
        // console.log("res",{
        //
        //     phoneNumber: phoneNumber,
        //     activationCode: activationCode
        // },res)
        return res?.data;

    } catch (err) {
        console.error(`Axios error fetching:`, err);
        // throw new Error(err?.response?.data?.message || err.message || 'Unknown error');


    }
}



export async function setPassWithPhoneNumber(data:any) {
    try {
        let url = `${getBaseUrl()}/customer/customer/setPassword`;

console.log("data",data)
        const res = await api.post(url, data)
        console.log("res",data,res)
        return res?.data;

    } catch (err) {
        console.error(`Axios error fetching:`, err);
        // throw new Error(err?.response?.data?.message || err.message || 'Unknown error');


    }
}



export async function getSettings() {
    try {
        let url = `${getBaseUrl()}/customer/settings`;
        const res = await api.get(url)
        return res?.data;

    } catch (err) {
        console.error(`Axios error fetching:`, err);


    }
}
export async function getAddress() {
    try {
        let url = `${getBaseUrl()}/customer/customer/getAddress`;
        const res = await api.get(url)
        return res?.data;

    } catch (err) {
        console.error(`Axios error fetching:`, err);


    }
}
export async function getGateways() {
    try {
        let url = `${getBaseUrl()}/customer/gateway/0/10?filter={%22type%22:%22bank%22}`;
        const res = await api.get(url)
        return res?.data;

    } catch (err) {
        console.error(`Axios error fetching:`, err);


    }
}


export async function updateAddress(data:any) {
    try {
        let url = `${getBaseUrl()}/customer/customer/updateAddress`;

        console.log("data",data)
        const res = await api.put(url, data)
        console.log("res",data,res)
        return res?.data;

    } catch (err) {
        console.error(`Axios error fetching:`, err);
        // throw new Error(err?.response?.data?.message || err.message || 'Unknown error');


    }
}
