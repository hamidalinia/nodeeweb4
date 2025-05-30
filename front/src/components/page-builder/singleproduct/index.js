import React, {useEffect, useState} from 'react';
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

import {ProductsSliderServer} from '#c/components/components-overview/ProductsSlider';
import ShowElement from '#c/components/page-builder/Render/index';
import {PostSliderServer} from '#c/components/components-overview/PostSlider';
import {withTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';
import _isEqual from "lodash/isEqual";
import {useSelector} from "react-redux";
import store from '#c/functions/store';

const getURIParts = (url) => {
  var loc = new URL(url);
  return loc;
};

function Content(props) {
  const {element, content} = props;

  if (element && element.content && content && content[element.content])
    return content[element.content];
  // return <div className={"col " + (typeof classes =='string' ? classes : classes ? classes.map(ob => (ob.name ? ob.name : ob)).join(" ") : "")}>
  //     {components && components.map((item,i) => {
  //         return <ShowElement element={item} key={i}/>;
  //     })}
  // </div>;
}

const Singleproduct = (props) => {
  // return false;

  console.log('Single Product...', props);
  let navigate = useNavigate();

  const [tracks, settracks] = useState('');
  const [theload, settheload] = useState(true);
  let {match, location, history, t, url} = props;
  let {element = {}, content} = props;
  let {data = {}, settings = {}, children} = element;
  const themeData = useSelector((st) => st.store.themeData, _isEqual);
  let st = store.getState().store;
  let {token} = st.user;
  let {showPricesToPublic = true} = themeData

  console.log("element", element)
  console.log("children", children)
  let {general = {}} = settings;
  let {fields = {}} = general;
  let {entity = 'product', _id = ''} = fields;
  let mainParams = useParams();
  let params = data;
  console.log('mainParams', mainParams);
  const loadDes = async () => {
    // console.clear()
    if (mainParams._id)
      getEntity('product', mainParams._id).then((resp) => {
        console.log('resp', resp);
        // setLoadingMoreItems(false);
        if (!showPricesToPublic && !token) {
          delete resp.price;
          delete resp.salePrice;
          delete resp.combinations;
        }
        afterGetData(resp);
      });
  };

  //
  // useEffect(() => {
  //   console.log("params.offset");
  //   loadProductItems(0);
  // }, [params.offset]);

  useEffect(() => {
    // console.log("params._id");
    loadDes();
  }, []);
  //

  const afterGetData = (resp, tracks = []) => {
    console.log('afterGetData', resp, tracks);
    if (resp) {
      // if (resp.description && resp.description['fa']) {
      if (resp) {
        // console.log("resp.description['fa']", resp.description['fa']);
        // settracks(resp.description['fa']);
        settracks(resp);
        settheload(false);
      } else {
        settheload(false);
      }


      // if (resp && resp.length < 1) sethasMoreItems(false);
    } else {
      // sethasMoreItems(false);
      // setLoad(false);
      settheload(false);
    }
  };
  const loader = (<div className="loadNotFound loader "> {t('loading...')} <LoadingComponent/>
    </div>
  );
  // return false
  return (<div className="main-content-container fghjkjhgf ">
      {theload && loader}
      {/*{!theload && tracks && ( <div className = "d-inline-block item-icon-wrapper mt-3 ki765rfg hgfd"*/}
      {/*dangerouslySetInnerHTML = {*/}
      {/*{ __html: tracks }*/}
      {/*}*/}
      {/*/>*/}
      {/*)*/}
      {/*}*/}
      {children && children[0] instanceof Array ?
        children[0].map((i, idx) => (<ShowElement params={{...params, ...tracks}}
                                                  key={idx}
                                                  element={i}
                                                  content={content}
          />
        )) : children instanceof Array ?
          children.map((i, idx) => (<ShowElement params={{...params, ...tracks}}
                                                 key={idx}
                                                 element={i}
                                                 content={content}
            />
          )) :
          ''
      } </div>
  );
};


export default withTranslation()(Singleproduct);
