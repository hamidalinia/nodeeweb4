import {
    Datagrid,
    EditButton,
    FunctionField,
    List,
    SearchInput,
    TextField,
    useTranslate,
    Filter,
} from 'react-admin';
import { dateFormat } from '@/functions';
import { useMediaQuery } from '@mui/material';
import { SimpleList } from 'react-admin';

const PostFilter = (props) => {
    const translate = useTranslate();

    return (
        <Filter {...props}>
            <SearchInput source="Search" placeholder={translate('resources.accInvoices.search')} alwaysOn />
        </Filter>
    );
};

const AccInvoicesList = (props) => {
    const t = useTranslate();
    const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <List {...props} filters={<PostFilter />}>
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => record.title}
                    secondaryText={(record) =>
                        `${t('resources.accInvoices.updatedAt')}: ${dateFormat(record.updatedAt)}`
                    }
                />
            ) : (
                <Datagrid>
                    <TextField source="title" label="resources.accInvoices.title" />
                    <TextField source="description" label="resources.accInvoices.description" />
                    <FunctionField
                        label="resources.accInvoices.updatedAt"
                        render={(record) => dateFormat(record.updatedAt)}
                    />
                    <EditButton />
                </Datagrid>
            )}
        </List>
    );
};

export default AccInvoicesList;
