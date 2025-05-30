import React, {useCallback} from 'react';
import {Button} from 'shards-react';
import _isEqual from 'lodash/isEqual';

import clsx from 'clsx';
import {useLocation, useNavigate} from 'react-router-dom';
import * as Icons from "@mui/icons-material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import {MainUrl, setStyles, toggleContact, toggleSidebar} from '#c/functions';
import LazyMuiIcon from '@/components/common/LazyMuiIcon';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import Link from './Link';
import {useSelector} from "react-redux";

export default function TheButton(p) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((st) => st.store.user, _isEqual);

  // return JSON.stringify(user);
  const isHomePage = location.pathname === '/';

  const {element, conditionStep, handleStep} = p;
  let {classes, settings, handleCard, card} = element;
  let {general} = settings;
  let {fields} = general;
  let {
    text,
    iconFont,
    action,
    iconImage,
    classess,
    showInMobile,
    showInDesktop,
    target,
    doNotShowWhenLogin
  } = fields;

  const handleBack = useCallback(() => {
    const {history, location} = window;

    if (history.length <= 2 && location.pathname !== '/') navigate('/');
    else if (location.pathname === '/profile') navigate('/');
    else if (history.length > 2) navigate(-1);
  }, [navigate]);

  let Icon = iconFont ? <span>{<LazyMuiIcon name={iconFont}/>}</span> : null;

  const Text = text ? <span>{text}</span> : null;

  if (iconImage)
    Icon = (
      <div className={'mb-2'}>
        <img src={MainUrl + '/' + iconImage} alt={text} loading="lazy"/>
      </div>
    );

  let style = setStyles(fields);
  if (conditionStep) {
    return (
      <Button
        onClick={() => handleStep(action)}
        className={clsx(
          'posrel',
          classess,
          (fields?.classes),
          showInMobile && 'showInMobile',
          action
        )}
        style={style}>
        {Icon}
        {Text}
      </Button>
    );
  }

  if (action) {
    if (action === 'toggleCart')
      return (
        <Button
          onClick={() => handleCard()}
          className={clsx('posrel', classes, showInMobile && 'showInMobile',(fields?.classes))}
          style={style}>
          {Icon}
          <span className={'badge'}>{card && card.length}</span>
          {Text}
        </Button>
      );
    else if (action == 'toggleContact') {
      return <Button onClick={() => {
        // console.clear()
        toggleContact();
      }} className={clsx(' posrel ' , classess , (showInMobile ? ' showInMobile ' : ''),(fields?.classes))} style={style}>{Icons[iconFont] &&
      <span>{React.createElement(Icons[iconFont])}</span>}<span>{text}</span><span
        className={'arrow-toggle-contact'}><ArrowDropUpIcon/></span></Button>

    }
    else if (action === 'toggleMenu')
      return (
        <Button
          onClick={() => toggleSidebar()}
          className={clsx('posrel', classes, showInMobile && 'showInMobile',(fields?.classes))}
          style={style}>
          {Icon}
          {Text}
        </Button>
      );
    else if (action === 'userScore')
      if (user?.token)
        return (
          <Link
            url={'/profile'}
            target={target}
            className={clsx('btn', 'btn-primary', 'posrel', 'user-hear-whiteb', 'user-score-whiteb ', classes,fields?.classes, classess, showInMobile && 'showInMobile')}
            style={style}>
            {Icon}
            {!Icon && <ElectricBoltIcon className={'uhw-i'}/>}
            <span className={'user-hear-whiteb-span'}>2</span>

          </Link>
        );
      else
        return null
    else if (action === 'userHeart')
      return (
        <Button
          onClick={() => toggleSidebar()}
          className={clsx('posrel', 'user-hear-whiteb', classes, showInMobile && 'showInMobile',(fields?.classes))}
          style={style}>
          {Icon}
          {!Icon && <div className={'uhw-i'}><FavoriteIcon/></div>}
          <span className={'user-hear-whiteb-span'}>2</span>

        </Button>
      );
    else if (action === 'back')
      return isHomePage ? null : (
        <Button
          onClick={handleBack}
          className={clsx('posrel', classes, showInMobile && 'showInMobile',(fields?.classes))}
          style={style}>
          {Icon}
          {Text}
        </Button>
      );
    else if (action === '/login') {
      if (user?.token && doNotShowWhenLogin)
        return null
      return <Link
        url={action}
        target={target}
        classes={clsx('btn', 'btn-primary', classes, showInMobile && 'showInMobile', classess,(fields?.classes))}
        style={style}>

        {Icon}
        {Text}
      </Link>
    } else
      return (
        <Link
          url={action}
          target={target}
          classes={clsx('btn', 'btn-primary', classess,classes,(fields?.classes))}
          showInMobile={showInMobile}
          style={style}
        >
          {/*<Button >*/}
            {Icon}
            {Text}
          {/*</Button>*/}
        </Link>
      );
  } else if (Icon) {
    return (
      <Button
        className={clsx((fields?.classes),classess, showInMobile && 'showInMobile')}
        style={style}>
        {Icon}
        {Text}
      </Button>
    );
  }

  return (
    <Button
      className={clsx(classess, showInMobile && 'showInMobile')}
      style={style}>
      {text}
    </Button>
  );
}
