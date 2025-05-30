import { combineReducers } from 'redux';

import Types from './types';

const initialState = {
  appUpdate: false,
  menuVisible: false,
  menuContact: false,

  data: {},
  loading: true,
  searchvisible: false,
  address: [],
  settings: [],
  billingAddress: {},
  allCategories: [],
  gptchat: [],
  cat: '',
  siteStatus: {},
  siteStatusMessage: '',
  // billingAddresses:[],
  // shippingAddress:{},
  // shippingAddresses:[],
  user: {},
  // user: localStorage.getItem('user') || {},
  admin: {},
  productSliderData: [],
  postSliderData: [],
  product: {},
  post: {},
  page: {},
  sum: 0,
  attr: '',
  value: '',
  postCardMode: 'grid',
  defaultSort: 'datedesc',
  themeData: {},
  homeData: {},
  // phoneNumber: null,
  // firstName: '',
  // lastName: '',
  // token: null,
};

const reducer = (state = initialState, { type, data, payload }) => {
  switch (type) {
    case Types.Home:
      return Object.assign({}, state, {
        data: {},
        loading: true,
      });

    case Types.Receive:
      return Object.assign({}, state, {
        data,
        loading: false,
      });

    case Types.Error:
      return Object.assign({}, state, {
        loading: false,
      });

    case Types.SaveData:
      return Object.assign({}, state, data);

    case 'cats/catsLoaded':
      // Replace the existing state entirely by returning the new value
      return {
        ...state,
        allCategories: payload.allCategories,
        cat: payload.cat,
        searchvisible: false,
      };

    case 'theme/themeLoaded':
      return { ...state, themeData: payload.themeData };

    case 'site/status':
      return {
        ...state,
        siteStatus: payload.success,
        siteStatusMessage: payload.siteStatusMessage,
        activeCategory: payload.activeCategory,
      };

    case 'STORE_ATTR_VALUE':
      return {
        ...state,
        attr: payload.attr,
        value: payload.value,
      };

    case 'STORE_PRODUCTS':
      initialState.productSliderData[payload.id] = payload.data;
      return { ...state, productSliderData: initialState.productSliderData };

    case 'STORE_POSTS':
      if (payload.data) initialState.postSliderData[payload.id] = payload.data;
      return { ...state, postSliderData: initialState.postSliderData };

    case 'STORE_PRODUCT':
      initialState.product = payload.data;
      return { ...state, product: initialState.product };

    case 'STORE_CHAT':
      initialState.gptchat = payload.data;
      let temp = state.gptchat;
      temp.push(initialState.gptchat);
      return { ...state, gptchat: temp };

    case 'persist/REHYDRATE':
      // initialState.product = payload;
      if (payload) {
        delete payload.store.themeData;
        return { ...state, ...payload.store };
      }
      return state;

    default:
      return state;
  }
};

export default combineReducers({
  store: reducer,
});
