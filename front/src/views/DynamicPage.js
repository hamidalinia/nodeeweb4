import { useState } from 'react';
import { Container } from 'shards-react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import PageBuilder from '@/components/page-builder/PageBuilder';
import { isClient, loadPost } from '@/functions';
import NotFound from '@/views/_404';

export default function DynamicPage({ elements = [] }) {
  const page = useSelector((st) => {
    return st.store.page || [];
  });

  const params = useParams();

  const [state, setState] = useState(isClient ? [] : page || []);
// console.clear()
  console.log("state",state)
  const { kind, maxWidth } = state;

  // if (redirect && isClient) return <Navigate to={redirect}/>;
  // if (!load && isClient) return <Loading/>;
  // if (load && notfound && isClient) return <NotFound />
  // console.log("product", title, lan, encodeURIComponent(title[lan]));

  // elements.data=params;
  return (
    <Container className="main-content-container p-0 pb-4 kiuytyuioiu bg-white">
      <div className="the-body">
        <PageBuilder
          elements={elements}
          data={params}
          params={params}
          kind={kind}
          maxWidth={maxWidth}
        />
      </div>
    </Container>
  );
}
export const PageServer = [
  {
    func: loadPost,
    params: '6217502008d0e437d6b4ad97',
  },
];
