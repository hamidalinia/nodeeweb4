import {
    Datagrid,
    TextField,
    SearchInput,
    Filter,
    useTranslate,
    EditButton,
    FunctionField,
} from 'react-admin';
import { List } from '@/components';
import { dateFormat } from '@/functions';

const PostFilter = (props) => {
    const t = useTranslate();

    return (
        <Filter {...props}>
            <SearchInput
                source="Search"
                placeholder={t('resources.accCategory.search')}
                alwaysOn
            />
        </Filter>
    );
};

const accCategoryList = (props) => {
    const t = useTranslate();

    return (
        <List {...props} filters={<PostFilter />}>
            <Datagrid>
                <TextField source="code" label={t('resources.accCategory.code')} />
                <TextField source="title" label={t('resources.accCategory.title')} />
                <FunctionField
                    label={t('resources.accCategory.level')}
                    render={(record) =>
                        ({
                            group: 'گروه',
                            kol: 'کل',
                            moein: 'معین',
                            tafsili: 'تفصیلی'
                        }[record.level] || record.level)
                    }
                />

                <FunctionField
                    label={t('resources.accCategory.nature')}
                    render={(record) =>
                        ({
                            asset: 'دارایی',
                            liability: 'بدهی',
                            equity: 'حقوق صاحبان سهام',
                            income: 'درآمد',
                            expense: 'هزینه'
                        }[record.nature] || record.nature)
                    }
                />

                <FunctionField
                    label={t('resources.accCategory.type')}
                    render={(record) =>
                        ({
                            debit: 'بدهکار',
                            credit: 'بستانکار',
                            both: 'هردو'
                        }[record.type] || record.type)
                    }
                />

                <FunctionField
                    label={t('resources.accCategory.parent')}
                    render={(record) => record.parent?.title || '-'}
                />
                <FunctionField
                    label={t('resources.accCategory.updatedAt')}
                    render={(record) => dateFormat(record.updatedAt)}
                />
                <EditButton />
            </Datagrid>
        </List>
    );
};

export default accCategoryList;
