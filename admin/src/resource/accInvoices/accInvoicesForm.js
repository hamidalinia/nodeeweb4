// فرم اصلی برای Create و Edit
import { SimpleForm, TextInput } from 'react-admin';
import { useTranslate } from 'react-admin';

const Form = ({ record }) => {
    const translate = useTranslate();

    return (
        <SimpleForm record={record}>
            <TextInput source="title" label={translate('resources.accInvoices.title')} fullWidth />
            <TextInput source="description" label={translate('resources.accInvoices.description')} fullWidth />
        </SimpleForm>
    );
};

export default Form;
