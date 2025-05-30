import { styled } from '@mui/material';

export const Row = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& img': {
    height: 200,
    borderRadius: theme.spacing(0.5),
  },
}));
