import React, {useEffect, useState} from 'react';

import {Button} from 'shards-react';
import {withTranslation} from 'react-i18next';
import CheckIcon from '@mui/icons-material/Check';
import {dFormat, PriceFormat} from '#c/functions/utils';
import {addItem, MainUrl, removeItem} from '#c/functions/index';
import {defaultImg} from '#c/assets/index';
import {store} from "#c/functions/store";
import {useSelector} from 'react-redux';
import { useNavigate } from "react-router-dom"
import {toast} from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';
import { toggleCardbar } from "#c/functions/index";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
function AddToCardButton({item, text = '',variable=false,children, t}) {
  console.log("itemmmmmm", item)
  let  oneItemPerOrder=item?.oneItemPerOrder ? item.oneItemPerOrder : false
  let  notBuyableAlone=item?.notBuyableAlone ? item.notBuyableAlone : false

  let [count, setcount] = useState(0);
  let [Navigate, SetNavigate] = useState(null);
  let card = useSelector((st) => st.store.card || []);
  let history = useNavigate();
  card.map((isx, xs) => {
    if (isx._id === item._id) {
      count = (isx.count);
    }
  });
  const refreshCard = ()=>{

  };
  if (Navigate) {
    return <Navigate to={Navigate}/>;
  }
  if ((item.single && !item.in_stock) || (item.single && !item.quantity)) {
    return <div className={'outOfStock '+item.type}>
      <CloseIcon/>{t("out of stock")}</div>
  }
  if(item.type==='normal'){
    if(item.quantity===0 || !item.in_stock)
      return <div className={'outOfStock '+item.type}><CloseIcon/>{t("out of stock")}</div>
  }

  let mojud=false;
  if(variable && !item.single){
    if(item.combinations) {
      item.combinations.map((com) => {
        if (com.in_stock) {
          mojud = true;
        }
      })
    }
    if(!mojud){
      return <div className={'outOfStock variablestock'}><CloseIcon/>{t("out of stock")}</div>
    }
  }
  if(true){
    console.log("right function")
  }

  return (
    <div className="AddToCardButton">

      {((count !== 0) && oneItemPerOrder) && <Button size="md" style={{justifyContent:'center',gap:'10px'}} className={'buy-button kjhgfgh'} theme="primary" onClick={()=>{toggleCardbar()}}>
        {/*<RemoveCircleOutlineIcon className={"left"} onClick={(e) => {*/}
          {/*removeItem(item);*/}
        {/*}} />*/}
        {/*{count}*/}
        {/*<AddCircleOutlineIcon className={""} onClick={(e) => {*/}
          {/*addItem(item).then((x)=>{*/}
            {/*toggleCardbar();*/}
            {/*toast(t('Added to cart successfully!'), {*/}
              {/*type: 'success'*/}
            {/*})*/}
          {/*});*/}
        {/*}} />*/}
        <span>{t('open cart')}</span><CheckIcon/>
      </Button>}
      {((count !== 0) && !oneItemPerOrder) && <Button size="md" className={'buy-button kjhgfgh'} theme="primary">
        <RemoveCircleOutlineIcon className={"left"} onClick={(e) => {
          removeItem(item);
        }} />
        {count}
        <AddCircleOutlineIcon className={""} onClick={(e) => {
          addItem(item).then((x)=>{
            toggleCardbar();
            toast(t('Added to cart successfully!'), {
              type: 'success'
            })
          });
        }} />
      </Button>}
      {count === 0 &&
      <Button size="md" className={'buy-button kjhgfgh empty-card '} theme="primary"
              onClick={(e) => {
                if (text && text === t('options') && !item.single) {
                  let title=encodeURIComponent(item.title.fa.replace(/\\|\//g,''));
                  history('/product/' + item.slug)
                }
                else {
                  addItem(item).then((x) => {
                    toggleCardbar();
                    toast(t('Added to cart successfully!'), {
                      type: 'success'
                    })
                  });
                }
              }}>
        <span></span>
        <span>
        {!item.single && <span>{text}<ShoppingBagIcon className="center"/></span>}
        {/*{!item.single && }*/}
        {!variable && <span>{t("add to cart")}</span>}
        </span>
        <span></span>

      </Button>}
      {children}
    </div>
  );
}

export default withTranslation()(AddToCardButton);
