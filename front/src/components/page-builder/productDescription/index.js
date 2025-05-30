import React, { useEffect, useState } from 'react';
import LoadingComponent from '#c/components/components-overview/LoadingComponent';

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
const ProductDescription = (props) => {
    console.log('Description...', props);
    // return 'ho'
    let navigate = useNavigate();

    const [tracks, settracks] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [theload, settheload] = useState(true);
    let { match, location, history, t, url } = props;
    let { element = {} } = props;
    let { data = {}, settings = {} } = element;
    let { general = {} } = settings;
    let { fields = {} } = general;
    let { entity = 'productCategory', _id = '' } = fields;
    let mainParams = useParams();
    let params = data;
    console.log('mainParams ', mainParams._id);

    //
    // useEffect(() => {
    //   console.log("params.offset");
    //   loadProductItems(0);
    // }, [params.offset]);

    useEffect(() => {
        // console.log("params._id");
        // loadDes();
        console.log("hihihihihi")
    }, []);
    //


    return (<div className="kjhghsdfjk hsdfgfd ">{description}</div>);
};

export default withTranslation()(ProductDescription);
