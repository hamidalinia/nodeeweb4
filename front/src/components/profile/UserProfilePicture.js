import React, {useEffect, useRef, useState} from 'react';
import {Button, CircularProgress, Grid, IconButton, Modal, Tab, Tabs} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import Avataaars from 'avataaars';
import {useTranslation} from 'react-i18next';
import {MainUrl, uploadBase64ProfileImage, uploadProfilePhoto} from '@/functions'; // Import the upload function
import RefreshIcon from '@mui/icons-material/Refresh';
import {useSelector} from "react-redux";

const UserProfilePicture = (props) => {
  // return 0
  let {socialMode} = props
  const {t} = useTranslation();
  const [avatar, setAvatar] = useState(null); // Store the avatar as base64
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [theIndex, setTheIndex] = useState(null); // Store the avatar as base64
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState(1); // Set "Choose Avatar" as the default tab (index 1)
  const [avatars, setAvatars] = useState([]); // Store generated avatars
  const avatarRefs = useRef([]); // Store refs for avatars (DOM elements)
  const user = useSelector((st) => st.store.user);
  let {photos} = user;
// return JSON.stringify(user)
  // Avatar attributes
  const avatarAttributes = {
    topType: ["ShortHairDreads01", "ShortHairShaggy", "Hat", "LongHairBigHair"],
    accessoriesType: ["Kurt", "Wayfarers", "Blank", "Prescription01"],
    hairColor: ["Black", "Brown", "Blonde", "Auburn"],
    facialHairType: ["BeardMedium", "BeardLight", "Shave", "Moustache"],
    facialHairColor: ["Black", "Brown", "Blonde", "Auburn"],
    clotheType: ["Hoodie", "TShirt", "BlazerShirt", "Overall"],
    clotheColor: ["Blue", "Red", "Green", "Yellow"],
    eyeType: ["Happy", "Wink", "Smile", "Sad"],
    eyebrowType: ["UpDown", "Flat", "Raised", "Angry"],
    mouthType: ["Smile", "Grimace", "Sad", "Tongue"],
    skinColor: ["Light", "Medium", "Dark", "Yellow"],
  };

  // Utility function to get random item from an array
  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Generate random avatars for display
  const generateRandomAvatars = () => {
    const getRandomAvatar = (index) => (
      <div ref={(el) => avatarRefs.current[index] = el}>
        <Avataaars
          avatarStyle="Circle"
          topType={getRandomItem(avatarAttributes.topType)}
          accessoriesType={getRandomItem(avatarAttributes.accessoriesType)}
          hairColor={getRandomItem(avatarAttributes.hairColor)}
          facialHairType={getRandomItem(avatarAttributes.facialHairType)}
          facialHairColor={getRandomItem(avatarAttributes.facialHairColor)}
          clotheType={getRandomItem(avatarAttributes.clotheType)}
          clotheColor={getRandomItem(avatarAttributes.clotheColor)}
          eyeType={getRandomItem(avatarAttributes.eyeType)}
          eyebrowType={getRandomItem(avatarAttributes.eyebrowType)}
          mouthType={getRandomItem(avatarAttributes.mouthType)}
          skinColor={getRandomItem(avatarAttributes.skinColor)}
          style={{width: '100px', height: '100px'}}
        />
      </div>
    );

    return Array.from({length: 4}, (_, index) => getRandomAvatar(index));
  };

  const generateMoreAvatars = () => {
    const initialAvatars = generateRandomAvatars();
    setAvatar(null);
    setTheIndex(null);
    setAvatars(initialAvatars);
  }
  const getSVGBase64 = (svgElement) => {
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const base64 = btoa(unescape(encodeURIComponent(svgString)));
    return `data:image/svg+xml;base64,${base64}`;
  };

  // Select avatar and convert to base64
  const handleAvatarSelect = (index) => {
    const selectedAvatarRef = avatarRefs.current[index];
    setTheIndex(index);
    if (selectedAvatarRef) {
      const svgElement = selectedAvatarRef.querySelector('svg');
      if (svgElement) {
        const base64Image = getSVGBase64(svgElement);
        setAvatar(base64Image);
        console.log('Base64 SVG Image:', base64Image);
      } else {
        console.error('SVG element not found.');
      }
    } else {
      console.error('Avatar element not found.');
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleUploadAvatar = async () => {
    if (avatar) {
      setUploadingAvatar(true);
      try {
        // Call the uploadProfilePhoto function to upload the avatar
        const response = await uploadBase64ProfileImage(avatar);
        console.log('Avatar uploaded successfully:', response);
        setUploadingAvatar(false);

        // You can handle any further logic after a successful upload, like showing a success message.
      } catch (error) {
        console.error('Error uploading avatar:', error);
        setUploadingAvatar(false);

      }
    } else {
      console.error('No avatar selected to upload.');
    }
  };

  // Use useEffect to generate avatars only once when the component mounts
  useEffect(() => {
    const initialAvatars = generateRandomAvatars();
    setAvatars(initialAvatars);
  }, []);
// if(!photos){
//   return 0
// }
  return (
    <>
      {(!photos) &&
      <IconButton onClick={() => setModalVisible(true)} className={"humanprofile " + (socialMode ? 'social' : '')}>
        <AccountCircleIcon/></IconButton>}
      {(photos && photos[0]) &&
      <img onClick={() => setModalVisible(true)} className={"humanprofile " + (socialMode ? 'social' : '')}
           src={MainUrl + '/' + photos[0]?.url}/>}
      <Modal open={modalVisible} onClose={handleCloseModal}>
        <div style={{padding: '20px', maxWidth: '400px', margin: 'auto', backgroundColor: 'white'}}>
          <IconButton onClick={handleCloseModal}
                      style={{position: 'absolute', top: '10px', left: '10px', zIndex: '9999'}}>
            <CloseIcon/>
          </IconButton>
          <Tabs className={'avatars-tab'} value={selectedTab} onChange={handleTabChange}
                aria-label="avatar selection tabs">
            <Tab label={t('selfPhoto')}/>
            <Tab label={t('avatars')}/>
          </Tabs>
          {selectedTab === 0 && (
            <div>
              <input type="file" onChange={(e) => console.log('Image uploaded:', e.target.files[0])}/>
            </div>
          )}

          {selectedTab === 1 && (<>
            {!uploadingAvatar && (<div style={{padding: '20px 0s'}}>
              <Grid container spacing={2}>
                {avatars.map((avatar, index) => (
                  <Grid item xs={3} key={index}>
                    <div
                      className={'the-avatar index-' + index + ' theIndex-' + theIndex + ' ' + ((index === theIndex) ? 'selected-avatar' : '')}
                      onClick={() => handleAvatarSelect(index)}>{avatar}</div>
                  </Grid>
                ))}
              </Grid>
              <div className={'avatar-buttons'}>
                {avatar && (<Button variant="contained" color="primary" onClick={handleUploadAvatar}>
                  {t('Use Avatar')}
                </Button>)}
                <Button variant="contained" color="secondary" onClick={generateMoreAvatars}>
                  <RefreshIcon/>
                </Button>
              </div>

            </div>)}
            {uploadingAvatar && <div className={'avatar-buttons'}><CircularProgress/></div>}
          </>)}
        </div>
      </Modal>
    </>
  );
};

export default UserProfilePicture;
