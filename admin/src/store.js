import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { isDev } from '@/Utils';

import rootReducer from './rootReducer';

export default function configureStore(initialState = {}) {
  const middlewares = [thunkMiddleware];

  if (isDev) {
    const { logger } = require('redux-logger');
    middlewares.push(logger);
  }

  const middleware = applyMiddleware(...middlewares);
  const store = middleware(createStore)(rootReducer, initialState);

  return store;
}
