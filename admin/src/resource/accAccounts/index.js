import accAccountsCreate from './accAccountsCreate';
import accAccountsEdit from './accAccountsEdit';
import accAccountsList from './accAccountsList';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const AccAccounts = {
    list: accAccountsList,
    edit: accAccountsEdit,
    create: accAccountsCreate,
    icon: AccountBalanceIcon,
    createIcon: AccountBalanceIcon,
};

export default AccAccounts;
