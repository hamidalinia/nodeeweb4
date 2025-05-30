import React from "react";
import {
    TextInput,
    NumberInput,
    BooleanInput,
    SelectInput,
    ReferenceInput,
    SimpleForm,
    useTranslate,
    DateInput
} from 'react-admin';

import { Val } from '@/Utils';

const AccAccountForm = (props) => {
    const translate = useTranslate();

    return (
        <SimpleForm {...props}>

            {/* عنوان حساب */}
            <TextInput
                source="title"
                label={translate('resources.accAccount.title')}
                fullWidth
                validate={Val.req}
            />

            {/* کد حساب (یونیک - اختیاری) */}
            <TextInput
                source="code"
                label={translate('resources.accAccount.code')}
                fullWidth
            />

            {/* دسته‌بندی حساب (دارایی، بدهی و...) */}
            <ReferenceInput
                source="category"
                reference="accCategories"
                label={translate('resources.accAccount.category')}
                fullWidth
                validate={Val.req}
            >
                <SelectInput optionText="title" />
            </ReferenceInput>

            {/* نوع حساب (asset, liability, ...) */}
            <SelectInput
                source="type"
                label={translate('resources.accAccount.type')}
                fullWidth
                validate={Val.req}
                choices={[
                    { id: 'asset', name: 'دارایی' },
                    { id: 'liability', name: 'بدهی' },
                    { id: 'income', name: 'درآمد' },
                    { id: 'expense', name: 'هزینه' },
                    { id: 'equity', name: 'حقوق صاحبان سهام' },
                ]}
            />

            {/* مانده حساب اولیه (اختیاری) */}
            <NumberInput
                source="balance"
                label={translate('resources.accAccount.balance')}
                fullWidth
            />

            {/* واحد پول */}
            <TextInput
                source="currency"
                label={translate('resources.accAccount.currency')}
                fullWidth
                defaultValue="IRR"
            />

            {/* توضیحات */}
            <TextInput
                source="description"
                label={translate('resources.accAccount.description')}
                multiline
                fullWidth
            />

            {/* فعال یا غیرفعال بودن حساب */}
            <BooleanInput
                source="active"
                label={translate('resources.accAccount.active')}
                defaultValue={true}
            />

            {/* تاریخ ساخت (فقط نمایشی یا مدیریت خاص لازم نیست) */}
            <DateInput
                source="createdAt"
                label={translate('resources.accAccount.createdAt')}
                disabled
            />

        </SimpleForm>
    );
};

export default AccAccountForm;
