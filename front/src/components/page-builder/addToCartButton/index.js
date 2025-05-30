import React, { useEffect, useState } from 'react';
import LoadingComponent from '#c/components/components-overview/LoadingComponent';
import SidebarActions from '@/components/single-post/SidebarActions';
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
const AddToCartButton = (props) => {
  // console.clear()
    console.log('AddToCartButton...', props);
    // return 'ho'
    let navigate = useNavigate();

    const [tracks, settracks] = useState('');
    const [state, setState] = useState([]);
    // const [title, setTitle] = useState('');
    const [theload, settheload] = useState(true);
    let { match, location, history, t, url } = props;
    let { element = {} ,params={}} = props;
    let { data = {}, settings = {} } = element;
    let { general = {} } = settings;
    let { fields = {} } = general;
    let { entity = 'productCategory'} = fields;
    let mainParams = useParams();
    // let params = data;
    console.log('mainParams ', mainParams._id);

    //
    // useEffect(() => {
    //   console.log("params.offset");
    //   loadProductItems(0);
    // }, [params.offset]);

    useEffect(() => {
        console.log("params",params);
        console.log("hihihihihi")
    }, []);
    //

    let {
      _id,
        status,
        size,
        weight,
        labels,
      title,
        item_catalog_group_id,
        load,
        description,
        photos,
        redirect,
        price,
        salePrice,
        store_name,
        store_id,
        customer,
        type,
        updatedAt,
        countryChoosed,
        firstCategory,
        secondCategory,
        thirdCategory,
        sections,
        categories,
        combinations,
      notBuyableAlone=false,
      oneItemPerOrder=false,
        options,
        quantity,
        brand,
        thumbnail,
        extra_button,
        product_item,
        in_stock,
        extra_attr,
        excerpt,
        division,
        like,
        metseccode,
        views = null
      } = params;
    // return JSON.stringify(params)
    if(((photos && !photos[0]) || !photos) && thumbnail){
      photos=[thumbnail]
    }
    if(fields?._id){
      _id=fields._id;
    }
    return ((title && title?.fa) && ( <SidebarActions
                className={"mobilenone "} add={false} edit={true} _id={_id} customer={customer}
                updatedAt={updatedAt}
                countryChoosed={countryChoosed}
                type={type}
                price={price}
                salePrice={salePrice}
                firstCategory={firstCategory}
                store_id={store_id}
                secondCategory={secondCategory}
                notBuyableAlone={notBuyableAlone}
                oneItemPerOrder={oneItemPerOrder}
                photos={photos}
                title={title}
                combinations={combinations}
                options={options}
                in_stock={in_stock}
                quantity={quantity}
                thirdCategory={thirdCategory}/>
            )
        );
};

export default withTranslation()(AddToCartButton);
