import { create } from 'apisauce';
import { toast } from 'react-toastify';
import _get from 'lodash/get';

import CONFIG from '@/config';
import { store } from '@/functions/store';

export const BASE_URL = CONFIG.BASE_URL + '/customer';

// define the api
export const API = create({
  baseURL: BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// add Authorization token to header
API.addRequestTransform((req) => {
  const st = store.getState().store || {};
  if (!req.headers) req.headers = {};

  req.headers.lan = st.lan;
  req.headers.token = _get(st, 'user.token', '');
});

// if status === 401 redirect to homepage
API.addResponseTransform((res) => {
  if (!res.ok) console.error('err => ', res);

  if (res.status === 401 || res.status === 403) {
    if (typeof window !== 'undefined') {
      const { message = 'لطفا وارد شوید' } = res.data || {};
      toast.error(message);
      window.location.replace('/login');
      localStorage.clear();
    }
  }
});
