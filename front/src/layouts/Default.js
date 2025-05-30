import PropTypes from 'prop-types';
import clsx from 'clsx';

import PageBuilder from '@/components/page-builder/PageBuilder';
import CardSidebar from '@/components/layout/MainSidebar/CardSidebar';
import { setStyles } from '@/functions';

const DefaultLayout = (props) => {
  const { children, width, noNavbar, onChange = () => null, themeData } = props;
  // const themeData = useSelector((st) => st.store.themeData);
  // const themeData = useSelector((st) => st.store.themeData);
  // const homeData = useSelector((st) => st.store.homeData);
  // useEffect(() => {
  //   console.log('homeData', themeData)
  // }, []);
  if (!themeData) return;

  let headerStyle = setStyles(themeData.header);
  delete headerStyle.maxWidth;

  let footer = setStyles(themeData.footer);
  delete footer.maxWidth;

  return (
    <>
      {themeData.header && themeData.header.elements && (
        <header
          style={headerStyle}
          className={
            'main-header d-flex  ' +
            themeData.header.classes +
            (themeData.header.showInDesktop ? ' showInDesktop ' : '') +
            (themeData.header.showInMobile ? ' showInMobile ' : '')
          }>
          <PageBuilder
            elements={themeData.header.elements}
            maxWidth={themeData.header.maxWidth}
          />
        </header>
      )}
      {children}
      <CardSidebar />

      {/*<MainMobileNavbar search={false} />*/}
      {themeData.footer && themeData.footer.elements && (
        <footer
          style={footer}
          className={clsx(
            'main-footer border-top',
            themeData.footer.classes
          )}>
          <PageBuilder
            elements={themeData.footer.elements}
            maxWidth={themeData.footer.maxWidth}
          />
        </footer>
      )}
    </>
  );
};

DefaultLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool,
};

DefaultLayout.defaultProps = {
  noNavbar: false,
  noFooter: false,
};

export default DefaultLayout;
