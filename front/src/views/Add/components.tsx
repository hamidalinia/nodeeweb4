import { styled } from '@mui/material';

export const Container = styled('div')(({ theme }) => ({
  maxWidth: 1360,
  paddingLeft: 'var(--bs-gutter-x,.75rem)',
  paddingRight: 'var(--bs-gutter-x,.75rem)',
  margin: 'auto',
  padding: theme.spacing(2, 'var(--bs-gutter-x,.75rem)', 5),
}));

export const Card = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.common.white,
  boxShadow: '0px 0px 3px #cacaca',
  display: 'flex',
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.2s ease-in-out',
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

export const Description = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  margin: theme.spacing(2, 0),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'start',
    // marginBott
  },
}));

export const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 4, 2, 0),
  width: '100%',

  [theme.breakpoints.down('sm')]: {
    padding: 0,
    fontSize: 16,
  },
}));

export const Row = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 0),
  '& p': {
    margin: 0,
  },
  '&:last-child': {
    borderBottom: 'none',
    paddingBottom: 0,
  },

  [theme.breakpoints.down('sm')]: {
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(0,0,0,0.12)',
    padding: theme.spacing(1, 0),
  },
}));

export const CategoryRow = styled(Row)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'start',
  },
}));

export const ImageContainer = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: '33%',
  border: '1px solid #0004',
  borderRadius: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    marginBottom: theme.spacing(2),
  },
}));
export const Image = styled('img')(({ theme }) => ({
  borderRadius: theme.spacing(1),
  height: 425,
  width: '100%',
  maxWidth: '100%',
  objectFit: 'contain',

  [theme.breakpoints.down('sm')]: {
    height: 300,
  },
}));

export const CategoryList = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  fontSize: '0.875rem',

  '& a': {
    border: '1px solid rgba(0,0,0,.1)',
    color: 'rgba(0,0,0,.56)',

    borderRadius: theme.spacing(2),
    padding: theme.spacing(0.5, 2),
    textAlign: 'center',
    minWidth: 80,
    whiteSpace: 'nowrap',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 14,
  },
}));

export const TimeTag = styled('span')(({ theme }) => ({
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
  [theme.breakpoints.down('sm')]: {
    position: 'static',
  },
}));

export const Related = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
}));
