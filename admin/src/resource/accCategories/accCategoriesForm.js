import React from "react";
import {
    TextInput,
    SelectInput,
    BooleanInput,
    ReferenceInput,
    SimpleForm,
    useTranslate
} from 'react-admin';

import { Val } from '@/Utils';

const AccCategoryForm = (props) => {
    const translate = useTranslate();

    return (
        <SimpleForm {...props}>

            {/* کد حساب */}
            <TextInput
                source="code"
                label={translate('resources.accCategory.code') || 'کد حساب'}
                fullWidth
                validate={Val.req}
            />

            {/* عنوان حساب */}
            <TextInput
                source="title"
                label={translate('resources.accCategory.title') || 'عنوان حساب'}
                fullWidth
                validate={Val.req}
            />

            {/* سطح حساب */}
            <SelectInput
                source="level"
                label={translate('resources.accCategory.level') || 'سطح حساب'}
                choices={[
                    { id: 'group', name: 'گروه' },
                    { id: 'kol', name: 'کل' },
                    { id: 'moein', name: 'معین' },
                    { id: 'tafsili', name: 'تفصیلی' },
                ]}
                fullWidth
                validate={Val.req}
            />

            {/* حساب پدر (اختیاری) */}
            <ReferenceInput
                source="parent"
                reference="accCategories"
                allowEmpty
                label={translate('resources.accCategory.parent') || 'حساب پدر'}
            >
                <SelectInput optionText="title" />
            </ReferenceInput>

            {/* نوع بدهکار/بستانکار */}
            <SelectInput
                source="type"
                label={translate('resources.accCategory.type') || 'نوع بدهکار/بستانکار'}
                choices={[
                    { id: 'debit', name: 'بدهکار' },
                    { id: 'credit', name: 'بستانکار' },
                    { id: 'both', name: 'هردو' },
                ]}
                fullWidth
                defaultValue="both"
            />

            {/* ماهیت حساب */}
            <SelectInput
                source="nature"
                label={translate('resources.accCategory.nature') || 'ماهیت حساب'}
                choices={[
                    { id: 'asset', name: 'دارایی' },
                    { id: 'liability', name: 'بدهی' },
                    { id: 'equity', name: 'حقوق صاحبان سهام' },
                    { id: 'income', name: 'درآمد' },
                    { id: 'expense', name: 'هزینه' },
                ]}
                fullWidth
                validate={Val.req}
            />

            {/* توضیحات */}
            <TextInput
                source="description"
                label={translate('resources.accCategory.description') || 'توضیحات'}
                fullWidth
                multiline
            />

            {/* فعال یا غیرفعال */}
            <BooleanInput
                source="active"
                label={translate('resources.accCategory.active') || 'فعال'}
                defaultValue={true}
            />

        </SimpleForm>
    );
};

export default AccCategoryForm;
