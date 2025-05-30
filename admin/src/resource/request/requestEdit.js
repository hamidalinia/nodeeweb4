import {useState} from 'react';
import {
    ArrayField,
    Datagrid,
    Edit,
    FunctionField,
    Link,
    SelectInput,
    Show,
    SimpleShowLayout,
    TextField,
    TextInput,
    useEditController,
    useTranslate
} from 'react-admin';
import {Box, Button, CardActions, Chip} from '@mui/material';
import {HelpRounded} from '@mui/icons-material';

import {OrderPaymentStatus, OrderStatus, PrintOrder, FishPrintOrder,PrintPack, SimpleForm, Transactions,} from '@/components';

export default function RequestEdit(props) {
    const translate = useTranslate();
    const {id} = props;
    const [state, setState] = useState('start');
    const [role, setRole] = useState(localStorage.getItem('role')); // Default mode is 'advanced'

    const {record, save, isLoading} = useEditController({
        resource: 'request',
        id,
    });
    const PostEditActions = ({basePath, data, resource}) => (
        <CardActions>
            {/*<TransactionCreate record={record} />*/}
            <Button
                color="primary"
                icon={<HelpRounded/>}
                onClick={() => {
                    setState('print');
                }}>
                پرینت فاکتور
            </Button>
            <Button
                color="primary"
                icon={<HelpRounded/>}
                onClick={() => {
                    setState('fishprint');
                }}>
                فیش پرینت
            </Button>
            <Button
                color="primary"
                icon={<HelpRounded/>}
                onClick={() => {
                    setState('printpack');
                }}>
                پرینت رسید حمل و نقل
            </Button>
        </CardActions>
    );
    return (
        <>
            <Show actions={<PostEditActions/>} {...props}>
                {/*<div id={'theprintdiv'}>*/}

                <SimpleShowLayout>
                    {state == 'start' && [
                        <Box>
                            <TextField source="requestNumber" label={'شماره سفارش'}/>
                            ,
                            <FunctionField
                                label="نام"
                                render={(record) =>
                                    `${record.customer_data && record.customer_data.firstName}`
                                }
                            />
                            ,
                            <FunctionField
                                label="نام خانوادگی"
                                render={(record) =>
                                    `${record.customer_data && record.customer_data.firstName}`
                                }
                            />
                            ,
                            <ArrayField source="card" label={'محتوای سبد خرید'}>
                                <Datagrid optimized>
                                    <FunctionField
                                        label="عنوان محصول"
                                        render={(record) => {
                                            let link = record._id;
                                            var c = record._id.split('DDD');
                                            if (c[0]) {
                                                link = c[0];
                                            }
                                            return (
                                                <Link
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    to={`/product/${link}/show`}>
                                                    {record.title &&
                                                    (record.title.fa ? record.title.fa : record.title)}
                                                </Link>
                                            );
                                        }}
                                    />

                                    <FunctionField
                                        label="تعداد"
                                        render={(record) =>
                                            `${
                                                record.count
                                                    ? record.count
                                                        .toString()
                                                    : ''
                                                }`
                                        }
                                    />
                                    <FunctionField
                                        label="قیمت"
                                        render={(record) =>
                                            `${
                                                record.price
                                                    ? record.price
                                                        .toString()
                                                        .replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')
                                                    : ''
                                                }`
                                        }
                                    />
                                    <FunctionField
                                        label="قیمت با تخفیف"
                                        render={(record) =>
                                            `${
                                                record.salePrice
                                                    ? record.salePrice
                                                        .toString()
                                                        .replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')
                                                    : ''
                                                }`
                                        }
                                    />
                                </Datagrid>
                            </ArrayField>
                        </Box>,
                    ]}
                    {state == 'print' && <PrintOrder record={record} setStart={(e) => setState('start')}/>}
                    {state == 'fishprint' && <FishPrintOrder record={record} setStart={(e) => setState('start')}/>}
                    {state == 'printpack' && <PrintPack record={record} setStart={(e) => setState('start')}/>}
                </SimpleShowLayout>
            </Show>
            {state == 'start' && <Edit {...props}>
                <SimpleForm>
                    {state == 'start' && [
                        ,
                        <TextInput
                            source="customer_data.internationalCode"
                            label={'کد ملی'}
                        />,
                        <FunctionField
                            label="شماره تماس مشتری"
                            render={(record) =>
                                `${record.customer_data && record.customer_data.phoneNumber}`
                            }
                        />,

                        // <FunctionField label="پرداختی کل"
                        //                render={record => record.amount.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}/>
                        // ,
                        <TextField
                            source="billingAddress.Title"
                            label={'عنوان آدرس'}
                            fullWidth
                        />,
                        <TextInput
                            source="billingAddress.PhoneNumber"
                            label={'شماره تماس ارسال'}
                            fullWidth
                        />,
                        <TextInput
                            source="billingAddress.State"
                            label={'استان'}
                            fullWidth
                        />,
                        <TextInput source="billingAddress.City" label={'شهر'} fullWidth/>,
                        <TextInput
                            source="billingAddress.StreetAddress"
                            label={'آدرس'}
                            fullWidth
                        />,
                        <TextInput
                            source="billingAddress.PostalCode"
                            label={'کد پستی'}
                            fullWidth
                        />,
                        <TextInput
                            source="customer_data.phoneNumber"
                            label={'شماره موبایل مشتری'}
                            fullWidth
                        />,
                        <TextInput
                            source="deliveryDay.description"
                            label={'توضیحات ارسال'}
                            fullWidth
                        />,
                        <TextInput
                            source="deliveryDay.title"
                            label={'نحوه ارسال'}
                            fullWidth
                        />,
                        <FunctionField
                            label={translate('resources.request.paymentStatus')}
                            render={(record) => {
                                return (
                                    <Chip
                                        source="paymentStatus"
                                        className={record.paymentStatus}
                                        label={translate(
                                            'pos.OrderPaymentStatus.' + record.paymentStatus
                                        )}
                                    />
                                );
                            }}
                        />,
                    ]}
                    {/*<TextInput disabled source="id"/>*/}
                    <SelectInput
                        label={translate('resources.request.paymentStatus')}
                        fullWidth
                        className={'mb-20'}
                        source="paymentStatus"
                        optionValue="id"
                        optionText="name"
                        choices={OrderPaymentStatus()}
                        translateChoice={true}
                    />
                    <SelectInput
                        label={translate('resources.request.status')}
                        fullWidth
                        className={'mb-20'}
                        source="status"
                        choices={OrderStatus()}
                    />
                    <TextInput
                        fullWidth
                        // record={scopedFormData}

                        source={'amount'}
                        className={'ltr'}
                        label={translate('resources.request.amount')}
                        format={(v) => {
                            if (!v) return '';

                            return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        }}
                        parse={(v) => {
                            if (!v) return '';

                            return v.toString().replace(/,/g, '');
                        }}
                    />
                    <TextInput
                        fullWidth
                        source={'deliveryTrackingCode'}
                        className={'ltr'}
                        label={translate('resources.request.deliveryTrackingCode')}
                    />
                    <FunctionField
                        label="extraFields"
                        className={"extraFields-width100"}
                        fullWidth
                        render={(record) => {
                            if (record?.extraFields) {

                                let extraFields = Object.keys(record?.extraFields)
                                return <table className={'extraFields'}>{extraFields?.map((extraField) => {
                                    return <tr>
                                        <td>{extraField}</td>
                                        <td>{record?.extraFields[extraField]}</td>
                                    </tr>;
                                })}</table>
                            }

                        }}
                    />
                    {/*<TextField source="status"/>*/}
                    {/*<TextField source="sum"/>*/}
                    {/*<TextField source="customer_data.country"/>*/}
                    {/*<TextField source="customer_data.ip"/>*/}
                    {/*<DateField source="updatedAt"/>*/}
                </SimpleForm>
                {role != 'agent' &&
                <Transactions isEdit/>}
            </Edit>}
        </>
    );
}
