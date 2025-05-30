import {useCallback, useState} from 'react';
import {
    AutocompleteInput,
    CreateButton,
    Datagrid,
    downloadCSV,
    EditButton,
    ExportButton,
    FilterButton,
    FunctionField,
    Link,
    ListContextProvider,
    NumberInput,
    ReferenceInput,
    SelectInput,
    ShowButton,
    SimpleList,
    TextInput,
    TopToolbar,
    useListContext,
    useTranslate
} from 'react-admin';
import {Chip, Divider, Tab, Tabs, useMediaQuery} from '@mui/material';
import moment from 'jalali-moment';
import jsonExport from 'jsonexport/dist';
import {useSelector} from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {List, OrderPaymentStatus, OrderTabs, ReactAdminJalaliDateInput,} from '@/components';
import {dateFormat} from '@/functions';

const exporter = (posts) => {

    let allpros = [];
    const postsForExport = posts.map((post, i) => {
        const {backlinks, author, ...postForExport} = post; // omit backlinks and author

        postForExport._id = post._id; // add a field
        // console.log(post.title)

        // if (post.title)
        // postForExport.title = post.title.fa; // add a field
        // postForExport.type = post.type; // add a field
        // console.log("i", i);
        // postForExport.combinations = post.combinations; // add a field

        allpros.push({
            _id: post._id,
            requestNumber: post.slug,
            paymentStatus: post.paymentStatus,
            status: post.status,
            sum: post.sum,
            amount: post.amount,
            gateway: post.gateway,
            requestCount:
                post.customer && post.customer.requestCount
                    ? post.customer.requestCount
                    : null,
            firstName:
                post.customer && post.customer.firstName
                    ? post.customer.firstName
                    : null,
            lastName:
                post.customer && post.customer.lastName ? post.customer.lastName : null,
            phoneNumber:
                post.customer && post.customer.phoneNumber
                    ? post.customer.phoneNumber
                    : null,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        });
    });
    console.log('postsForExport', allpros);
    jsonExport(
        allpros,
        {
            headers: [
                '_id',
                'requestNumber',
                'requestCount',
                'firstName',
                'lastName',
                'phoneNumber',
                'amount',
                'sum',
                'createdAt',
                'updatedAt',
                'status',
                'paymentStatus',
            ], // request fields in the export
        },
        (err, csv) => {
            console.log('ForExport', allpros);
            const BOM = '\uFEFF';
            downloadCSV(`${BOM} ${csv}`, 'requests'); // download as 'posts.csv` file
        }
    );
};
const ListActions = (props) => {
    // All configuration options are optional
    const config = {
        // Enable logging
        logging: true,
        // Disable "import new" button
        // disableImportNew: false,
        // Disable "import overwrite" button
        // disableImportOverwrite: false,
        // // A function to translate the CSV rows on import
        // preCommitCallback?: (action: "create" | "overwrite", values: any[]) => Promise<any[]>;
        // // A function to handle row errors after import
        // postCommitCallback?: (error: any) => void;
        // Transform rows before anything is sent to dataprovider
        transformRows: (csvRows) => {
            console.log('csvRows', csvRows);
            // let update = [], create = [];
            let array = [];
            const postsForExport = csvRows.map((row) => {
                console.log('row', row);

                row._id = row[' _id'];
                if (row._id)
                    array.push({
                        _id: row._id,
                    });
                // else
                // delete row.photos;
                delete row[' _id'];
                delete row['id'];
                delete row.firstCategory_name_ru;
                delete row.secondCategory_name_ru;
                delete row.thirdCategory_name_ru;
                row.title = {
                    en: row.title_en,
                    fa: row.title_fa,
                    ru: row.title_ru,
                    uz: row.title_uz,
                };
                delete row.title_en;
                delete row.title_ru;
                delete row.title_uz;
                delete row.createdAt;
                delete row.updatedAt;
                // if (row._id) {
                //     update.push(row);
                // } else {
                //     create.push(row);
                // }
                // if()

                return row;
            });
            console.log('ForImport', postsForExport);
            // API.post('/product/importproductsfromcsv', JSON.stringify(postsForExport))
            //     .then(({data = {}}) => {
            // const refresh = useRefresh();
            // refresh();
            // alert('it is ok');
            // window.location.reload();
            // if (data.success) {
            //     values = [];
            //     valuess = [];
            // }
            // })
            // .catch((err) => {
            //     console.log('error', err);
            // });
        },
        validateRow: async (row) => {
            console.log('row', row);
            if (row.id) {
                // throw new Error("AAAA");
            }
        },
        postCommitCallback: (reportItems) => {
            console.log('reportItems', {reportItems});
        },
        // Async function to Validate a row, reject the promise if it's not valid
        parseConfig: {
            dynamicTyping: true,
            // complete: function(results, file) {
            //     console.log("Parsing complete:", results, file);
            // },
            // preview:1
        },
    };
    return (
        <TopToolbar>
            <FilterButton/>
            <CreateButton/>
            <ExportButton maxResults={1000}/>
            {/*<CreateButton basePath={basePath} />*/}
            {/*<ImportButton {...props} {...config} />*/}
            {/* Add your custom actions */}
            {/*<Button*/}
            {/*onClick={() => {*/}
            {/*alert('Your custom action');*/}
            {/*}}*/}
            {/*label="Show calendar"*/}
            {/*>*/}
            {/*<IconEvent/>*/}
            {/*</Button>*/}
        </TopToolbar>
    );
};
export default function RequestList(props) {
    return (
        <List
            actions={<ListActions/>}
            filters={[
                <SelectInput
                    source="paymentStatus"
                    label="resources.request.paymentStatus"
                    emptyValue=""
                    choices={OrderPaymentStatus()}
                    alwaysOn
                />,
                <ReactAdminJalaliDateInput
                    fullWidth
                    source="date_gte"
                    label="resources.request.date_gte"
                    format={(formValue) =>
                        moment.from(formValue, 'fa', 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
                    }
                    parse={(inputValue) =>
                        moment.from(inputValue, 'fa', 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
                    }
                />,
                <TextInput
                    fullWidth
                    source="date_gte"
                    label="resources.request.date_gte"
                />,
                <ReactAdminJalaliDateInput
                    fullWidth
                    source="date_lte"
                    label="resources.request.date_lte"
                    format={(formValue) =>
                        moment.from(formValue, 'fa', 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
                    }
                    parse={(inputValue) =>
                        moment.from(inputValue, 'fa', 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
                    }
                />,
                <TextInput
                    fullWidth
                    source="date_lte"
                    label="resources.request.date_lte"
                />,
                <NumberInput
                    fullWidth
                    source="requestCount"
                    label="resources.request.requestCount"
                />,
                <TextInput
                    fullWidth
                    source="requestNumber"
                    label="resources.request.requestNumber"
                />,
                <ReferenceInput
                    label="resources.request.customer"
                    source="customer"
                    reference="customer">
                    <AutocompleteInput
                        optionText={(r) =>
                            `${r.firstName ? r.firstName : ''} ${
                                r.lastName ? r.lastName : ''
                                }`
                        }
                    />
                </ReferenceInput>,
            ]}
            exporter={exporter}>
            <TabbedDatagrid/>
        </List>
    );
}

const TabbedDatagrid = (props) => {
    const listContext = useListContext();
    const {filterValues, setFilters, displayedFilters} = listContext;
    const t = useTranslate();
    const [role, setRole] = useState(localStorage.getItem('role')); // Default mode is 'advanced'

    // @ts-ignore
    const themeData = useSelector((st) => st.themeData);

    const totals = 0;
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const handleSelect = useCallback(
        (e, v) => {
            console.log('e', e)
            console.log('v', v?.props?.value)

            setFilters({...filterValues, status: v?.props?.value}, displayedFilters);
        },
        [displayedFilters, filterValues, setFilters]
    );
    const handleChange = useCallback(
        (e, v) => {
            console.log('e', e)
            console.log('v', v)
            setFilters({...filterValues, status: v}, displayedFilters);
        },
        [displayedFilters, filterValues, setFilters]
    );
// console.log("choice",choice)
    return (
        <>
            {isSmall ? (<Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filterValues.status}
                    label={t('resources.request.status')}
                    onChange={handleSelect}
                >{OrderTabs().map((choice) => (<MenuItem key={choice.id} value={choice.id}>{totals[choice.name]
                ? `${choice.name} (${totals[choice.name]})`
                : choice.name}</MenuItem>))}
                </Select>) :
                (<Tabs
                    variant="fullWidth"
                    centered
                    value={filterValues.status}
                    indicatorColor="primary"
                    onChange={handleChange}>
                    {OrderTabs().map((choice) => (
                        <Tab
                            key={choice.id}
                            label={
                                totals[choice.name]
                                    ? `${choice.name} (${totals[choice.name]})`
                                    : choice.name
                            }
                            value={choice.id}
                        />
                    ))}
                </Tabs>)}
            <Divider/>

            <ListContextProvider value={listContext}>
                {isSmall ? (
                    <SimpleList
                        primaryText={record => <div>
                            <div className={"d-dfgfd"}>
                      <span className={'gap-10'}><Chip
                          className={record.status}
                          label={t('pos.OrderStatus.' + record.status)}
                      />
                      <Chip
                          className={record.paymentStatus}
                          label={t('pos.OrderPaymentStatus.' + record.paymentStatus)}
                      /></span>
                                <span>#{record?.requestNumber}</span>
                            </div>
                            <div>{record?.customer?.firstName + ' ' + record?.customer?.lastName}</div>
                            <div>{record?.customer?.phoneNumber}</div>
                            {(role != 'agent' && record?.agent?.username) && (
                                <Link
                                    to={`/admin/${record?.agent?._id}/show`}
                                    target="_blank">
                                    {record?.agent?.nickname}
                                </Link>
                            )}
                            <div><span>Source: </span>{record?.source}</div>

                        </div>}
                        secondaryText={record => <div className={'d-dfgfd'}>
                            <span>{dateFormat(record.createdAt)}</span><span>{record?.amount?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ' + t(themeData.currency)}</span>
                        </div>}
                        // tertiaryText={record => record?.amount?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ' + t(themeData.currency)}
                        linkType={"edit"}
                    />
                ) : (<Datagrid {...props} optimized>
                    <FunctionField
                        label="resources.request.requestNumber"
                        render={(record) => (
                            <>
                                <div>
                                    {record.requestNumber}
                                </div>
                                <div>
                                    source: {record.source}
                                </div>
                            </>
                        )}
                    />
                    <FunctionField
                        label="resources.request.customerData"
                        render={(record) => (
                            <div>
                                {record.customer && (
                                    <div>
                                        {record.customer.firstName && (
                                            <div>{record.customer.firstName}</div>
                                        )}

                                        {record.customer.lastName && (
                                            <div>{record.customer.lastName}</div>
                                        )}
                                        {record.customer.phoneNumber && (
                                            <Link
                                                to={`/customer/${record.customer._id}/show`}
                                                target="_blank">
                                                {record.customer.phoneNumber}
                                            </Link>
                                        )}

                                        <div>
                                            <span>{t('resources.request.requestCount') + ':'}</span>
                                            {record.customer?.requestCount}
                                        </div>
                                        {(role != 'agent' && record?.agent?.username) && (
                                            <Link
                                                to={`/admin/${record?.agent?._id}/show`}
                                                target="_blank">
                                                {record?.agent?.nickname}
                                            </Link>
                                        )}
                                    </div>
                                )}

                                {!record.customer && record.customer_data && (
                                    <div>
                                        {record.customer_data.firstName && (
                                            <div>{record.customer_data.firstName}</div>
                                        )}
                                        {record.customer_data.lastName && (
                                            <div>{record.customer_data.lastName}</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    />
                    <FunctionField
                        label="resources.request.sum"
                        render={(record) => {
                            return (
                                record &&
                                record.sum &&
                                record.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                                ' ' +
                                t(themeData.currency)
                            );
                        }}
                    />
                    <FunctionField
                        label="resources.request.amount"
                        render={(record) => {
                            return (
                                record &&
                                record.amount &&
                                record.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
                                ' ' +
                                t(themeData.currency)
                            );
                        }}
                    />

                    <FunctionField
                        label="resources.request.status"
                        render={(record) => (
                            <Chip
                                className={record.status}
                                label={t('pos.OrderStatus.' + record.status)}
                            />
                        )}
                    />

                    <FunctionField
                        label="resources.request.paymentStatus"
                        render={(record) => (
                            <Chip
                                className={record.paymentStatus}
                                label={t('pos.OrderPaymentStatus.' + record.paymentStatus)}
                            />
                        )}
                    />
                    {/*<SelectField source="status" choices={OrderStatus()}*/}
                    {/*label="resources.request.status' optionText={<StatusField/>}*/}
                    {/*/>*/}
                    {/*<SelectField source="paymentStatus" choices={OrderPaymentStatus()}*/}
                    {/*label="resources.request.paymentStatus' optionText={<PaymentStatusField/>}*/}
                    {/*/>*/}

                    <FunctionField
                        label="resources.request.date"
                        render={(record) => (
                            <>
                                <div>
                                    {t('resources.request.createdAt') +
                                    ': ' +
                                    `${dateFormat(record.createdAt)}`}
                                    <br/>
                                    {t('resources.request.updatedAt') +
                                    ': ' +
                                    `${dateFormat(record.updatedAt)}`}
                                </div>
                            </>
                        )}
                    />
                    <FunctionField
                        label="resources.request.action"
                        render={(record) => (
                            <>
                                {record?.editable && <EditButton/>}
                                <ShowButton/>
                            </>
                        )}
                    />

                </Datagrid>)}
            </ListContextProvider>
        </>
    );
};
