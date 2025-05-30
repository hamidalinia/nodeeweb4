import {
    Datagrid,
    EditButton,
    Filter,
    FunctionField,
    Link,
    SearchInput,
    SimpleList,
    TextField,
    useTranslate,
} from 'react-admin';

import {Button, useMediaQuery} from '@mui/material';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import EditIcon from '@mui/icons-material/Edit';
import API from '@/functions/API';
import {dateFormat} from '@/functions';

import {List, ShowLink} from '@/components';

const PostFilter = (props) => {
    const translate = useTranslate();

    return (
        <Filter {...props}>
            <SearchInput
                source="Search"
                placeholder={translate('resources.accounting.search')}
                alwaysOn
            />
            <SearchInput
                source="category"
                placeholder={translate('resources.accounting.category')}
                alwaysOn
            />
        </Filter>
    );
};

export default function ListComponent(props) {
    const t = useTranslate();
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));

    return (
        <List {...props} filters={<PostFilter/>}>
            {isSmall ? (
                <SimpleList
                    primaryText={record => <div>
                        <div className={"d-dfgfd"}>
                            <div className="ph">
                                {record?.slug && <div className={'wh'}>
                                    <div className={'wh'}>
                                        <span>{t('resources.accounting.slug')}: </span>
                                        <TextField
                                            source="slug"
                                            label="resources.accounting.slug"
                                        />
                                    </div>
                                    {(record?.path) && <div className={'wh'}>
                                        <span>{t('resources.accounting.path')}: </span>
                                        <TextField
                                            source="path"
                                            label="resources.accounting.path"
                                        /></div>}

                                    <div className="theDate">
                                        {/*<div>*/}
                                            {/*{t('resources.accounting.createdAt') +*/}
                                            {/*': ' +*/}
                                            {/*`${dateFormat(record.createdAt)}`}*/}
                                        {/*</div>*/}
                                        <div>
                                            {t('resources.accounting.updatedAt') +
                                            ': ' +
                                            `${dateFormat(record.updatedAt)}`}
                                        </div>

                                        {record.views && (
                                            <div>
                                                {t('resources.accounting.viewsCount') +
                                                ': ' +
                                                `${record.views.length}`}
                                            </div>
                                        )}
                                    </div>

                                </div>}
                            </div>
                        </div>
                    </div>}
                    secondaryText={record => <div className="ph">
                        <div className={'d-flex'}>
                            <div className={'d-flex-child'}>
                                <Link
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    className={"link-with-icon"}

                                    to={'/builder/accounting/' + record._id}>
                                    <NoteAltIcon/>
                                    <span className={'ml-2 mr-2'}>
                                        {t('resources.accounting.accountingbuilder')}
                                    </span>
                                </Link>
                            </div>
                            <div  className={'d-flex-child'}>
                                <Link
                                    className={"link-with-icon"}
                                    rel="noopener noreferrer"
                                    to={'/accounting/' + record._id}>
                                    <EditIcon/>
                                    <span className={'ml-2 mr-2'}>
                                        {t('resources.accounting.edit')}
                                    </span>
                                </Link>
                            </div>
                            <div>
                                <Button
                                    color="primary"
                                    size="small"
                                    onClick={() => {
                                        // console.log('data', record._id);
                                        API.post('/accounting/copy/' + record._id, null)
                                            .then(({data = {}}) => {
                                                // console.log('data', data._id);
                                                props.history.push('/post/' + data._id);
                                                // ale/rt('done');
                                            })
                                            .catch((err) => {
                                                console.log('error', err);
                                            });
                                    }}>
                                    <ContentCopyIcon/>
                                    <span className={'ml-2 mr-2'}>
                    {t('resources.accounting.copy')}
                  </span>
                                </Button>
                            </div>
                            <div>
                                <Link
                                    to={
                                        '/action?filter=%7B%accounting"%3A"' +
                                        record._id +
                                        '"%7D&order=ASC&accounting=1&peraccounting=10&sort=id/'
                                    }
                                    className={"link-with-icon"}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <PendingActionsIcon/>
                                    <span className={'ml-2 mr-2'}>
                    {t('resources.accounting.activities')}
                  </span>
                                </Link>
                            </div>
                            {/*<div>*/}
                            {/*<DeleteButton/>*/}
                            {/*</div>*/}
                        </div>

                    </div>}
                    linkType={false}

                />
            ) : (<Datagrid optimized>
                <ShowLink base={null}/>
                <TextField source="slug" label="resources.accounting.slug"/>
                <TextField source="path" label="resources.accounting.path"/>

                <FunctionField
                    label="resources.accounting.date"
                    render={(record) => (
                        <div className="theDate">
                            <div>
                                {t('resources.accounting.createdAt') +
                                ': ' +
                                `${dateFormat(record.createdAt)}`}
                            </div>
                            <div>
                                {t('resources.accounting.updatedAt') +
                                ': ' +
                                `${dateFormat(record.updatedAt)}`}
                            </div>

                            {record.views && (
                                <div>
                                    {t('resources.accounting.viewsCount') +
                                    ': ' +
                                    `${record.views.length}`}
                                </div>
                            )}
                        </div>
                    )}
                />
                <FunctionField
                    label="resources.accounting.actions"
                    render={(record) => (
                        <div>
                            <div>
                                <Link
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    to={'/builder/accounting/' + record._id}>
                                    <NoteAltIcon/>
                                    <span className={'ml-2 mr-2'}>
                    {t('resources.accounting.accountingbuilder')}
                  </span>
                                </Link>
                            </div>
                            <div>
                                <EditButton/>
                            </div>
                            <div>
                                <Button
                                    color="primary"
                                    size="small"
                                    onClick={() => {
                                        // console.log('data', record._id);
                                        API.post('/accounting/copy/' + record._id, null)
                                            .then(({data = {}}) => {
                                                // console.log('data', data._id);
                                                props.history.push('/post/' + data._id);
                                                // ale/rt('done');
                                            })
                                            .catch((err) => {
                                                console.log('error', err);
                                            });
                                    }}>
                                    <ContentCopyIcon/>
                                    <span className={'ml-2 mr-2'}>
                    {t('resources.accounting.copy')}
                  </span>
                                </Button>
                            </div>
                            <div>
                                <Link
                                    to={
                                        '/action?filter=%7B%accounting"%3A"' +
                                        record._id +
                                        '"%7D&order=ASC&accounting=1&peraccounting=10&sort=id/'
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <PendingActionsIcon/>
                                    <span className={'ml-2 mr-2'}>
                    {t('resources.accounting.activities')}
                  </span>
                                </Link>
                            </div>
                            {/*<div>*/}
                            {/*<DeleteButton/>*/}
                            {/*</div>*/}
                        </div>
                    )}
                />
            </Datagrid>)}
        </List>
    );
}
