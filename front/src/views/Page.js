import { useEffect, useState } from 'react';
import { Container } from 'shards-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import MainContent from '@/components/MainContent';
import { getPage, isClient, loadPost } from '@/functions';
import Loading from '@/components/Loading';
import store from '@/functions/store';
import NotFound from '@/views/_404';

const redirectToCharge = (next = '') => {
  if (window.location.pathname !== '/charge')
    window.location.replace('/charge/?fromPage=/' + next);
};

export default function Page(props) {
  let page = useSelector((st) => {
    return st.store.page || [];
  });
  let { firstName, lastName } = store.getState().store.user;
  const navigate = useNavigate();

  const params = useParams();
  const the_id = params._id;
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(isClient ? [] : page || []);

  const getThePost = (_id) => {
    return new Promise(function (resolve, reject) {
      getPage(_id).then((d = {}) => {
        if (d.success === false && d.access && d.access === 'private') {
          // console.log('this is access if d.success', d);
          // console.log('this is expire yes', d.expire);
          // console.log('this is info =>>>>>', lastName);

          // if(!firstName || !lastName || !internationalCode){
          if (!firstName || !lastName) {
            console.log('یوزر وجود نداد');
            let redirect_url1 = '/login?fromPage=/' + d.slug;
            // console.log('redirect to login');
            if (window.location.pathname !== '/login') {
              navigate(redirect_url1,{replace:true});
            }
            // window.location.replace(redirect_url1);
            return;
          }
          if (firstName || lastName) {
            console.log('یوزر وجود دارد');
          }

          if (!d.expire) {
            return;
          }
          if (d.expire) {
            redirectToCharge(d.slug);
            return;
          }
        }

        if (d._id) {
          if (d.expire) {
            reject({});
          }
          resolve({
            load: true,
            title: d.title,
            access: d.access,
            backgroundColor: d.backgroundColor,
            padding: d.padding,
            margin: d.margin,
            description: d.description,
            photos: d.photos,
            maxWidth: d.maxWidth,
            _id: d._id,
            updatedAt: d.updatedAt,
            kind: d.kind,
            classes: d.classes,
            elements: d.elements,
            diffInDays: d.diffInDays,
            thumbnail: d.thumbnail,
            excerpt: d.excerpt,
            views: d.views,
          });
        } else {
          reject({
            notfound: true,
          });
        }
      });
    });
  };
  let {
    redirect,
    kind,
    classes,
    maxWidth,
    backgroundColor,
    notfound,
    diffInDays,
    elements = null,
  } = state;
  useEffect(() => {
    if (!isClient) return;
    getThePost(the_id)
      .then((items) => {
        console.log("items",items)
        setState(items);
        if (isClient) window.scrollTo(0, 0);
      })
      .catch((e) => {
        setState(e);
      })
      .finally(() => setLoading(false));
  }, [the_id]);

  useEffect(() => {
    if(classes=="parallex-effect-bg-piano-1"){
      const handleScroll = () => {
        setScrollY(window.scrollY);
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // useEffect(() => {
  //   let { _id, title } = params;
  //   console.log("useEffect", _id, the_id, mainId);
  //   // if (mainId != _id) {
  //   getThePost(_id).then(res=>setState(state => ({ ...state, ...res })));
  //   window.scrollTo(0, 0);
  //   // }
  //
  // }, [the_id]);


  if (redirect && isClient) {
    navigate(redirect,{replace:true});
    return null;
  }
  if (loading && isClient) return <Loading />;
  if (!loading && notfound && isClient) return <NotFound />;
// return JSON.stringify(state)
  return (
    <Container
      className={clsx(
        'main-content-container p-0 kiuytyuioiu bg-white',
        classes
      )}>
      {/*<div style={style} className={'the-body ghui'} >*/}

      {/*{diffInDays < 14 && (*/}
        {/*<div*/}
          {/*style={{*/}
            {/*margin: 'auto',*/}
            {/*color: '#ffffff',*/}
            {/*textAlign: 'center',*/}
            {/*fontSize: '12px',*/}
            {/*backgroundColor: '#ba4456',*/}
            {/*padding: '10px 2px',*/}
            {/*borderRadius: '5px',*/}
            {/*marginLeft: '15px',*/}
            {/*marginRight: '15px',*/}
          {/*}}>*/}
          {/*{diffInDays > 0 ? (*/}
            {/*<span>{diffInDays} روز از اشتراک شما باقی مانده است</span>*/}
          {/*) : (*/}
            {/*<span>اعتبار شما پایان یافته است.</span>*/}
          {/*)}*/}
          {/*<span style={{ margin: '0 10px' }}>*/}
            {/*<button*/}
              {/*onClick={redirectToCharge}*/}
              {/*style={{*/}
                {/*border: 'none',*/}
                {/*color: '#44a6ba',*/}
                {/*backgroundColor: '#fffff',*/}
                {/*borderRadius: '7px',*/}
              {/*}}>*/}
              {/*خرید اشتراک*/}
            {/*</button>*/}
          {/*</span>*/}
        {/*</div>*/}
      {/*)}*/}

      {/* {(diffInDays && diffInDays>0) && <div style={{margin:"auto", color:"#ffffff",textAlign:"center",fontSize:"1.35rem",backgroundColor:"#44a6ba",padding:"2px", borderRadius:"5px" }}>
{diffInDays}
<span>        روز از مهلت تمدید اشتراک شما گذشته است
</span>
<span style={{margin:"0 10px"}}><button onClick={redirectToCharge} style={{border:"none", color:"#44a6ba", backgroundColor:"#fffff" , borderRadius:"7px"}} >خرید اشتراک</button></span>
      </div> } */}

      <MainContent
        diffInDays={diffInDays}
        elements={elements}
        kind={kind}
        maxWidth={maxWidth}
        backgroundColor={backgroundColor}
      />
      {/*<div style={{ height: '100px' }} />*/}
      {/*</div>*/}
    </Container>
  );
}
export const PageServer = [
  {
    func: loadPost,
    params: '6217502008d0e437d6b4ad97',
  },
];
