import {useState} from 'react';
import {Button, Col, Container, Nav, NavItem, NavLink, Row} from 'shards-react';
import {useTranslation} from 'react-i18next';
import {useLocation} from 'react-router-dom';

import UserDetails from '#c/components/profile/UserDetails';
import UserAccountDetails from '#c/components/profile/UserAccountDetails';
import MyOrders from '#c/components/profile/MyOrders';
import MyTransactions from '#c/components/profile/MyTransactions';
import MyRequests from '#c/components/profile/MyRequests';
import MyAds from '#c/components/profile/MyAds';
import {useSelector} from "react-redux";
import _isEqual from "lodash/isEqual";
import SettingsIcon from '@mui/icons-material/Settings';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
const Tabs = [
  {id: 'profile', label: 'profile'},
  {id: 'my-orders', label: 'my orders'},
  {id: 'transactions', label: 'transactions'},
  // { id: 'requests', label: 'requests' },
  // { id: 'myads', label: 'my ads' },
];

export default function Profile() {
  const {t} = useTranslation();
  const location = useLocation();
  const themeData = useSelector((st) => st.store.themeData, _isEqual);

  let {hash = (themeData?.socialMode ? 'main' : 'profile')} = location;
  const [tab, setTab] = useState(() => hash.replace('#', '') || (themeData?.socialMode ? 'main' : 'profile'));

  if (themeData && themeData.socialMode) {
    return (<Container fluid className="main-content-container socialMode">
      <Row className={'border-bottom-323a59'} style={{
        padding: '10px',
        backgroundColor:'#121631'
      }}>
        <Col lg="6" className={'width-50darsad'} style={{alignItems: 'center', display: 'flex',color:'#fff'}}>
          پروفایل
        </Col>
        <Col lg="6" className={'width-50darsad'} style={{textAlign: 'left'}}>
          {tab !== 'profile' && (<Button className={'socialMode-setting'} onClick={() => setTab('profile')}><SettingsIcon/></Button>)}
          {tab === 'profile' && (<Button className={'socialMode-setting close'} onClick={() => setTab('main')}><HighlightOffIcon/></Button>)}
        </Col>
      </Row>
      {tab === 'profile' && (
        <Row><Col lg="8" id={tab}>
          <UserAccountDetails title={t('account details')}/>
        </Col></Row>
      )}
      {tab !== 'profile' && (<Row className={'social-mode-profile-wrapper'}>
        <Col>
          <UserDetails socialMode={true}/>
          <Nav
            justified
            tabs
            className="post-product-nav profile-nav horizental-nav">
            <NavItem>
              <NavLink
                href={`#`}
                className={'profile-tab-social'}
              >
                <div className={'pts-icon'}><ElectricBoltIcon/><span>0</span></div>
                <div className={'pts-icon-text'}>امتیاز کلی</div>
              </NavLink>
            </NavItem>
            <NavItem>

              <NavLink
                href={`#`}
                className={'profile-tab-social'}
              >
                {/*<ElectricBoltIcon/>*/}
                <div className={'pts-icon'}><span>0</span></div>
                <div className={'pts-icon-text'}>رتبه لیگ هفتگی</div>
              </NavLink>
            </NavItem>
            <NavItem>

              <NavLink
                href={`#`}
                className={'profile-tab-social'}
              >
                <div className={'pts-icon'}><MilitaryTechIcon/><span>0</span></div>
                <div className={'pts-icon-text'}>مرحله طی شده</div>
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
        <Col lg="8" id={tab}>


          {tab === 'my-orders' && <MyOrders title={t('my orders')}/>}
          {tab === 'transactions' && (
            <MyTransactions title={t('transactions')}/>
          )}
          {tab === 'requests' && <MyRequests title={t('requests')}/>}
          {tab === 'myads' && <MyAds title={t('my ads')}/>}
        </Col>
      </Row>)}
    </Container>)

  }
  return (
    <Container fluid className="main-content-container px-4 py-5">
      <Row className="w-100">
        <Col lg="4" className="sticky">
          <UserDetails/>
          <Nav
            justified
            tabs
            className="post-product-nav profile-nav vertical-nav">
            {Tabs.map((i, idx) => (
              <NavItem key={idx}>
                <NavLink
                  active={tab === i.id}
                  href={`#${i.id}`}
                  onClick={() => setTab(i.id)}>
                  {i.icon && i.icon}
                  <span>{t(i.label)}</span>
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </Col>
        <Col lg="8" id={tab}>
          {tab === 'profile' && (
            <UserAccountDetails title={t('account details')}/>
          )}

          {tab === 'my-orders' && <MyOrders title={t('my orders')}/>}
          {tab === 'transactions' && (
            <MyTransactions title={t('transactions')}/>
          )}
          {tab === 'requests' && <MyRequests title={t('requests')}/>}
          {tab === 'myads' && <MyAds title={t('my ads')}/>}
        </Col>
      </Row>
    </Container>
  );
}
