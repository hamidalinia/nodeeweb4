import React, {useEffect, useState} from 'react';
import {Col, Container, Row,Button} from 'shards-react';
import {Link, useParams} from 'react-router-dom';
import Gallery from '#c/components/single-post/Gallery';
import {ImideatlyIcon, PersonInIcon, SecurityIcon, WarrantyIcon,} from '#c/components/single-post/base';
import Theprice from '#c/components/single-post/Theprice';
import {withTranslation} from 'react-i18next';
import {dFormat, PriceFormat} from '#c/functions/utils';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import {
  addBookmark,
  clearPost,
  getCourse,
  getThemeData,
  isClient,
  loadProduct,
  loveIt,
  MainUrl,
  savePost,
} from '#c/functions/index';
import {SnapChatIcon} from '#c/assets/index';
import Loading from '#c/components/Loading';
import store from '#c/functions/store';
import {useSelector} from 'react-redux';
// import { Link, useNavigate, useParams } from "react-router-dom";
// let obj = ;
// let the_id='';
import _isEqual from "lodash/isEqual";
// import warrantyIcon from window.location.origin + '/assets/warranty.png'


const AccordionVideo = ({title, src}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion-section">
      <button className="accordion-title free-videos" onClick={toggle}>
        <span>{title}</span>
        <span>
          {!isOpen && <ArrowDropDownIcon/>}
        {isOpen && <ArrowDropUpIcon/>}
        </span>
      </button>
      {isOpen && (
        <div className="accordion-content">
          <video width="320" height="240" controls>
            <source src={src} type="video/mp4"/>
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};
const AccordionSection = ({questionText, response}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion-section">
      <button className="accordion-title" onClick={toggle}>
        <span>{questionText}</span>
        {!isOpen && <KeyboardArrowDownIcon/>}
        {isOpen && <KeyboardArrowUpIcon/>}
      </button>
      {isOpen && (
        <div className="accordion-content">
          {response}
        </div>
      )}
    </div>
  );
};

const ExtraAttr = ({attrs}) => {
  // if(!attrs[0]){
  //   return <></>
  // }
  if(attrs && attrs[0])
  return (
    <div className=" extra-attrs">
      {attrs.map((attr, index) => (
        <div className="extra-attr" key={index}><CheckIcon className={'check-icon'}/><span>{attr?.title}</span></div>
      ))}
    </div>
  );
};
const VideoAccordion = ({videos}) => {
  return (
    <div className="accordion">
      {videos && videos.map((video, index) => (
        <AccordionVideo key={index} title={video.title} src={video.src}/>
      ))}
    </div>
  );
};
const FaqAccordion = ({faqs,t}) => {
  // if(!faqs){
  //   return <></>
  // }
  if(faqs && faqs[0])
  return (
    <div className="accordion-wrapper">

      <div className="accordion-title">
        {t("FAQ")}
      </div>
      <div className="accordion">
        {faqs.map((faq, index) => (
          <AccordionSection key={index} questionText={faq.questionText} response={faq.response}/>
        ))}
      </div>
    </div>
  );
};

const Course = (props) => {
  let {match, location, history, t, url} = props;

  let product = useSelector((st) => {
    return st.store.product || [];
  });
  const themeData = useSelector((st) => st.store.themeData, _isEqual);

  // window.scrollTo(0, 0);
  let params = useParams();
  // return;
  let the_id = params._id || params._product_slug;
  // let search = false;
  // let history = useNavigate();

  let st = store.getState().store;
  let {token} = st.user;

  let {showPricesToPublic = true} = themeData
  let fp = localStorage.getItem('username');
  // return JSON.stringify(fp)
  let admin_token = null;
  if (fp) {
    admin_token = fp;
  }
  const [mainId, setMainId] = useState(the_id);
  const [tab, setTab] = useState('attributes');
  const [state, setState] = useState(isClient ? [] : product || []);
  const [lan, setLan] = useState(store.getState().store.lan || 'fa');
  const [requiredWarranty, setRequiredWarranty] = useState(true);
  // const [enableAdmin] = useState(store.getState().store.enableAdmin || false);
// let videos=[{
//   "title":"hi",
//   "src":"/x.mp4"
// }]

  const getThePost = (_id) => {
    return new Promise(function (resolve, reject) {
      getCourse(_id).then((d = {}) => {
        let makePriceNull = false;
        if (!showPricesToPublic && !token) {
          makePriceNull = true;
        }
        // savePost({
        //   mainList: d.mainList,
        //   catChoosed: d.catChoosed,
        //   countryChoosed: d.countryChoosed,
        //   categories: d.categories,
        //   mainCategory: d.mainCategory
        // });

        // **********WarrantyRequired*********************
        console.log('d ', d.weight)
        if (d.requireWarranty) {
          setRequiredWarranty(d.requireWarranty);
        } else {
          setRequiredWarranty(false);
        }

        // **************WarrantyRequired*****************

        resolve({
          load: true,
          title: d.title,
          description: d.description,
          lyrics: d.lyrics,
          files: d.files,
          photos: d.photos,
          videos: d.videos,
          faq: d.faq,
          _id: d._id,
          extra_button: d.extra_button,
          customer: d.customer,
          catChoosed: d.catChoosed,
          countryChoosed: d.countryChoosed,
          weight: d.weight,
          updatedAt: d.updatedAt,
          nextPost: d.nextPost,
          type: d.type,
          price: (!makePriceNull) ? d.price : null,
          salePrice: (!makePriceNull) ? d.salePrice : null,
          allPostData: d.data,
          questions: d.questions,
          firstCategory: d.firstCategory,
          secondCategory: d.secondCategory,
          thirdCategory: d.thirdCategory,
          sections: d.sections,
          options: d.options,
          in_stock: d.in_stock,
          quantity: d.quantity,
          thumbnail: d.thumbnail,
          labels: d.labels,
          excerpt: d.excerpt,
          season: d.season,
          categories: d.categories,
          extra_attr: d.extra_attr,
          views: d.views,
          like: d.like,
          combinations: (!makePriceNull) ? d.combinations : [],
        });
      });
    });
  };

  if (isClient)
    useEffect(() => {
      // let mounted = true;
      let {_id, title} = params;
      getThePost(the_id).then((items) => {
        console.log('items in product', items)
        setState(items);
        if (isClient) window.scrollTo(0, 0);
        // }
      });
      // return () => mounted = false;
    }, [the_id]);

  // useEffect(() => {
  //   let { _id, title } = params;
  //   // if (mainId != _id) {
  //   getThePost(_id).then(res=>setState(state => ({ ...state, ...res })));
  //   window.scrollTo(0, 0);
  //   // }
  //
  // }, [the_id]);

  let {
    labels,
    load,
    title,
    description,
    photos,
    redirect,
    price,
    salePrice,
    _id,
    customer,
    type,
    updatedAt,
    weight,
    countryChoosed,
    firstCategory,
    secondCategory,
    thirdCategory,
    sections,
    categories,
    combinations,
    options,
    videos,
    faq,
    quantity,
    thumbnail,
    extra_button,
    in_stock,
    extra_attr,
    excerpt,
    season,
    like,
    views = null,
  } = state;
  if (redirect && isClient) return <Navigate to={redirect}/>;
  if (!load && isClient) return <Loading/>;

  return [
    <Container
      className="main-content-container single-course p-0 pb-4 kiuytyuioiu bg-white"
    >

      <Row className={'limited posrel'}>
        <Col lg="6" md="12">
          <Row>
            <Col lg="12" md="12">
              <Gallery photos={photos} thumbnail={thumbnail}/>
            </Col>
          </Row>
        </Col>
        <Col lg="6" md="12">
          <Row></Row>
          <Row className={''}>
            <div className={'bread-crumb'}>
              <div className={'allCatse mt-4'}>
                {firstCategory &&
                firstCategory.name &&
                firstCategory.name[lan] && [
                  <Link to={'/'} className={'gfdcvgfd'}>
                      <span className={'categories ml-1 mt-2'}>
                        {t('home')}
                      </span>
                  </Link>,
                  <Link to={'/'} className={'gfdcvgfd'}>
                    <span className="material-icons">chevron_left</span>
                  </Link>,
                  <Link
                    to={
                      '/category/' +
                      firstCategory._id +
                      '/' +
                      firstCategory.name[lan]
                    }
                    className={'gfdcvgfd'}
                    key={2}>
                      <span className={'categories ml-1 mt-2'}>
                        {firstCategory.name[lan]}
                      </span>
                  </Link>,
                ]}
                {secondCategory &&
                secondCategory.name &&
                secondCategory.name[lan] && [
                  <Link
                    to={
                      '/category/' +
                      secondCategory._id +
                      '/' +
                      secondCategory.name[lan]
                    }
                    className={'gfdcvgfd'}
                  >
                    <span className="material-icons">chevron_left</span>
                  </Link>,
                  <Link
                    to={
                      '/category/' +
                      secondCategory._id +
                      '/' +
                      secondCategory.name[lan]
                    }
                    className={'gfdcvgfd'}
                  >
                      <span className={'categories ml-1 mt-2'}>
                        {secondCategory.name[lan]}
                      </span>
                  </Link>,
                ]}
                {thirdCategory &&
                thirdCategory.name &&
                thirdCategory.name[lan] && [
                  <Link
                    to={
                      '/category/' +
                      thirdCategory._id +
                      '/' +
                      thirdCategory.name[lan]
                    }
                    className={'gfdcvgfd'}
                  >
                    <span className="material-icons">chevron_left</span>
                  </Link>,
                  <Link
                    to={
                      '/category/' +
                      thirdCategory._id +
                      '/' +
                      thirdCategory.name[lan]
                    }
                    className={'gfdcvgfd'}
                  >
                      <span className={'categories ml-1 mt-2'}>
                        {thirdCategory.name[lan]}
                      </span>
                  </Link>,
                ]}
              </div>
            </div>
          </Row>
          <Row>

            <Col lg="12" md="12" className={'single-product'}>
              <h1 className="kjhghjk hgfd ">{title && title[lan]}</h1>
              {labels && (
                <div className={'the-labeled'}>
                  {labels.map((lab, k) => {
                    return (
                      <div className={'the-label'} key={k}>
                        {lab.title}
                      </div>
                    );
                  })}
                </div>
              )}

              {excerpt && excerpt[lan] && (
                <div
                  className="d-inline-block item-icon-wrapper mt-3 ki765rfg hgfd"
                  dangerouslySetInnerHTML={{__html: excerpt[lan]}}
                />
              )}

              {extra_button && (
                <div className="AddToCardButton outOfStock">{extra_button}</div>
              )}
              {!extra_button && type == 'normal' && (
                <div>
                  {options && !options.length && (
                    <>
                      <Theprice
                        className={'single'}
                        price={price}
                        salePrice={salePrice}
                        in_stock={in_stock}
                      />
                    </>
                  )}
                  {!options && (
                    <>
                      <Theprice
                        className={'single'}
                        price={price}
                        salePrice={salePrice}
                        in_stock={in_stock}
                      />
                    </>
                  )}

                </div>
              )}


            </Col>
          </Row>
        </Col>
        <Col lg={12} md={12} sm={12} xs={12} className={'single-product-description'}>
          {description && description[lan] && (
            <div
              className="d-inline-block item-icon-wrapper mt-3 ki765rfg hgfd"
              dangerouslySetInnerHTML={{__html: description[lan]}}
            />
          )}
        </Col>
        <Col lg={12} md={12} sm={12} xs={12}>
          <VideoAccordion videos={videos}/>

        </Col>
        <Col lg={12} md={12} sm={12} xs={12}>
          <ExtraAttr attrs={extra_attr}/>

        </Col>

        <Col lg={12} md={12} sm={12} xs={12}>
          <FaqAccordion faqs={faq} t={t}/>

        </Col>


      </Row>
      {(season && season[0]) &&<div className={'course-button-wrapper'}>
        <Link className={'start-free-button'} to={'/course/study/'+_id}>{t("start free")}</Link>
      </div>}
    </Container>,
    <Container
      className="main-content-container pb-4 kiuytyuioiu bg-white"
    >

    </Container>,
  ];
};

export default withTranslation()(Course);
