import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { getPage, isClient, savePost, setStyles } from '@/functions/index';
import Loading from '@/components/Loading';
import PageBuilder from '@/components/page-builder/PageBuilder';
import NotFound from '@/views/_404';

const MainContent = (props) => {
  let page = useSelector((st) => {
    return st.store.page || [];
  });

  let params = useParams();
  let the_id = params._id;

  const [loading, setLoading] = useState(false);

  const [state, setState] = useState(isClient ? [] : page || []);

  const getThePost = (_id = 'home') => {
    return new Promise(function (resolve, reject) {
      getPage(_id).then((d = {}) => {
        if (d._id) {
          savePost({
            mainList: d.mainList,
            catChoosed: d.catChoosed,
            countryChoosed: d.countryChoosed,
            categories: d.categories,
            elements: d.elements,
            classes: d.classes,
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
            classes: d.classes,

            elements: d.elements,
            thumbnail: d.thumbnail,
            maxWidth: d.maxWidth,
            excerpt: d.excerpt,
            backgroundColor: d.backgroundColor,
            views: d.views,
          });
        } else {
          reject({
            load: true,
            notfound: true,
          });
        }
      });
    });
  };
  useEffect(() => {
    if (!isClient) return;

    if (!elements) {
      setLoading(true);
      getThePost(the_id)
        .then((items) => {
          setState(items);
          if (isClient) window.scrollTo(0, 0);
        })
        .catch((e) => {
          setState(e);
        })
        .finally(() => setLoading(false));
    }
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
    description = props ? props.description : null,
    redirect,
    notfound,
    classes = props ? props.classes : null,
    kind = props ? props.kind : null,
    maxWidth = props ? props.maxWidth : null,
    backgroundColor = props ? props.backgroundColor : null,
    elements = props ? props.elements : null,
  } = state;
  if (redirect && isClient) return <Navigate to={redirect} />;
  if (loading && isClient) return <Loading />;
  if (!loading && notfound && isClient) return <NotFound />;

  const style = setStyles({ backgroundColor });

  return (
    <div className={'the-body '+(classes ? classes : "")} style={style}>
      <PageBuilder
        elements={elements}
        kind={kind}
        maxWidth={maxWidth}
        description={description}
      />
    </div>
  );
};
export default withTranslation()(MainContent);
