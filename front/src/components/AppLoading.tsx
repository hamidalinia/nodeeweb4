import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const Loading = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: '100vh',
  width: '100vw',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f4f7fb',
  zIndex: 15000,
  overflow: 'hidden',
  '& > span': {
    appearance: 'none',
    position: 'relative',
    width: '7%',
    minWidth: 70,
    aspectRatio: 1,
    borderRadius: 5,
    animation: 'flip 2s infinite ease-in-out',
    backgroundColor: 'var(--primary)',
  },

  '& h2': {
    margin: theme.spacing(5, 0, 0),
    fontSize: theme.spacing(3.5),
    color: '#3d5170',
  },

  '@keyframes flip': {
    '0%': {
      transform: 'perspective(200px) rotateX(0) rotateY(180deg)',
    },
    '50%': {
      transform: 'perspective(200px) rotateX(0) rotateY(0)',
    },
    '100%': {
      transform: 'perspective(200px) rotateX(180deg) rotateY(0)',
    },
  },
}));

export default function AppLoading() {
  const { t } = useTranslation();

  return (
    <Loading>
      <span className={'loader-icon'} />
      <h2>...{t('loading')}</h2>
    </Loading>
  );
}
