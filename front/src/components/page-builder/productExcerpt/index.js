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
const ProductExcerpt = (props) => {
    console.log('ProductExcerpt...', props);
    // return 'ho'
    let navigate = useNavigate();

    const [tracks, settracks] = useState('');
    const [title, setTitle] = useState('');
    // const [excerpt, setExcerpt] = useState('');
    const [theload, settheload] = useState(true);
    let { match, location, history, t, url } = props;
    let { element = {},params = {} } = props;
    let { excerpt } = params;
    let { data = {}, settings = {} } = element;
    let { general = {} } = settings;
    let { fields = {} } = general;
    let { entity = 'productCategory', _id = '' } = fields;
    let mainParams = useParams();
    // let params = data;
    console.log('excerpt mainParams ', mainParams._id,excerpt);

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

  return ( <div className = "main-content-container fghjkdfsdffdjhgf " >
      {(excerpt && excerpt?.fa) && (
            <div
              className="d-inline-block item-icon-wrapper mt-3 ki765rfg hgfd"
              dangerouslySetInnerHTML={{ __html: excerpt?.fa }}
            />
          )} </div>
    );
};

export default withTranslation()(ProductExcerpt);
