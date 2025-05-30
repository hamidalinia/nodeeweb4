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
const Productlabel = (props) => {
    console.log('Productlabel...', props);
    // return 'ho'
    let navigate = useNavigate();

    const [tracks, settracks] = useState('');
    // const [title, setTitle] = useState('');
    const [theload, settheload] = useState(true);
    let { match, location, history, t, url } = props;
    let { element = {},params={} } = props;
    let { labels } = params;
    let { data = {}, settings = {} } = element;
    let { general = {} } = settings;
    let { fields = {} } = general;
    let { entity = 'productCategory', _id = '' } = fields;
    let mainParams = useParams();
    // let params = data;
    console.log('mainParams ', mainParams._id);
    //
    // useEffect(() => {
    //   console.log("params.offset");
    //   loadProductItems(0);
    // }, [params.offset]);

    useEffect(() => {
        // console.log("params._id");
        // console.log("hihihihihi")
    }, []);
    //

if(!labels)
  return <></>
    return (<div className={'the-labeled'}>
        {labels?.map((lab, k) => {
          return (
            <div className={'the-label'} key={k}>
              {lab.title}
            </div>
          );
        })}
      </div>
    );
};

export default withTranslation()(Productlabel);
