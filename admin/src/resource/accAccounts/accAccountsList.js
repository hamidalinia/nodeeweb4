import {
    Datagrid,
    TextField,
    NumberField,
    SearchInput,
    Filter,
    useTranslate,
    EditButton,
    FunctionField,
    BooleanField,
} from 'react-admin';
import { List } from '@/components';
import { dateFormat } from '@/functions';

const PostFilter = (props) => {
    const t = useTranslate();

    return (
        <Filter {...props}>
            <SearchInput source="Search" placeholder={t('resources.accAccount.search')} alwaysOn />
        </Filter>
    );
};

const accAccountList = (props) => {
    const t = useTranslate();

    return (
        <List {...props} filters={<PostFilter />}>
            <Datagrid>
                <TextField source="code" label={t('resources.accAccount.code')} />
                <TextField source="title" label={t('resources.accAccount.title')} />
                <TextField source="category.title" label={t('resources.accAccount.category')} />
                <FunctionField
                    label={t('resources.accAccount.type')}
                    render={(record) =>
                        ({
                            asset: 'دارایی',
                            liability: 'بدهی',
                            equity: 'حقوق صاحبان سهام',
                            income: 'درآمد',
                            expense: 'هزینه'
                        }[record.type] || record.type)
                    }
                />
                <NumberField source="balance" label={t('resources.accAccount.balance')} />
                <TextField source="description" label={t('resources.accAccount.description')} />
                <BooleanField source="active" label={t('resources.accAccount.active')} />
                <FunctionField
                    label={t('resources.accAccount.updatedAt')}
                    render={(record) => dateFormat(record.updatedAt)}
                />
                <EditButton />
            </Datagrid>
        </List>
    );
};

export default accAccountList;
