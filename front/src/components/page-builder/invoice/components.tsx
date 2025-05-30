import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  height: '100%',
  width: '100%',
  overflow: 'auto',
  direction: 'ltr',
  fontFamily: 'sans-serif',
  '--bg-color': theme.palette.grey[300],
}));

export const Table = styled('table')(({ theme }) => ({
  width: '100%',
  maxWidth: '100%',
  borderCollapse: 'collapse',
  borderSpacing: 0,
  '& thead': {
    backgroundColor: 'var(--bg-color)',
  },

  '& th': {
    fontWeight: '700 !important',
    whiteSpace: 'noWrap',
  },
  '& td, th': {
    fontSize: 13,
    fontWeight: 400,
    border: `1px solid ${theme.palette.grey[300]}`,
    padding: theme.spacing(1, 2),
    verticalAlign: 'middle',
  },
  [theme.breakpoints.down('sm')]: {
    '& td, th': {
      fontSize: 12,
      padding: theme.spacing(1, 1),
    },
  },
}));

export const EmptyCell = styled('td')(() => ({
  border: 'none !important',
}));

export const Label = styled('span')(() => ({
  fontWeight: 'bold',
}));

export const Title = styled(Typography)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignSelf: 'center',
  position: 'relative',
  marginTop: theme.spacing(12),
  '&:before': {
    content: '""',
    height: 3,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'currentColor',
    borderRadius: 3,
  },
}));

export const Header = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'end',
  gap: theme.spacing(1),
  '& > div': {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 120,
    gap: theme.spacing(0.25),
    padding: theme.spacing(0.5, 1),
    '&:first-child': {
      backgroundColor: 'var(--bg-color)',
      fontWeight: 'bold',
    },
  },
}));

export const Signature = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'start',
  margin: theme.spacing(4, 0, 0, 4),
  fontSize: 12,
}));

export const BreakWord = styled('td')(({ theme }) => ({
  whiteSpace: 'normal',
  wordBreak: 'break-word',
}));
