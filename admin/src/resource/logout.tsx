import { useState } from 'react';

import { Form } from 'react-final-form';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CircularProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@material-ui/styles';
import LockIcon from '@mui/icons-material/Lock';
import { Notification, useTranslate, useLogout } from 'react-admin';

import { lightTheme } from '@/layout/themes';

const useStyles = makeStyles((theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'flex-start',
    background: 'url(https://source.unsplash.com/random/1600x900)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  card: {
    minWidth: 300,
    marginTop: '6em',
  },
  avatar: {
    margin: '1em',
    display: 'flex',
    justifyContent: 'center',
  },
  icon: {
    // @ts-ignore
    backgroundColor: theme.palette.secondary.main,
  },
  hint: {
    marginTop: '1em',
    display: 'flex',
    justifyContent: 'center',
    // @ts-ignore
    color: theme.palette.grey[500],
  },
  form: {
    padding: '0 1em 1em 1em',
  },
  input: {
    marginTop: '1em',
  },
  actions: {
    padding: '0 1em 1em 1em',
  },
}));

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const translate = useTranslate();
  const classes = useStyles();

  const logout = useLogout();

  // @ts-ignore
  const handleSubmit = (auth) => {
    setLoading(true);
    logout();
  };

  return (
    <Form
      onSubmit={handleSubmit}
      // validate={validate}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} noValidate>
          <div className={classes.main}>
            <Card className={classes.card}>
              <div className={classes.avatar}>
                <Avatar className={classes.icon}>
                  <LockIcon />
                </Avatar>
              </div>
              <div className={classes.hint}>{translate('logoutMessage')}</div>
              <div className={classes.form}></div>
              <CardActions className={classes.actions}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={loading}
                  fullWidth>
                  {loading && <CircularProgress size={25} thickness={2} />}
                  {translate('sign_out')}
                </Button>
              </CardActions>
            </Card>
            <Notification />
          </div>
        </form>
      )}
    />
  );
};

// We need to put the ThemeProvider decoration in another component
// Because otherwise the useStyles() hook used in Login won't get
// the right theme
const LogoutWithTheme = (props) => (
  <ThemeProvider theme={createTheme(lightTheme)}>
    <Logout {...props} />
  </ThemeProvider>
);

export default LogoutWithTheme;
