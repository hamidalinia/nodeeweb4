import React from 'react';

import {Splide, SplideSlide} from '@splidejs/react-splide';
import {isStringified} from '#c/functions/index';

export default (props) => {
  // return JSON.stringify(props.autoplay)
  let theBreakpoints = {};
  if (props.breakpoints) {
    const json = isStringified(props.breakpoints);
    if (typeof json == 'object') theBreakpoints = json;
    else theBreakpoints = props.breakpoints;
  }
  let rewind = true;
  let {
    children,
    className,

    theme = 'normal',
    type = props?.type || 'loop',
    kind = 'slider',
    perPage = props.perPage || 4,
    pagination = props.pagination || false,
    arrows = props.arrows || false,
    autoplay = props.autoplay,
    lazyLoad = true,
    interval = props.interval || 2000,
    pauseOnHover = true,
    pauseOnFocus = true,
    gap = '1rem',
    breakpoints = theBreakpoints || {
      1024: {
        perPage: 4,
      },
      768: {
        perPage: 3,
      },
      640: {
        perPage: 2,
      },
      320: {
        perPage: 1,
      },
    },
  } = props;
  // if (theme == 'cover') {
  //   type = 'fade';
  //   rewind = false
  // }
  if (autoplay == 'false') {
    autoplay = false;
  }
  // console.log(breakpoints)
  // return JSON.stringify(autoplay)
  let y = isStringified(breakpoints);
  if (typeof y == 'object') breakpoints = y;
  // else
  //   theBreakpoints = y
  function isEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }

    return true;
  }

  // {JSON.stringify({breakpoints:breakpoints,perPage:perPage})}
  if (kind != 'slider')
    if (breakpoints == "{}" || breakpoints == 'undefined' || breakpoints == null || breakpoints == {} || isEmpty(breakpoints))
      breakpoints = {
        1024: {
          perPage: 4,
        },
        768: {
          perPage: 3,
        },
        640: {
          perPage: 2,
        },
        320: {
          perPage: 2,
        },
      }
  // return JSON.stringify(autoplay);
  let options = {
    gap: gap,
    perPage: perPage,
    type: type,
    perMove: 1,
    rewind: rewind,
    pagination: pagination,
    direction: 'rtl',
    arrows: arrows,
    autoplay: autoplay,
    lazyLoad: lazyLoad,
    breakpoints: breakpoints,
    interval: interval,
  };
  if (theme == 'cover') {
    options['perPage']=1;
    options['rewind']=false;
    options['type']='fade';
    options['breakpoints'] = {
      1024: {
        perPage: 1,
      },
      768: {
        perPage: 1,
      },
      640: {
        perPage: 1,
      },
      320: {
        perPage: 1,
      },
    }
  }
  // return JSON.stringify(options);

  return (
    <>
      <Splide
        options={options}
        className={className}>
        {children &&
        children.length > 0 &&
        children.map((item, key) => {
          return <SplideSlide key={key}>{item}</SplideSlide>;
        })}
      </Splide>
    </>
  );
};
