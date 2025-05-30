import React, {useState} from 'react';
import DescriptionIcon from '@mui/icons-material/Description';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import ReviewsIcon from "@mui/icons-material/Reviews";
import Comments from '#c/components/single-post/Comments';

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
import {Col, Nav, NavItem, NavLink,} from 'shards-react';

import {ProductsSliderServer} from '#c/components/components-overview/ProductsSlider';
import {PostSliderServer} from '#c/components/components-overview/PostSlider';
import {withTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';

const getURIParts = (url) => {
  var loc = new URL(url);
  return loc;
};
const ProductDetailsTabs = (props) => {
  console.log('ProductDetailsTabs...', props);
  // return 'ho'
  let lan='fa';
  let navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [theload, settheload] = useState(true);
  let {match, location, history, t, url} = props;
  let {element = {}, params = {}} = props;


  let {data = {}, settings = {}} = element;
  let {general = {}} = settings;
  // const [state, setState] = useState(params || {});

  let {fields = {}} = general;
  let {entity = 'productCategory', _id = '', tabs = 'description,attributes,comments'} = fields;
  let allTabs = tabs.split(',');

  const [tab, setTab] = useState(allTabs[0]);
  let mainParams = useParams();
  console.log("tabs", tabs)
  let the_id = mainParams._id || mainParams._product_slug || params._id;


  let {
    status,
    size,
    weight,
    labels,
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

  return (<div className="main-content-container fghjkjhgf ">

      <Col lg={12} md={12} sm={12} xs={12}>
        <Nav justified={true} tabs={true} className={"post-product-nav"}>
          {allTabs && allTabs.map((alt) => {
            if (alt == 'attributes') {
              return <NavItem>
                <NavLink active={tab === "attributes"} href="#attributes"
                         onClick={() => setTab("attributes")}><EditAttributesIcon className={"ml-2"}/><span
                  className={"d-xs-none"}>{t("attributes")}</span></NavLink>
              </NavItem>
            }
            if (alt == 'description') {

              return <NavItem>
                <NavLink active={tab === "description"} href="#description"
                         onClick={() => setTab("description")}><DescriptionIcon className={"ml-2"}/><span
                  className={"d-xs-none"}>{t("description")}</span></NavLink>
              </NavItem>
            }
            if (alt == 'comments') {
              return <NavItem>
                <NavLink active={tab === "comments"} href="#comments" onClick={() => setTab("comments")}><ReviewsIcon
                  className={"ml-2"}/><span className={"d-xs-none"}>{t("comments")}</span></NavLink>
              </NavItem>
            }
          })}


        </Nav>
      </Col>
      <Col lg={12} md={12} sm={12} xs={12}>
        {tab === 'description' && (
          <div className={'pt-5'} id={'description'}>
            {description && description[lan] && (
              <div
                className="d-inline-block item-icon-wrapper ki765rfg  hgfd mb-5"
                dangerouslySetInnerHTML={{__html: description[lan]}}
              />
            )}
          </div>
        )}

        {tab === 'attributes' && (
          <div className={'pt-5'} id={'attributes'}>
            {extra_attr && (
              <div
                className={'d-inline-block item-icon-wrapper ki765rfg hgfd'}>
                <table className="product-attributes">
                  <tbody>
                  {extra_attr.map((item, key) => {
                    return (
                      <tr className={'kjhgfdgh'} key={key}>
                        <th className={'gfdsa'}>{item.title}</th>
                        <td>
                          <div
                            key={key}
                            className="d-inline-block item-icon-wrapper ki765rfg hgfd"
                            dangerouslySetInnerHTML={{__html: item.des}}
                          />
                        </td>
                      </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'comments' && (
          <div className={'pt-5'} id={'comments'}>
            <Comments id={the_id}/>
          </div>
        )}
      </Col>

    </div>
  );
};

export default withTranslation()(ProductDetailsTabs);
