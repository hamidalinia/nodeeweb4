import { styled } from '@mui/material';

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  minHeight: 'calc(100vh - 220px)',
  [theme.breakpoints.down('sm')]: {
    minHeight: 'calc(100vh - 80px)',
  },
}));

export const Content = styled('div')(({ theme }) => ({
  border: '1px solid #eee',
  boxShadow: '0 0 2px #eef',
  margin: theme.spacing(1),
  width: '100%',
  maxWidth: 500,
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
}));

export const Buttons = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: theme.spacing(3),
}));

export const Row = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'hidden',
}));
