import accTransactionsCreate from './accTransactionsCreate';
import accTransactionsEdit from './accTransactionsEdit';
import accTransactionsList from './accTransactionsList';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; // مثال: می‌تونی آیکون بهتری بذاری

const AccTransactions = {
    list: accTransactionsList,
    edit: accTransactionsEdit,
    create: accTransactionsCreate,
    icon: ReceiptLongIcon,
    createIcon: ReceiptLongIcon,
};

export default AccTransactions;
