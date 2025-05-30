import React, { useEffect, useState } from 'react';
import LoadingComponent from '#c/components/components-overview/LoadingComponent';
import Theprice from '@/components/single-post/Theprice';
import {
    enableAdmin,
    enableAgent,
    enableSell,
    fetchCats,
    getEntitiesWithCount,
    getEntity,
    getPosts,
    getPostsByCat,
    isClient,
    loadPosts,
    loadProducts,
    SaveData,
    setCountry,
} from '#c/functions/index';

import { ProductsSliderServer } from '#c/components/components-overview/ProductsSlider';
import { PostSliderServer } from '#c/components/components-overview/PostSlider';
import { withTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const getURIParts = (url) => {
    var loc = new URL(url);
    return loc;
};
const Prices = (props) => {
    console.log('Prices...', props);
    // return 'ho'
    let navigate = useNavigate();

    const [tracks, settracks] = useState('');
    // const [price, setPrice] = useState('');
    // const [salePrice, setSalePrice] = useState('');
    // const [in_stock, setInStock] = useState('');
    const [theload, settheload] = useState(true);
    let { match, location, history, t, url } = props;
    let { element = {},params={} } = props;
    let { price ,salePrice,in_stock } = params;
    let { data = {}, settings = {} } = element;
    let { general = {} } = settings;
    let { fields = {} } = general;
    let { entity = 'productCategory', _id = '' } = fields;
    let mainParams = useParams();
    // let para/ms = data;
    console.log('mainParams ', mainParams._id);


    //
    // useEffect(() => {
    //   console.log("params.offset");
    //   loadProductItems(0);
    // }, [params.offset]);

    useEffect(() => {
        // console.log("params._id");
        console.log("hihihihihi")
    }, []);
    //


    return (price && ( <Theprice
                className={'single'}
                price={price}
                salePrice={salePrice? salePrice : ''}
                in_stock={in_stock}
              />
            ));
};

export default withTranslation()(Prices);
