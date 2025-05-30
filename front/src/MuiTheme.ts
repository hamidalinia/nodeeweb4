import { createTheme, responsiveFontSizes } from '@mui/material';

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: ['IRANSans', 'sans-serif'].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        startIcon: {
          marginLeft: 8,
          marginRight: -4,
        },
        endIcon: {
          marginLeft: -4,
          marginRight: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& legend': {
            all: 'unset',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          textAlign: 'right',
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
