import { styled } from '@mui/material';

export const Card = styled('div')(({ theme }) => ({
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.common.white,
  boxShadow: '0px 0px 3px #cacaca',
  display: 'flex',
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.2s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    minHeight: 150,
  },
}));

export const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 1),
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    height: '100%',
  },
}));

export const Image = styled('div')(({ theme }) => ({
  minWidth: 150,
  width: 150,
  height: 150,
  '& img': {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    objectFit: 'contain',
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 100,
    width: 100,
    height: 'auto',
  },
}));

export const CategoryTag = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: theme.spacing(1),
  top: theme.spacing(2),
  border: '1px solid rgba(0,0,0,.1)',
  color: 'rgba(0,0,0,.56)',

  borderRadius: theme.spacing(2),
  padding: theme.spacing(0.5, 2),
  fontSize: '0.875rem',
  textAlign: 'center',
  minWidth: 80,
  maxWidth: 180,
  whiteSpace: 'nowrap',
  overflow: 'clip',
  [theme.breakpoints.down('sm')]: {
    position: 'static',
  },
}));
export const Row = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'space-between',
  },
}));
