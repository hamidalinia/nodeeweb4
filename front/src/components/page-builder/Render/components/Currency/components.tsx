import { styled } from '@mui/material/styles';

export const TableContainer = styled('div')(({ theme }) => ({
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.grey[500]}`,
  overflow: 'hidden',

  width: '100%',
  maxHeight: 786, // 770px, 16px padding
  overflowY: 'auto',
}));

export const Row = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: theme.spacing(1, 0),
}));

export const Table = styled('table')(({ theme }) => ({
  borderCollapse: 'collapse',
  borderSpacing: 0,
  width: '100%',

  '& th': {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 700,
    border: `1px solid ${theme.palette.grey[300]}`,
    padding: theme.spacing(1, 2),
  },
  '& td': {
    textAlign: 'center',

    fontSize: 13,
    fontWeight: 400,
    border: `1px solid ${theme.palette.grey[300]}`,

    padding: theme.spacing(1, 2),
  },
}));
