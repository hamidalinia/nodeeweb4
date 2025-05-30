import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import MainContent from '@/components/MainContent';

const Home = (props) => {
  // @ts-ignore
  const themeData = useSelector((st) => st.store.themeData);
  // @ts-ignore
  const homeData = useSelector((st) => st.store.homeData);

  if (!themeData) return null;

  return (
    themeData.body &&
    themeData.body.map((i, idx) => {
      if (i.name === 'MainContent') {
        return <MainContent key={idx} {...props} />;
      }
      return null;
    })
  );
};

export default withTranslation()(Home);
