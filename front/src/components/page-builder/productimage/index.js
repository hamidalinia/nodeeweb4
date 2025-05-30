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
import description from '../description';
import Gallery from '@/components/single-post/Gallery';

const getURIParts = (url) => {
    var loc = new URL(url);
    return loc;
};
const Productimage = (props) => {
  // return false;
    console.log('Productimage... for image', props);
    // return 'ho'
    let navigate = useNavigate();

    const [tracks, settracks] = useState('');
    const [title, setTitle] = useState('');

    const [theload, settheload] = useState(false);
    let { match, location, history, t, url } = props;
    let { element = {},params={} } = props;
  // const [photo, setPhoto] = useState(params?.photos || '');
  // const [thumbnail, setThumbnail] = useState(params?.thumbnail ||  '');
    let { data = {}, settings = {} } = element;
    let { general = {} } = settings;
    let { fields = {} } = general;
    let { entity = 'productCategory', _id = '' } = fields;
    let mainParams = useParams();
    let {photos,thumbnail}=params;
    // let params = data;
  // return JSON.stringify(params);
  //   console.log('params at image', params?.photos);
  //   console.log('params at image', params?.thumbnail);
    console.log('mainParams ', mainParams._id);
    // const loadDes = async() => {
    //     console.log("loadDes Description... for image", mainParams._id)
    //     if (mainParams._id)
    //         getEntity('product', mainParams._id).then((resp) => {
    //             console.log('resp', resp);
    //             // setLoadingMoreItems(false);
    //             afterGetData(resp);
    //         });
    // };

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

    // const afterGetData = (resp, tracks = []) => {
    //     console.log('afterGetData Productimage', resp, tracks);
    //     if (resp) {
    //         if (resp.description && resp.description['fa']) {
    //             console.log("resp.description['fa']", resp.description['fa']);
    //             settracks(resp.description['fa']);
    //             settheload(false);
    //         }
    //         if (resp.photos && resp.photos.length > 0) {
    //             console.log('has photo', resp.photos, resp.thumbnail)
    //             setPhoto(resp.photos);
    //             setThumbnail(resp.thumbnail);
    //             settheload(false);
    //         }
    //
    //
    //         // if (resp && resp.length < 1) sethasMoreItems(false);
    //     } else {
    //         // sethasMoreItems(false);
    //         // setLoad(false);
    //         settheload(false);
    //     }
    // };
    const loader = ( <div className = "loadNotFound loader " > { t('loading...') }
    <LoadingComponent />
        </div>
    );
    return ( <div className = "main-content-container fghjkjfddfhgf " >
    {!theload && photos && ( <Gallery photos = { photos }
                thumbnail = { thumbnail }
                />
            )
        } </div>
    );
};

export default withTranslation()(Productimage);
