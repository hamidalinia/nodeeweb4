import { Suspense, useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Swiper from '#c/components/swiper';
import { isClient, loadPostItems } from '#c/functions/index';
import BlogCard from '#c/components/Home/BlogCard';

const defaultBreakPoints = {
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
};

const PostSlider = ({
  arrows,
  cat_id = null,
  perPage,
  autoplay,
  pagination = undefined,
  breakpoints = defaultBreakPoints,
                      theme='normal',
  t,
}) => {
  // console.log("\nPostSlider==================>");
  let postSliderData = useSelector((st) => {
    // if (st.store.postSliderData)
    // console.log("st.store", st.store.postSliderData);
    return st.store.postSliderData;
  });

  const [tracks, settracks] = useState(isClient ? [] : postSliderData[cat_id]);
  // console.log("post tracks", postSliderData[cat_id]);

  useEffect(() => {
    if (isClient) {
      console.log('\nuseEffect loadPostItems==================>');
      loadPostItems().then((res) => settracks(res));
    }
  }, []);

  return (
    <Suspense fallback={<div> loading... </div>}>
      <div className={"rtl swipper-slider-theme-"+theme}>

        {/*{JSON.stringify(defaultBreakPoints)}*/}
        {tracks && tracks.length > 0 && (
          <Swiper
            arrows={arrows}
            breakpoints={defaultBreakPoints}
            perPage={perPage}
            kind={'post'}
            theme={theme}

            autoplay={autoplay}
            pagination={pagination}>
            {tracks.map((i, idx) => (
              <div className="swiper-slide" key={idx}>
                <BlogCard item={i} theme={theme} />
              </div>
            ))}
          </Swiper>
        )}
      </div>
    </Suspense>
  );
};
export const PostSliderServer = loadPostItems;

export default withTranslation()(PostSlider);
