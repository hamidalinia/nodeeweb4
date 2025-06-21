import api from './api';
import {getBaseUrl} from '@/constants/config';
import {useAppDispatch} from '@/store/hooks';

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
        throw new Error(err?.response?.data?.message || err.message || 'Unknown error');


    }
}


export async function authCustomerWithPassword(
    phoneNumber: string, password: string
) {
    try {
        let url = `${getBaseUrl()}/customer/customer/authCustomerWithPassword`;

        const res = await api.post(url, {

            phoneNumber: parseInt(phoneNumber),
            password: password
        })
        console.log("res",res)
        return res?.data;

    } catch (err) {
        console.error(`Axios error fetching:`, err);
        throw new Error(err?.response?.data?.message || err.message || 'Unknown error');


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
        throw new Error(err?.response?.data?.message || err.message || 'Unknown error');


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
        throw new Error(err?.response?.data?.message || err.message || 'Unknown error');


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
        throw new Error(err?.response?.data?.message || err.message || 'Unknown error');


    }
}
