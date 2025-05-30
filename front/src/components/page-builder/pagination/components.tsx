import { styled } from '@mui/material/styles';

import { TablePagination, TablePaginationProps } from '@mui/material';

export const MyPagination = styled(TablePagination)<TablePaginationProps>(
  ({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',

    '& .MuiToolbar-root': {
      padding: 0,
    },
    '& p': {
      margin: 0,
    },
    '& .MuiInputBase-root': {
      marginInlineEnd: theme.spacing(4),
      marginInlineStart: theme.spacing(1),
    },
    '& .MuiTablePagination-actions': {
      marginLeft: 0,
      marginRight: theme.spacing(2.5),
    },
  })
);
