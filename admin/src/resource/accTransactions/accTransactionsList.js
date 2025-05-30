import {
    Datagrid,
    TextField,
    Filter,
    SearchInput,
    useTranslate,
    EditButton,
    FunctionField,
} from 'react-admin';
import { List } from '@/components';
import { dateFormat } from '@/functions';

const AccTransactionsFilter = (props) => {
    const t = useTranslate();

    return (
        <Filter {...props}>
            <SearchInput source="description" placeholder={t('resources.accTransaction.search')} alwaysOn />
            {/* می‌تونید فیلترهای بیشتری اضافه کنید مثل تاریخ، حساب و ... */}
        </Filter>
    );
};

const AccTransactionsList = (props) => {
    const t = useTranslate();

    return (
        <List {...props} filters={<AccTransactionsFilter />}>
            <Datagrid rowClick="edit">
                <TextField source="description" label={t('resources.accTransaction.description')} />

                {/* عنوان حساب بدهکار */}
                <FunctionField
                    label={t('resources.accTransaction.debitAccount')}
                    render={record => record.debit?.account?.title || '-'}
                />
                {/* مبلغ بدهکار */}
                <FunctionField
                    label={t('resources.accTransaction.debitAmount')}
                    render={record => record.debit?.amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? '-'}
                />

                {/* عنوان حساب بستانکار */}
                <FunctionField
                    label={t('resources.accTransaction.creditAccount')}
                    render={record => record.credit?.account?.title || '-'}
                />
                {/* مبلغ بستانکار */}
                <FunctionField
                    label={t('resources.accTransaction.creditAmount')}
                    render={record => record.credit?.amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? '-'}
                />

                {/* تاریخ تراکنش (timestamp) */}
                {/*<FunctionField*/}
                    {/*label={t('resources.accTransaction.date')}*/}
                    {/*render={record => dateFormat(record.date)}*/}
                {/*/>*/}

                <TextField source="refNo" label={t('resources.accTransaction.refNo')} />
                <FunctionField
                    label={t('resources.accTransaction.active')}
                    render={record => (record.active ? t('resources.accTransaction.activeTrue') : t('resources.accTransaction.activeFalse'))}
                />

                <FunctionField
                    label={t('resources.accTransaction.updatedAt')}
                    render={record => dateFormat(record.updatedAt)}
                />

                <EditButton />
            </Datagrid>
        </List>
    );
};

export default AccTransactionsList;
