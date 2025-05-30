import { lazy, memo } from 'react';
import { Layout, useTranslate } from 'react-admin';

import { isDev } from '@/Utils';

import AppBar from './AppBar';
import Menu from './Menu';

const ReactQueryDevtools = lazy(() =>
  import('react-query/devtools').then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

function MainLayout(props) {
  const translate = useTranslate();

  return (
    <div>
      <Layout
        {...props}
        className={translate('dir')}
        menu={Menu}
        appBar={AppBar}
      />
      {isDev && <ReactQueryDevtools initialIsOpen={false} />}
    </div>
  );
}

export default memo(MainLayout);
