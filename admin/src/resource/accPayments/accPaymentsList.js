import {
    Datagrid,
    EditButton,
    Filter,
    SearchInput,
    TextField,
    useTranslate,
    FunctionField,
} from 'react-admin';
import { List } from '@/components';
import { dateFormat } from '@/functions';
import { useMediaQuery } from '@mui/material';
import SimpleList from '@mui/material/List';

const PostFilter = (props) => {
    const translate = useTranslate();

    return (
        <Filter {...props}>
            <SearchInput
                source="Search"
                placeholder={translate('resources.accPayments.search')}
                alwaysOn
            />
            <SearchInput
                source="category"
                placeholder={translate('resources.accPayments.category')}
                alwaysOn
            />
        </Filter>
    );
};

export default function accPaymentsList(props) {
    const t = useTranslate();
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));

    return (
        <List {...props} filters={<PostFilter />}>
            {isSmall ? (
                <SimpleList
                    primaryText={record => record.slug}
                    secondaryText={record => `${t('resources.accPayments.updatedAt')}: ${dateFormat(record.updatedAt)}`}
                />
            ) : (
                <Datagrid optimized>
                    <TextField source="slug" label="resources.accPayments.slug" />
                    <TextField source="amount" label="resources.accPayments.amount" />
                    <FunctionField
                        label="resources.accPayments.updatedAt"
                        render={(record) => dateFormat(record.updatedAt)}
                    />
                    <EditButton />
                </Datagrid>
            )}
        </List>
    );
}
