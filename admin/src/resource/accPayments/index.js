import accPaymentsCreate from './accPaymentsCreate';
import accPaymentsEdit from './accPaymentsEdit';
import accPaymentsList from './accPaymentsList';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const AccPayments = {
    list: accPaymentsList,
    edit: accPaymentsEdit,
    create: accPaymentsCreate,
    icon: MonetizationOnIcon,
    createIcon: MonetizationOnIcon,
};

export default AccPayments;
