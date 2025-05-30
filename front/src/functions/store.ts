import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import thunk from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import reducer from '@/functions/reducer';

const createNoopStorage = () => ({
  getItem: (_key) => Promise.resolve(null),
  setItem: (_key, value) => Promise.resolve(value),
  removeItem: (_key) => Promise.resolve(),
});

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

const persistConfig = {
  key: 'nodeeweb',
  storage,
};
export const storeProducts = (data) => ({
  type: 'STORE_PRODUCTS',
  payload: data,
});

export const storeChat = (data) => ({
  type: 'STORE_CHAT',
  payload: data,
});
export const storePosts = (data) => ({
  type: 'STORE_POSTS',
  payload: data,
});
export const storeProduct = (data) => ({
  type: 'STORE_PRODUCT',
  payload: data,
});
export const storeAttrValue = (data) => ({
  type: 'STORE_ATTR_VALUE',
  payload: data,
});

const pReducer = persistReducer(persistConfig, reducer);

const middlewares = [thunk];

const isDev = process.env.NODE_ENV === 'development1';
if (isDev) {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

const store = createStore(pReducer, applyMiddleware(...middlewares)); // Creating the store again
const persistor = persistStore(store);

export { store, persistor };

export default store;
