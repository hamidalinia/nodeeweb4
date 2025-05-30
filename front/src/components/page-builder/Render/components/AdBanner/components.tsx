import { styled } from '@mui/material';
import { Link } from 'react-router-dom';
import { Splide } from '@splidejs/react-splide';

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  height: theme.spacing(12),
  [theme.breakpoints.down('sm')]: {
    height: theme.spacing(7),
    gap: theme.spacing(1),
  },
}));

export const AddButton = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.common.white,
  height: '100%',
  width: theme.spacing(12),
  minWidth: theme.spacing(12),
  boxShadow: '0 0 1px #0008',

  '& svg': {
    fontSize: 60,
    color: '#222',
  },
  [theme.breakpoints.down('sm')]: {
    width: theme.spacing(7),
    minWidth: theme.spacing(7),
    '& svg': {
      fontSize: theme.spacing(5),
    },
  },
}));

export const Slider = styled(Splide)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.common.white,
  boxShadow: '0 0 1px #0008',
  height: '100%',
  width: `calc(100% - ${theme.spacing(13.5)})`,
  overflow: 'hidden',
  '& .splide__arrows--rtl': {
    '& .splide__arrow': {
      '& svg': {
        fill: '#297e7b',
      },
    },
    '& .splide__arrow--prev': {
      right: theme.spacing(1),
    },
    '& .splide__arrow--next': {
      left: theme.spacing(1),
    },
  },
  [theme.breakpoints.down('sm')]: {
    width: `calc(100% - ${theme.spacing(8)})`,
    '& .splide__arrow': {
      height: theme.spacing(4),
      width: theme.spacing(4),
      '& svg': {
        height: theme.spacing(4),
        width: theme.spacing(4),
        fontSize: theme.spacing(2.5),
      },
    },
  },
}));

export const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.common.white,
  padding: theme.spacing(1.5, 1),
  width: '100%',
  height: theme.spacing(12),
  gap: theme.spacing(1.5),
  '& h3': {
    fontSize: '1.125rem',
    color: '#000',
  },
  '& span': {
    fontSize: '1rem',
    color: 'rgba(0,0,0,.56)',
    whiteSpace: 'nowrap',
    overflow: 'clip',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    height: theme.spacing(7),
    gap: theme.spacing(0.5),
    '& h3': {
      fontSize: '0.75rem',
    },
    '& span': {
      fontSize: '0.5rem',
    },
  },
}));
