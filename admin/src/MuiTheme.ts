import { defaultTheme, RaThemeOptions } from 'react-admin';

const MyTheme: RaThemeOptions = {
  // direction: 'rtl',
  ...defaultTheme,
  typography: {
    fontFamily: [
      'IRANSans',
      'Roboto',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    // isRtl: true,
  },
  palette: {
    mode: 'dark', // Switching the dark mode on is a single property value change.
  },
  components: {
    ...defaultTheme.components,
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

    MuiTextField: {
      defaultProps: {
        variant: 'filled' as const,
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: 'filled' as const,
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        actions: {
          marginLeft: 0,
          marginRight: 20,
          '& li:first-child, li:last-child': {
            transform: 'rotate(180deg)',
          },
        },
      },
    },
    MuiListItemSecondaryAction: {
      styleOverrides: {
        root: {
          right: 'auto',
          left: 0,
        },
      },
    },
  },
};

export default MyTheme;
