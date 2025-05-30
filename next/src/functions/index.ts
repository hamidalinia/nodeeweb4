import api from './api';
import { getBaseUrl } from '@/constants/config';

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

        const res = await api.get(url, { params: queryObj });

        return res.data;
    } catch (err: any) {
        console.error(`Axios error fetching ${entity}:`, err);
        throw new Error(err?.response?.data?.message || err.message || 'Unknown error');
    }
}
