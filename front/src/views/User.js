import React, { useEffect, useState } from 'react';
import {Button, Col, Container, Nav, NavItem, NavLink, Row} from 'shards-react';

import { useParams } from 'react-router-dom';
import UserProfilePicture from '#c/components/profile/UserProfilePicture';
import { withTranslation } from 'react-i18next';
import { getTheUser } from '#c/functions/index';
import Loading from '#c/components/Loading';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
const User = (props) => {
  const { t } = props;
  const { _id } = useParams(); // Accessing ID from URL params
  const [userData, setUserData] = useState(null); // User data state
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch the user data when the component mounts
  const fetchUserData = async (id) => {
    try {
      const data = await getTheUser(id); // Assume getTheUser fetches the user data from server
      setUserData(data); // Store the fetched data
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  useEffect(() => {
    if (_id) {
      fetchUserData(_id); // Fetch data when component mounts or _id changes
    }
  }, [_id]);

  // If data is still loading, show loading spinner
  if (loading) {
    return <Loading />;
  }

  // If no user data is found, display an error
  if (!userData) {
    return <div>{t('User not found')}</div>;
  }

  const { firstName, lastName, photos, score, active, createdAt } = userData;

  return (
    <Container className="main-content-container p-0 pb-4 bg-white">
      <div className={'posrel d-flex'}>
        <div style={{ display: 'flex', gap: '20px', padding: '40px 20px 15px 20px' }}>
          <UserProfilePicture socialMode={true} photoUrl={photos?.url} />
          <div>
            <h4 className="mb-0">{`${firstName} ${lastName}`}</h4>
            <div className={'followers-part'}>
              <span>۰ دنبال کننده</span>
              <span>۰ دنبال شونده</span>
            </div>

          </div>
        </div>

      </div>
      <Nav
        justified
        tabs
        className="post-product-nav profile-nav horizental-nav user-stats">
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

    </Container>
  );
};

export default withTranslation()(User);
