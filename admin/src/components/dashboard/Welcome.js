import * as React from 'react';
import {useState} from 'react';

import { Box, Card, CardActions, Button, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import { makeStyles } from '@mui/styles';
import { useTranslate } from 'react-admin';
import { Link } from "react-router-dom";
import { Rowing } from "@mui/icons-material";
import API, {BASE_URL} from '@/functions/API';
import publishArticleImage from './welcome_illustration.svg';

const useStyles = makeStyles(theme => ({
    root: {
        background:
            theme.palette.type === 'dark'
                ? '#535353'
                : `linear-gradient(to right, #8975fb 0%, #746be7 35%), linear-gradient(to bottom, #8975fb 0%, #6f4ceb 50%), #6f4ceb`,

        color: '#fff',
        padding: 20,
        marginTop: theme.spacing(2),
        marginBottom: '1em',
    },
    media: {
        background: `url(${publishArticleImage}) top right / cover`,
        marginLeft: 'auto',
    },
    actions: {
        [theme.breakpoints.down('md')]: {
            padding: 0,
            flexWrap: 'wrap',
            '& a': {
                marginTop: '1em',
                // marginRight: '1em !important',
                // marginLeft: '1em',
            },
        },
    },
}));

const Welcome = () => {
    const translate = useTranslate();
    const classes = useStyles();
    const [role, setRole] = useState(localStorage.getItem('role')); // Default mode is 'advanced'

    return (
        <Card className={classes.root}>
            <Box display="flex">
                <Box flex="1">
                    <Typography variant="h5" component="h2" gutterBottom>
                      {translate('resources.dashboard.welcome.hi')}{' '+localStorage.getItem('username')+translate('comma')+' '}{translate('resources.dashboard.welcome.title')}
                    </Typography>
                    <Box maxWidth="40em">
                        <Typography variant="body1" component="p" gutterBottom>
                            {localStorage.getItem('nickname')}
                        </Typography>
                        <Typography variant="body1" component="p" gutterBottom>
                            {localStorage.getItem('email')}
                        </Typography>
                        <Typography variant="body1" component="p" gutterBottom>
                            {BASE_URL}
                        </Typography>
                    </Box>
                    <CardActions className={classes.actions} >
                        {role !='agent' && <Link
                            className={'btn btn-primary'}
                            variant="contained"
                            to="/action"
                            startIcon={<Rowing />}
                        >
                            {translate('resources.dashboard.yourActions')}
                        </Link>}
                        {/*<Button*/}
                            {/*variant="contained"*/}
                            {/*href="#"*/}
                            {/*startIcon={<CodeIcon />}*/}
                        {/*>*/}
                            {/*{'button'}*/}
                        {/*</Button>*/}
                    </CardActions>
                </Box>

                <Box
                    display={{ xs: 'none', sm: 'none', md: 'block' }}
                    className={classes.media}
                    width="16em"
                    height="9em"
                    overflow="hidden"
                />
            </Box>
        </Card>
    );
};

export default Welcome;
