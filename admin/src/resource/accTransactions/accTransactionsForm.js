import React, { useEffect } from "react";
import {
    DeleteButton,
    SaveButton,
    SelectInput,
    TextInput,
    Toolbar,
    useTranslate,
    DateInput,
    NumberInput,
    ReferenceInput,
    useNotify,
    useRedirect,
} from 'react-admin';
import { useForm, useFormContext } from 'react-hook-form';

import { SimpleForm, CreateOrShowCustomer } from '@/components';
import { Val } from '@/Utils';

const CustomToolbar = (props) => (
    <Toolbar {...props}>
        <SaveButton alwaysEnable />
        <DeleteButton mutationMode="pessimistic" />
    </Toolbar>
);

const ControlledTextInput = ({ value, ...props }) => {
    const { setValue } = useFormContext();

    useEffect(() => {
        setValue(props.source, value);
        // eslint-disable-next-line
    }, [value]);

    return <TextInput {...props} />;
};

const AccTransactionForm = ({ children, ...props }) => {
    const translate = useTranslate();
    const redirect = useRedirect();
    const notify = useNotify();

    const { setValue, getValues } = useForm({
        defaultValues: {
            customerId: props?.record?.customer,
            sum: props?.record?.sum,
            amount: props?.record?.amount,
            phoneNumber: ""
        },
    });

    const handleCustomer = (value) => {
        setValue('customerId', value);
    };

    return (
        <SimpleForm toolbar={<CustomToolbar />}>
            {/* شرح تراکنش */}
            <TextInput
                source="description"
                label={translate('resources.accTransaction.description')}
                fullWidth
                validate={Val.req}
            />

            {/* بدهکار - حساب و مبلغ */}
            <ReferenceInput
                source="debit.account"
                reference="accAccounts"
                validate={Val.req}
                fullWidth
            >
                <SelectInput
                    label={translate('resources.accTransaction.debitAccount')}
                    optionText="title"
                />
            </ReferenceInput>

            <TextInput
                source="debit.amount"
                label={translate('resources.accTransaction.debitAmount')}
                validate={Val.req}
                fullWidth
                format={v => {
                    if (!v) return "";

                    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }}
                parse={v => {
                    if (!v) return "";

                    return v.toString().replace(/,/g, "");

                }}
            />

            {/* بستانکار - حساب و مبلغ */}
            <ReferenceInput
                source="credit.account"
                reference="accAccounts"
                validate={Val.req}
                fullWidth
            >
                <SelectInput
                    label={translate('resources.accTransaction.creditAccount')}
                    optionText="title"
                />
            </ReferenceInput>

            <TextInput
                source="credit.amount"
                label={translate('resources.accTransaction.creditAmount')}
                validate={Val.req}
                fullWidth
                format={v => {
                    if (!v) return "";

                    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }}
                parse={v => {
                    if (!v) return "";

                    return v.toString().replace(/,/g, "");

                }}
            />

            {/* دسته‌بندی (اختیاری) */}
            <ReferenceInput
                source="category"
                reference="accCategories"
                fullWidth
                allowEmpty
            >
                <SelectInput
                    label={translate('resources.accTransaction.category')}
                    optionText="title"
                />
            </ReferenceInput>

            {/* مشتری (اختیاری) */}
            <CreateOrShowCustomer
                handleCustomer={handleCustomer}
                source="customer"
            />

            <ControlledTextInput
                className="d-none"
                source="customer"
                value={getValues('customer')}
                onChange={(e) => setValue("customer", e?.target?.value)}
                label={translate('resources.accTransaction.customer')}
            />

            {/* سفارش (اختیاری) */}
            <ReferenceInput
                source="order"
                reference="order"
                fullWidth
                allowEmpty
            >
                <SelectInput
                    label={translate('resources.accTransaction.order')}
                    optionText="orderNumber"
                />
            </ReferenceInput>

            {/* تاریخ تراکنش */}
            <DateInput
                source="date"
                label={translate('resources.accTransaction.date')}
                fullWidth
                validate={Val.req}
            />

            {/* شماره مرجع */}
            <TextInput
                source="refNo"
                label={translate('resources.accTransaction.refNo')}
                fullWidth
            />

            {/* توضیحات اضافی */}
            <TextInput
                source="note"
                label={translate('resources.accTransaction.note')}
                multiline
                fullWidth
            />

            {children}
        </SimpleForm>
    );
};

export default AccTransactionForm;
