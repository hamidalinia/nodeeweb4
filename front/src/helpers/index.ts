import {
  digitsArToEn,
  digitsFaToEn,
  halfSpace,
} from '@persian-tools/persian-tools';

export const fPrice = (n = 0) => Number(n).toLocaleString();
export const NormalizeNumber = (a) => Number(digitsFaToEn(String(a)));

export const NormalizeString = (str) =>
  halfSpace(digitsArToEn(digitsFaToEn(str)));

export const isDev = process.env.NODE_ENV === 'development';
export const isProd = !isDev;
