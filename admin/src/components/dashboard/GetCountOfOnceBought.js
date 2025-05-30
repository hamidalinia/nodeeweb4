import * as React from 'react';
import { FC, createElement } from 'react';
import { Card, Box, Typography, Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import { useEffect,useState } from "react";
import API, { BASE_URL } from "@/functions/API";

import cartouche from './cartouche.png';
import cartoucheDark from './cartoucheDark.png';

import Person4Icon from '@mui/icons-material/Person4';

const useStyles = makeStyles(theme => ({
    card: {
        minHeight: 52,
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
        '& a': {
            textDecoration: 'none',
            color: 'inherit',
        },
    },
    main: (props) => ({
        overflow: 'inherit',
        padding: 16,
        background: `url(${
            theme.palette.type === 'dark' ? cartoucheDark : cartouche
            }) no-repeat`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& .icon': {
            color: theme.palette.type === 'dark' ? 'inherit' : '#dc2440',
        },
    }),
    title: {},
}));

const GetCountOfOnceBought = (props) => {
    const { icon='Person4', title='اونایی که یبار خرید داشتن', subtitle='', to='', children } = props;
    const classes = useStyles(props);
    const [theData,setTheData]=useState(0);
    const getShopData = () => {
        API.get("/settings/get-count-of-once-bought").then(({ data = {} }) => {
            // setLoading(false);
            // Object.keys(data).forEach(d => {
            //   setValue(d, data[d]);
            // });
            // console.log(data);
            // SetShopData({ ...data });
            // if (data.factore_shop_phoneNumber)
            //     Stel(data.factore_shop_phoneNumber);
            // setValue("title",data.title);
            setTheData(data?.count);
            // return data;
        }).catch(e => {
            // setLoading(false);
            // setTheData(true);
        });
    };
    useEffect(() => {

        console.log("getShopData");
        getShopData();
    }, []);
    return (
        <div className={'col-md-3 ltr'}>
            <Link to={to}>
                <div className={classes.main}>
                    <Box width="3em" className="icon font-size-50">
                        <Person4Icon className={''} />
                    </Box>
                    <Box textAlign="right" className={"rtl"}>
                        <Typography
                            className={classes.title+" rtl" }
                            color="textSecondary"
                        >
                            {title}
                        </Typography>
                        <Typography variant="h5" component="h2" className={"rtl"}>
                            {theData || ' '}
                        </Typography>
                    </Box>
                </div>
            </Link>
            {children && <Divider />}
            {children}
        </div>
    );
};

export default GetCountOfOnceBought;
