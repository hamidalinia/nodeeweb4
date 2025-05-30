import accInvoicesCreate from './accInvoicesCreate';
import accInvoicesEdit from './accInvoicesEdit';
import accInvoicesList from './accInvoicesList';
import ReceiptIcon from '@mui/icons-material/Receipt';

const AccInvoices = {
    list: accInvoicesList,
    edit: accInvoicesEdit,
    create: accInvoicesCreate,
    icon: ReceiptIcon,
    createIcon: ReceiptIcon,
};

export default AccInvoices;
