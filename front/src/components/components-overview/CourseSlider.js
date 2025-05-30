import {Suspense, useEffect, useState} from 'react';
import {withTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import Swiper from '#c/components/swiper';
import {isClient, loadCourseItems,isStringified} from '#c/functions/index';
import CourseCard from '#c/components/Home/CourseCard';
import { useParams } from 'react-router-dom';

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

const CourseSlider = ({
                        arrows,
                        cat_id = null,
                        customQuery,

                        classes,
                        perPage,
                        autoplay,
                        pagination = undefined,
                        breakpoints = defaultBreakPoints,
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
  let params = useParams();

  useEffect(() => {
    if (isClient) {
      console.log('\nuseEffect loadCourseItems==================>');
      let query = {},
        filter = {};
      if (customQuery) {
        console.log('customQuery main', customQuery);

        if (typeof customQuery == 'string') {
          customQuery = JSON.parse(customQuery);
        }

        Object.keys(customQuery).forEach((item) => {
          let main = customQuery[item];
          if (params && params._id) {
            console.log('main:', main);
            main = main.replace('params._id', JSON.stringify(params._id));
          }
          console.log(
            'customQuery[item]',
            item,
            customQuery,
            customQuery[item]
          );
          console.log('main', main);
          const json = isStringified(main);

          if (typeof json == 'object') query[item] = json;
          else query[item] = main;
        });
      }
      // console.log("==> loadProductItems() offset:", offset, "filter:", filter, "query:", query);
      if (query) {
        filter = JSON.stringify(query);
      }
      loadCourseItems(cat_id, filter).then((res) => settracks(res));
    }
  }, []);
// return JSON.stringify(autoplay)
  return (
    <Suspense fallback={<div> loading... </div>}>
      <div className={"rtl " + classes}>
        {/*{JSON.stringify(defaultBreakPoints)}*/}
        {tracks && tracks.length > 0 && (
          <Swiper
            type={'slide'}
            arrows={arrows}
            breakpoints={defaultBreakPoints}
            perPage={perPage}
            kind={'course'}

            autoplay={autoplay}
            pagination={pagination}>
            {tracks.map((i, idx) => (
              <div className="swiper-slide" key={idx}>
                <CourseCard item={i}/>
              </div>
            ))}
          </Swiper>
        )}
      </div>
    </Suspense>
  );
};
export const PostSliderServer = loadCourseItems;

export default withTranslation()(CourseSlider);
