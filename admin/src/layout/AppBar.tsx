import {forwardRef, useState} from 'react';
import {AppBar, MenuItemLink, ToggleThemeButton, useNotify, UserMenu, useTranslate, useUserMenu,} from 'react-admin';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import {makeStyles} from '@mui/styles';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ToggleModeButton from '@/components/ToggleModeButton';


import {restartSystem, upgradeSystem} from '@/functions';
import {Configuration} from '@/components';

const useStyles = makeStyles({
    title: {
        flex: 1,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    spacer: {
        flex: 1,
    },
});

const UserMenuItem = forwardRef<typeof MenuItemLink, any>((props, ref) => {
    const {to, text, label = '', icon, onClick} = props;
    const {onClose} = useUserMenu();

    return (
        <MenuItemLink
            ref={ref}
            to={to}
            primaryText={text}
            leftIcon={icon}
            onClick={() => {
                if (onClick) onClick();
                onClose();
            }}>
            {label}
        </MenuItemLink>
    );
});

const CustomUserMenu = () => {
    const t = useTranslate();
    const notify = useNotify();
    const [role, setRole] = useState(localStorage.getItem('role')); // Default mode is 'advanced'

    const userId = localStorage.getItem('user_id');
    if (role == 'agent')
        return (
            <UserMenu icon={<MoreHorizIcon/>}>
                <UserMenuItem
                    to={'/admin/' + userId}
                    text={t('pos.profile')}
                    icon={<ManageAccountsIcon/>}
                />
                <Configuration/>
                <UserMenuItem
                    to="/logout"
                    primaryText={t('pos.logout')}
                    icon={<LogoutIcon/>}
                    label={t('logout')}
                />
            </UserMenu>
        );
    if (role != 'agent')
        return (
            <UserMenu icon={<MoreHorizIcon/>}>
                <UserMenuItem
                    to={'/admin/' + userId}
                    text={t('pos.profile')}
                    icon={<ManageAccountsIcon/>}
                />
                <UserMenuItem
                    to="/configuration"
                    text={t('pos.configuration')}
                    icon={<SettingsIcon/>}
                />
                <Configuration/>
                <UserMenuItem
                    to="#"
                    primaryText={t('pos.menu.restart')}
                    icon={<RestartAltIcon/>}
                    onClick={() => {
                        restartSystem();
                        notify(t('restarted'));
                    }}
                    label={t('pos.menu.restart')}
                />
                <UserMenuItem
                    to="#"
                    primaryText={t('pos.menu.upgrade')}
                    icon={<SystemUpdateAltIcon/>}
                    onClick={() => {
                        upgradeSystem();
                        notify(t('upgraded'));
                    }}
                    label={t('pos.menu.upgrade')}
                />

                <UserMenuItem
                    to="/logout"
                    primaryText={t('pos.logout')}
                    icon={<LogoutIcon/>}
                    label={t('logout')}
                />
            </UserMenu>
        );
};

export default function CustomAppBar(props) {
    const classes = useStyles();

    return (
        <AppBar {...props} elevation={1} userMenu={<CustomUserMenu/>}>
            {/*<Typography*/}
            {/*variant="h6"*/}
            {/*color="inherit"*/}
            {/*className={classes.title}*/}
            {/*id="react-admin-title"*/}
            {/*/>*/}
            {/*<Logo />*/}
            <span className={classes.spacer}/>
            {/**/}
            <ToggleThemeButton/>
            <ToggleModeButton/>
            {/*<LocalesMenuButton*/}
            {/*languages={[*/}
            {/*{ locale: 'en', name: 'English' },*/}
            {/*{ locale: 'fa', name: 'Persian' },*/}
            {/*]}*/}
            {/*/>*/}
            {/*<ToggleConfigButton />*/}
        </AppBar>
    );
}
