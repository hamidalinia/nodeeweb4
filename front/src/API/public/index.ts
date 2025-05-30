import { Reject } from '@/API/utils';
import { API } from '@/API/API';

export const getList = (q) =>
  API.get('/', q).then(({ ok, data }) => {
    if (ok) {
      return data;
    }
    return Reject(data);
  });
