import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Col, Row } from 'shards-react';
import LoadingComponent from '#c/components/components-overview/LoadingComponent';
import LastPart from '#c/components/checkout/LastPart';

import {
  addItem,
  addItemOne,
  enableAdmin,
  enableAgent,
  enableSell,
  fetchCats,
  getEntities,
  getEntitiesWithCount,
  getEntity,
  getPath,
  getPosts,
  getPostsByCat,
  isClient,
  loadPosts,
  loadProducts,
  MainUrl,
  recmoveItem,
  SaveData,
  createOrder,
  buy,
  setCountry,
} from '#c/functions/index';
import { ProductsSliderServer } from '#c/components/components-overview/ProductsSlider';
import { PostSliderServer } from '#c/components/components-overview/PostSlider';
import { withTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import store from '#c/functions/store';
import { useSelector } from 'react-redux';

const getURIParts = (url) => {
  var loc = new URL(url);
  return loc;
};

const FastCheckout = (props) => {
  // const [thecalc, setthecalc] = useState(false);
  const [theload, settheload] = useState(false);
  const [tracks, settracks] = useState([]);
  const [sum, setSum] = useState(0);
  const [amount, setAmount] = useState(0);
  // let [card, setCard] = useState(store.getState().store.card || [])
  let [user, setUser] = useState(store.getState().store.user || []);
  let [order_id, setOrder_id] = useState(store.getState().store.order_id || []);
  let [paymentMethod, setPaymentMethod] = useState('');
  const card = useSelector((st) => st.store.card);

  const divRef = useRef();

  // const [text, setText] = useState('');
  // const [C, settheload] = useState(false);
  let { element = {}, params = {}, t } = props;

  const loader = (
    <div className="loadNotFound loader ">
      {t('loading...')}
      <LoadingComponent />
    </div>
  );
  const afterGetData = (resp, tracks = []) => {
    // console.log('afterGetData', resp, tracks)
    // console.log('set data:', resp)
    settracks(resp);
    // setcount(count);
    settheload(false);
  };
  // console.log('general', general)
  // console.log('params', params)
  const thparams = useParams();
  const loadProductItems = async (page, filter = {}) => {
    settracks([]);
    settheload(true);
    let query = {};

    // let newOffset = (await offset) + 24;
    getEntity('product', page).then((resp) => {
      // setLoadingMoreItems(false);
      addItemOne(resp).then((x) => {
        // toggleCardbar();
        console.log('after add to cart:', x);
        let s = 0;
        if (x && x.length)
          x.map((it) => {
            s += (it.salePrice || it.price) * it.count;
          });
        setSum(s);
        setAmount(s);
        afterGetData(resp);

        // toast(t('Added to cart successfully!'), {
        //   type: 'success'
        // })
      });
    });
  };
  const placeOrder = (theprice = 0) => {
    // let {address, hover, deliveryPrice, hoverD, order_id, card, setting, user, sum, paymentMethod, return_url, amount,  discountCode, discount} = state;
    // const { t } = props
    // let c;
    // console.log("placeOrder...", state);
    console.log('placeOrder...', store.getState().store.order_id);
    // return;
    let s = 0;
    card.map((item, idx2) => {
      s += (item.salePrice || item.price) * item.count;
    });
    let order = {
      // deliveryDay: setting,
      // billingAddress: the_address,
      card: card,
      customer_data: user,
      sum: sum,
      deliveryPrice: 0,
      amount: amount,
      // discountCode: discountCode,
      // discount: discount,
      customer: user._id,
    };
    if (order_id) {
      order['order_id'] = order_id;
    }
    if (store.getState().store.order_id) {
      order['order_id'] = store.getState().store.order_id;
    }
    // console.log('user',user);
    // return;
    // if (!user.internationalCode) {
    //   toast(t("Please enter international code!"), {
    //     type: "error"
    //   });
    //   return;
    // }
    // if (!user.firstName) {
    //   toast(t("Please enter first name!"), {
    //     type: "error"
    //   });
    //   return;
    // }
    // if (!user.lastName) {
    //   toast(t("Please enter last name!"), {
    //     type: "error"
    //   });
    //   return;
    // }
    // if (!order.billingAddress || (order.billingAddress && order.billingAddress.length < 1)) {
    //   toast(t("Please enter address!"), {
    //     type: "error"
    //   });
    //   return;
    //
    // }
    toast(t('Submitting order...'), {
      type: 'success',
    });
    
    console.log('order', order);
    console.log('paymentMethod', paymentMethod);
    // return;

    createOrder(order).then((res) => {
      // console.log('res for judytgs is:', res.order._id);
      if (!res.success) {
        toast(t(res.message), {
          type: 'error',
        });
        return 0;
      }
      toast(t('Submitting transaction...'), {
        type: 'success',
      });
      buy(
        res.order._id,
        {
          method: paymentMethod,
        },
        theprice
      ).then((add) => {
        if (add.success)
          toast(t('Navigating...'), {
            type: 'success',
          });
        if (!add.success)
          return toast(t('Error...'), {
            type: 'error',
          });
        console.log('ass', add);
        if (isClient) window.location.replace(add.url);
      });
    });
  };

  useEffect(() => {
    console.log('params._id');
    if (thparams && thparams._id) loadProductItems(thparams._id);
  }, []);
  //
  const setThePaymentMethod = (e) => {
    console.log('setPaymentMethod', e);
    setPaymentMethod(e);
  };
  console.log('thparams', thparams);
  // return (<div className="main-content-container fghjkjhgf ">
  //
  //   <Row className={"m-0"}>
  //     <div>{JSON.stringify(thparams)}</div>
  //   </Row></div>)
  return (
    <div className="main-content-container fghjkjhgf ">
      <Row className={'m-0'}>
        {theload && loader}
        {!theload && tracks && (
          <Col
            className="main-content iuytfghj pb-5"
            lg={{ size: 12 }}
            md={{ size: 12 }}
            sm="12"
            tag="main">
            <div className="fields pt-2">
              <LastPart
                prev={'hidden'}
                onPrev={() => {}}
                onPlaceOrder={(e) => {
                  placeOrder(e);
                }}
                theParams={{
                  sum: sum,

                  amount: amount,
                  // tax: (themeData && themeData.tax) ? themeData.tax : 0,
                  deliveryPrice: 0,
                  address: {},
                  setPaymentMethod: (e) => {
                    console.log('setPaymentMethod', e);
                    setThePaymentMethod(e);
                  },
                  setamount: (e) => {
                    console.log('setTheAmount', e);
                    // setTheAmount(e)
                  },
                  setDiscount: (e, d = '') => {
                    console.log('setDiscount', e, d);
                    // setTheDiscount(e, d)
                  },
                }}
              />
            </div>
          </Col>
        )}
      </Row>
      {/*{text}*/}
    </div>
  );
};
export const HomeServer = [];
export default withTranslation()(FastCheckout);
