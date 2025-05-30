import _get from 'lodash/get';

export const Reject = (data) => {
  // eslint-disable-next-line prefer-promise-reject-errors
  if (!data) return Promise.reject('مشکلی در دریافت اطلاعات وجود دارد.!');

  let msg = [];
  let { errors: err = [] } = data || {};
  err.forEach((i) => {
    let a = _get(i, '[0].errorMessage', null);
    if (a) msg.push(a);
  });
  msg.push(data.message || 'مشکلی در دریافت اطلاعات وجود دارد.!');

  return Promise.reject(msg[0]);
};

export const toForm = (data) => {
  let formData = new FormData();
  for (let key in data) {
    if (data[key] != null) formData.append(key, data[key]);
  }

  return formData;
};
