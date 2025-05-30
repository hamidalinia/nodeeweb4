import React from "react";
import {withTranslation} from "react-i18next";
import _truncate from "lodash/truncate";
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import {dFormat, PriceFormat} from "#c/functions/utils";
import {addItem, MainUrl, removeItem} from "#c/functions/index";
import {defaultImg} from "#c/assets/index";
// import store from "#c/functions/store";
import _isEqual from "lodash/isEqual";
import {useSelector} from "react-redux";
import store from "@/functions/store";

function CourseCard({onClick, item, method, t}) {
  // return 'hi'
  // let card = store.getState().store.card || [];
  console.log('item in product card:', item)
  let date = dFormat(item.updatedAt, t);
  let {token} = store.getState().store.user;
  const themeData = useSelector((st) => st.store.themeData, _isEqual);

  let {showPricesToPublic = true} = themeData

  let price = null;
  let salePrice = null;
  if (item.price) price = PriceFormat(item.price);
  if (item.salePrice) salePrice = PriceFormat(item.salePrice);

  if (!showPricesToPublic && !token) {
    console.log('!showPricesToPublic && !token:', (!showPricesToPublic && !token))
    price = null;
    salePrice = null;
    item.price = null
    item.salePrice = null
  }
  let backgroundImage = defaultImg;
  if (item.photos && item.photos[0])
    backgroundImage = MainUrl + "/" + item.photos[0];
  if (item.thumbnail)
    backgroundImage = MainUrl + "/" + item.thumbnail;
  // let title = encodeURIComponent(item.title.fa.replace(/\\|\//g, ""));
  let slug = item.slug;
  let cat_inLink = slug;
  if (item.firstCategory) {
    cat_inLink = item.firstCategory.slug;
    if (item.secondCategory && item.secondCategory.slug)
      cat_inLink = item.secondCategory.slug;
    if (item.thirdCategory && item.thirdCategory.slug)
      cat_inLink = item.thirdCategory.slug;
  }
  cat_inLink = 'course/' + slug;
  // console.log('item.labels', item.labels);
  return (
    <div
      className="mb-4 ad-card-col nbghjk the-course-card"
    >
      <div
        className="ad-card-main-div"
      >

        <div
          className="card-post__image"
          onClick={onClick}
        ><Link to={"/" + cat_inLink }><img alt={item.title ? item.title["fa"] : ''} loading={"lazy"} src={
          backgroundImage || defaultImg
        }/></Link></div>
        <div className={"post-content-style"}>
          <div className="ad-card-content">
            <div className={'course-level-wrapper'}>
              {(item.labels && item.labels.length > 0) && <>{item.labels.map((lab, k) => {
                return <div className={"course-level "+((lab && lab.title!='مقدماتی') ? 'orange' : 'yellow')} key={k}>{lab && lab.title}</div>;
              })}</>}
            </div>
            <h3 className="a-card-title">
              <Link to={"/" + cat_inLink}>{_truncate(item.title["fa"], {length: 120})}</Link>
            </h3>
            <div className="course-card-text">
              {((item?.excerpt && item?.excerpt["fa"]) ? _truncate(item.excerpt["fa"]?.replace(/(<([^>]+)>)/ig, ''), {length: 115}) : ((item?.description && item?.description["fa"]) ? _truncate(item.description["fa"]?.replace(/(<([^>]+)>)/ig, ''), {length: 115}) : ''))}
              {/*{(!item?.excerpt["fa"] ? _truncate(item.excerpt["fa"], {length: 120}) : _truncate(item.description["fa"], {length: 120}))}*/}
            </div>
            <div className="chip-parent-wrapper">


                {(item?.include && item?.include.indexOf("textbook")>-1) &&  <span className="chip chip__small chip__flat chip__gray-200 me-">
              <span
                className="chip__wrapper"><span className="icon inline-flex items-center justify-center text-label me-1"
              ><svg width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd"
      d="M5.25 14.5001C5.25 14.0858 5.58579 13.7501 6 13.7501H14C14.4142 13.7501 14.75 14.0858 14.75 14.5001C14.75 14.9143 14.4142 15.2501 14 15.2501H6C5.58579 15.2501 5.25 14.9143 5.25 14.5001Z"
      fill="#1C274C"></path>
<path fill-rule="evenodd" clip-rule="evenodd"
      d="M5.25 18C5.25 17.5858 5.58579 17.25 6 17.25H11.5C11.9142 17.25 12.25 17.5858 12.25 18C12.25 18.4143 11.9142 18.75 11.5 18.75H6C5.58579 18.75 5.25 18.4143 5.25 18Z"
      fill="#1C274C"></path>
<path fill-rule="evenodd" clip-rule="evenodd"
      d="M12.25 2.83422C11.7896 2.75598 11.162 2.75005 10.0298 2.75005C8.11311 2.75005 6.75075 2.75163 5.71785 2.88987C4.70596 3.0253 4.12453 3.27933 3.7019 3.70195C3.27869 4.12516 3.02502 4.70481 2.88976 5.7109C2.75159 6.73856 2.75 8.09323 2.75 10.0001V14.0001C2.75 15.9069 2.75159 17.2615 2.88976 18.2892C3.02502 19.2953 3.27869 19.8749 3.7019 20.2981C4.12511 20.7214 4.70476 20.975 5.71085 21.1103C6.73851 21.2485 8.09318 21.2501 10 21.2501H14C15.9068 21.2501 17.2615 21.2485 18.2892 21.1103C19.2952 20.975 19.8749 20.7214 20.2981 20.2981C20.7213 19.8749 20.975 19.2953 21.1102 18.2892C21.2484 17.2615 21.25 15.9069 21.25 14.0001V13.5629C21.25 12.0269 21.2392 11.2988 21.0762 10.7501H17.9463C16.8135 10.7501 15.8877 10.7501 15.1569 10.6518C14.3929 10.5491 13.7306 10.3268 13.2019 9.79815C12.6732 9.26945 12.4509 8.60712 12.3482 7.84317C12.25 7.1123 12.25 6.18657 12.25 5.05374V2.83422ZM13.75 3.6095V5.00005C13.75 6.19976 13.7516 7.0241 13.8348 7.64329C13.9152 8.24091 14.059 8.53395 14.2626 8.73749C14.4661 8.94103 14.7591 9.08486 15.3568 9.16521C15.976 9.24846 16.8003 9.25005 18 9.25005H20.0195C19.723 8.9625 19.3432 8.61797 18.85 8.17407L14.8912 4.61117C14.4058 4.17433 14.0446 3.85187 13.75 3.6095ZM10.1755 1.25002C11.5601 1.24965 12.4546 1.24942 13.2779 1.56535C14.1012 1.88129 14.7632 2.47735 15.7873 3.39955C15.8226 3.43139 15.8584 3.46361 15.8947 3.49623L19.8534 7.05912C19.8956 7.09705 19.9372 7.1345 19.9783 7.17149C21.162 8.23614 21.9274 8.92458 22.3391 9.84902C22.7508 10.7734 22.7505 11.8029 22.75 13.3949C22.75 13.4502 22.75 13.5062 22.75 13.5629V14.0565C22.75 15.8942 22.75 17.3499 22.5969 18.4891C22.4392 19.6615 22.1071 20.6104 21.3588 21.3588C20.6104 22.1072 19.6614 22.4393 18.489 22.5969C17.3498 22.7501 15.8942 22.7501 14.0564 22.7501H9.94359C8.10583 22.7501 6.65019 22.7501 5.51098 22.5969C4.33856 22.4393 3.38961 22.1072 2.64124 21.3588C1.89288 20.6104 1.56076 19.6615 1.40314 18.4891C1.24997 17.3499 1.24998 15.8942 1.25 14.0565V9.94363C1.24998 8.10587 1.24997 6.65024 1.40314 5.51103C1.56076 4.33861 1.89288 3.38966 2.64124 2.64129C3.39019 1.89235 4.34232 1.56059 5.51887 1.40313C6.66283 1.25002 8.1257 1.25003 9.97352 1.25005L10.0298 1.25005C10.0789 1.25005 10.1275 1.25004 10.1755 1.25002Z"
      fill="#1C274C"></path>
</svg></span><span className="text-gray-500">درسنامه</span>
              </span>
              </span>}
              {(item?.include && item?.include.indexOf("practice")>-1) && <span
                className="chip chip__small chip__flat chip__gray-200 me-"><span className="chip__wrapper"><span
                className="icon inline-flex items-center justify-center text-label me-1"
              ><svg width="24" height="24" viewBox="0 0 24 24"
                    fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd"
      d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 7.75C11.3787 7.75 10.875 8.25368 10.875 8.875C10.875 9.28921 10.5392 9.625 10.125 9.625C9.71079 9.625 9.375 9.28921 9.375 8.875C9.375 7.42525 10.5503 6.25 12 6.25C13.4497 6.25 14.625 7.42525 14.625 8.875C14.625 9.83834 14.1056 10.6796 13.3353 11.1354C13.1385 11.2518 12.9761 11.3789 12.8703 11.5036C12.7675 11.6246 12.75 11.7036 12.75 11.75V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V11.75C11.25 11.2441 11.4715 10.8336 11.7266 10.533C11.9786 10.236 12.2929 10.0092 12.5715 9.84439C12.9044 9.64739 13.125 9.28655 13.125 8.875C13.125 8.25368 12.6213 7.75 12 7.75ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
      fill="#1C274C"></path>
</svg>
</span><span className="text-gray-500">تمرین</span></span></span>}
              {(item?.include && item?.include.indexOf("game")>-1) && <span
                className="chip chip__small chip__flat chip__gray-200 me-">
              <span className="chip__wrapper"><span
                className="icon inline-flex items-center justify-center text-label me-1"
              >
              <svg width="24" height="24" viewBox="0 0 24 24"
                   fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd"
      d="M5.65845 3.45374C6.1639 3.27447 6.67734 3.25 7.10257 3.25H7.71504C8.74784 3.25 9.7552 3.5704 10.5982 4.16702L11.1001 4.52223C11.3633 4.70844 11.6777 4.80844 12 4.80844C12.3224 4.80844 12.6368 4.70844 12.8999 4.52222L13.4018 4.16703C14.2448 3.5704 15.2522 3.25 16.2849 3.25H16.8974C17.3227 3.25 17.8361 3.27447 18.3415 3.45373C19.7848 3.96561 20.9262 5.14191 21.6779 7.04514C22.4219 8.92876 22.8039 11.5642 22.7439 15.1153C22.7312 15.8648 22.6377 16.7048 22.3495 17.4614C22.0576 18.2279 21.5475 18.9504 20.6893 19.3608C20.2011 19.5943 19.6257 19.75 18.9733 19.75C18.1864 19.75 17.5391 19.5233 17.0312 19.1905C16.5588 18.8808 16.1457 18.4805 15.7928 18.1385C15.7498 18.0968 15.7077 18.0561 15.6665 18.0164C15.2616 17.6267 14.9212 17.3226 14.5435 17.1267C14.0662 16.8792 13.5365 16.75 12.9989 16.75H11.0012C10.4635 16.75 9.93378 16.8792 9.45652 17.1267C9.07878 17.3226 8.73837 17.6267 8.33351 18.0164C8.29232 18.0561 8.25024 18.0968 8.20726 18.1385C7.85433 18.4805 7.44123 18.8808 6.96877 19.1905C6.46087 19.5233 5.81363 19.75 5.02671 19.75C4.37431 19.75 3.79887 19.5943 3.31066 19.3608C2.45248 18.9504 1.94246 18.2279 1.65049 17.4614C1.36232 16.7048 1.26883 15.8648 1.25615 15.1153C1.19607 11.5643 1.57809 8.92876 2.32207 7.04515C3.0738 5.14192 4.2152 3.96561 5.65845 3.45374ZM7.10257 4.75C6.71943 4.75 6.41628 4.77651 6.15985 4.86745C5.2204 5.20065 4.35098 5.99156 3.71719 7.59618C3.07565 9.22042 2.69746 11.6334 2.75593 15.0899C2.76714 15.7524 2.85078 16.3985 3.05225 16.9275C3.24992 17.4465 3.54206 17.8088 3.95781 18.0076C4.26356 18.1538 4.61904 18.25 5.02671 18.25C5.51183 18.25 5.87475 18.114 6.14651 17.9359C6.49227 17.7093 6.79957 17.4125 7.16871 17.0559C7.20944 17.0165 7.25091 16.9765 7.29328 16.9357C7.69425 16.5497 8.1737 16.1022 8.76598 15.7951C9.45661 15.4369 10.2232 15.25 11.0012 15.25H12.9989C13.7768 15.25 14.5434 15.4369 15.234 15.7951C15.8263 16.1022 16.3058 16.5497 16.7067 16.9357C16.7491 16.9765 16.7906 17.0165 16.8313 17.0559C17.2004 17.4125 17.5077 17.7093 17.8535 17.9359C18.1253 18.114 18.4882 18.25 18.9733 18.25C19.381 18.25 19.7364 18.1538 20.0422 18.0076C20.458 17.8088 20.7501 17.4465 20.9478 16.9275C21.1492 16.3985 21.2329 15.7524 21.2441 15.0899C21.3025 11.6334 20.9244 9.22041 20.2828 7.59618C19.649 5.99155 18.7796 5.20064 17.8401 4.86745C17.5837 4.77651 17.2806 4.75 16.8974 4.75H16.2849C15.5626 4.75 14.858 4.9741 14.2683 5.39141L13.7664 5.74661C13.25 6.11214 12.6328 6.30844 12 6.30844C11.3673 6.30844 10.7501 6.11215 10.2336 5.74662L9.73171 5.39142C9.14205 4.97411 8.43744 4.75 7.71504 4.75H7.10257ZM7.5 8.25C7.91422 8.25 8.25 8.58579 8.25 9V9.75H9C9.41422 9.75 9.75 10.0858 9.75 10.5C9.75 10.9142 9.41422 11.25 9 11.25H8.25V12C8.25 12.4142 7.91422 12.75 7.5 12.75C7.08579 12.75 6.75 12.4142 6.75 12V11.25H6C5.58579 11.25 5.25 10.9142 5.25 10.5C5.25 10.0858 5.58579 9.75 6 9.75H6.75V9C6.75 8.58579 7.08579 8.25 7.5 8.25Z"
      fill="#1C274C"></path>
<path
  d="M19 10.25C19 10.6642 18.6642 11 18.25 11C17.8358 11 17.5 10.6642 17.5 10.25C17.5 9.83579 17.8358 9.5 18.25 9.5C18.6642 9.5 19 9.83579 19 10.25Z"
  fill="#1C274C"></path>
<path
  d="M16 10.25C16 10.6642 15.6642 11 15.25 11C14.8358 11 14.5 10.6642 14.5 10.25C14.5 9.83579 14.8358 9.5 15.25 9.5C15.6642 9.5 16 9.83579 16 10.25Z"
  fill="#1C274C"></path>
<path
  d="M16.75 8C17.1642 8 17.5 8.33579 17.5 8.75C17.5 9.16421 17.1642 9.5 16.75 9.5C16.3358 9.5 16 9.16421 16 8.75C16 8.33579 16.3358 8 16.75 8Z"
  fill="#1C274C"></path>
<path
  d="M16.75 11C17.1642 11 17.5 11.3358 17.5 11.75C17.5 12.1642 17.1642 12.5 16.75 12.5C16.3358 12.5 16 12.1642 16 11.75C16 11.3358 16.3358 11 16.75 11Z"
  fill="#1C274C"></path>
</svg></span><span className="text-gray-500">بازی</span></span></span>}
              {(item?.include && item?.include.indexOf("video")>-1) && <span
                className="chip chip__small chip__flat chip__gray-200 me-">
              <span className="chip__wrapper"><span
                className="icon inline-flex items-center justify-center text-label me-1"
              >
<OndemandVideoIcon/>
              </span><span className="text-gray-500">فیلم</span></span></span>}
</div>


            {/*<div className={'course-card-views'}><b>119,179</b><span className="text-gray"> نفر شرکت کرده اند. </span>*/}
            {/*</div>*/}
            <Link to={"/" + cat_inLink} className={'btn btn-primary course-card-button'}><span>شروع کنید</span><ArrowBackIosNewIcon/></Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default withTranslation()(CourseCard);
