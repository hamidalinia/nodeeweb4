import React, {useEffect, useState} from 'react';
import {Col, Container, Row} from 'shards-react';
import {useParams} from 'react-router-dom';
import Gallery from '#c/components/single-post/Gallery';
import {withTranslation} from 'react-i18next';
import {dFormat, PriceFormat} from '#c/functions/utils';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  LinkedinShareButton,
  RedditShareButton,
  PinterestShareButton,
  EmailShareButton,
  TumblrShareButton,
  VKShareButton,
  LineShareButton,
  InstapaperShareButton,
  PocketShareButton,

  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
  LinkedinIcon,
  RedditIcon,
  PinterestIcon,
  EmailIcon,
  TumblrIcon,
  VKIcon,
  LineIcon,
  InstapaperIcon,
  PocketIcon,
} from 'react-share';
import {addBookmark, clearPost, getBlogPost, isClient, loadPost, loveIt, MainUrl, savePost,} from '#c/functions/index';
import {SnapChatIcon} from '#c/assets/index';
import Loading from '#c/components/Loading';
import PageBuilder from '#c/components/page-builder/PageBuilder';
import store from '../functions/store';
import {useSelector} from 'react-redux';
// import { Link, useNavigate, useParams } from "react-router-dom";
// let obj = ;
// let the_id='';
const ShareButtons = ({ url, title, image }: { url: string; title: string; image?: string }) => {
  return (
    <div className="d-flex flex flex-wrap gap-4 items-center">
      <FacebookShareButton url={url} quote={title}>
        <FacebookIcon size={30} round />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={30} round />
      </TwitterShareButton>

      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={30} round />
      </WhatsappShareButton>

      <TelegramShareButton url={url} title={title}>
        <TelegramIcon size={30} round />
      </TelegramShareButton>

      <LinkedinShareButton url={url} title={title}>
        <LinkedinIcon size={30} round />
      </LinkedinShareButton>

      <RedditShareButton url={url} title={title}>
        <RedditIcon size={30} round />
      </RedditShareButton>

      {/*<PinterestShareButton url={url} media={image || url}>*/}
        {/*<PinterestIcon size={40} round />*/}
      {/*</PinterestShareButton>*/}

      <EmailShareButton url={url} subject={title} body={url}>
        <EmailIcon size={30} round />
      </EmailShareButton>

      {/*<TumblrShareButton url={url} title={title}>*/}
        {/*<TumblrIcon size={40} round />*/}
      {/*</TumblrShareButton>*/}

      <VKShareButton url={url} title={title}>
        <VKIcon size={30} round />
      </VKShareButton>

      {/*<LineShareButton url={url} title={title}>*/}
        {/*<LineIcon size={40} round />*/}
      {/*</LineShareButton>*/}

      {/*<InstapaperShareButton url={url} title={title}>*/}
        {/*<InstapaperIcon size={40} round />*/}
      {/*</InstapaperShareButton>*/}

      {/*<PocketShareButton url={url} title={title}>*/}
        {/*<PocketIcon size={40} round />*/}
      {/*</PocketShareButton>*/}
    </div>
  );
};
const Post = (props) => {
  // console.log("props", props);
  let {match, location, history, t, url} = props;

  let product = useSelector((st) => {
    // console.log("st.store", st.store.productSliderData);
    return st.store.product || [];
  });
  // window.scrollTo(0, 0);
  let params = useParams();
  let the_id = params._id;
  // let search = false;
  // let history = useNavigate();

  const [mainId, setMainId] = useState(the_id);
  const [tab, setTab] = useState('description');
  const [state, setState] = useState(isClient ? [] : product || []);
  const [lan, setLan] = useState(store.getState().store.lan || 'fa');

  const getThePost = (_id) => {
    return new Promise(function (resolve, reject) {
      getBlogPost(_id).then((d = {}) => {
        console.log('set _id to show:', d);
        savePost({
          mainList: d.mainList,
          catChoosed: d.catChoosed,
          countryChoosed: d.countryChoosed,
          categories: d.categories,
          elements: d.elements,
          mainCategory: d.mainCategory,
        });
        resolve({
          load: true,
          title: d.title,
          description: d.description,
          photos: d.photos,
          _id: d._id,
          updatedAt: d.updatedAt,
          kind: d.kind,
          elements: d.elements,
          thumbnail: d.thumbnail,
          excerpt: d.excerpt,
          views: d.views,
        });
      });
    });
  };
  if (isClient)
    useEffect(() => {
      // let mounted = true;
      let {_id, title} = params;

      console.log('useEffect', _id, the_id, mainId);

      getThePost(the_id).then((items) => {
        // console.log('items',items,the_id);
        // if (mounted) {
        setState(items);
        if (isClient) window.scrollTo(0, 0);
        // }
      });
      // return () => mounted = false;
    }, [the_id]);

  // useEffect(() => {
  //   let { _id, title } = params;
  //   console.log("useEffect", _id, the_id, mainId);
  //   // if (mainId != _id) {
  //   getThePost(_id).then(res=>setState(state => ({ ...state, ...res })));
  //   window.scrollTo(0, 0);
  //   // }
  //
  // }, [the_id]);

  let {
    load,
    title,
    description,
    photos,
    redirect,
    _id,
    thumbnail,
    excerpt,

    enableAdmin = false,
    views = null,
    elements = null,
  } = state;
  if (redirect && isClient) return <Navigate to={redirect}/>;
  if (!load && isClient) return <Loading/>;

  return (
    <Container className="main-content-container p-0 pb-4 kiuytyuioiu bg-white">
      <Row className={'limited posrel'}>
        {/*<div className={"floating-tools"}>*/}
        {/*{isClient && <ButtonGroup vertical>*/}

        {/*{title && <RWebShare*/}
        {/*data={{*/}
        {/*text: excerpt,*/}
        {/*url: CONFIG.SHOP_URL + "p/" + _id + "/" + encodeURIComponent(title[lan]),*/}
        {/*title: title[lan]*/}
        {/*}}*/}
        {/*sites={["whatsapp", "telegram", "linkedin", "copy"]}*/}
        {/*closeText={t("close")}*/}
        {/*onClick={() => console.log("shared successfully!")}*/}
        {/*>*/}
        {/*<Button>*/}
        {/*<ShareIcon/>*/}
        {/*</Button>*/}
        {/*</RWebShare>}*/}
        {/*{views && <Button><RemoveRedEyeIcon/><Badge theme="info">{views}</Badge></Button>}*/}

        {/*{enableAdmin && <a href={VARIABLE.ADMIN_URL + "/#/product/" + _id} target={"_blank"}><i*/}
        {/*className="material-icons">edit</i></a>}*/}
        {/*</ButtonGroup>}*/}
        {/*</div>*/}


        <Col lg={4} md={4} sm={12} xs={12}>

        </Col>
        <Col lg={8} md={8} sm={12} xs={12}>
          <Row className={' posrel'}>

            <Col lg="3" md="4" xs="12">
              <Gallery photos={photos} thumbnail={thumbnail}/>
            </Col>
            <Col lg="9" md="8" xs="12">
              <Row>
                <Col lg="12" md="12" className={'single-product'}>
                  <ShareButtons
                    url={window.location.href}
                    title={title && title.fa}
                    image={MainUrl+thumbnail}
                  />
                  <h1 className="kjhghjk hgfd ">{title && title.fa}</h1>

                  {excerpt && (
                    <div
                      className="d-inline-block item-icon-wrapper mt-3 ki765rfg hgfd"
                      dangerouslySetInnerHTML={{
                        __html: excerpt.fa ? excerpt.fa : excerpt,
                      }}
                    />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className={' posrel'}>
            <Col lg={12} md={12} sm={12} xs={12}>

              {tab === 'description' && (
                <div className={'pt-5'} id={'description'}>
                  {description && (
                    <div
                      className="d-inline-block item-icon-wrapper ki765rfg  hgfd mb-5"
                      dangerouslySetInnerHTML={{
                        __html: description.fa ? description.fa : description,
                      }}
                    />
                  )}
                  {description && description.fa && description.fa.rendered && (
                    <div
                      className="d-inline-block item-icon-wrapper ki765rfg  hgfd mb-5"
                      dangerouslySetInnerHTML={{__html: description.fa.rendered}}
                    />
                  )}
                </div>
              )}
              <PageBuilder elements={elements}/>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export const PostServer = [
  {
    func: loadPost,
    params: '6217502008d0e437d6b4ad97',
  },
];
export default withTranslation()(Post);
