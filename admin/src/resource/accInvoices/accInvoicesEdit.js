import { Edit, useEditController, TextInput, useTranslate } from 'react-admin';
import Form from './accInvoicesForm';

const AccInvoicesEdit = (props) => {
    const translate = useTranslate();
    const { record } = useEditController({
        resource: 'accInvoices',
    });

    return (
        <Edit {...props} redirect={false} mutationMode="pessimistic">
            <Form record={record}>
                <TextInput
                    source="_id"
                    label={translate('_id')}
                    className="mb-20"
                    fullWidth
                    disabled
                />
            </Form>
        </Edit>
    );
};

export default AccInvoicesEdit;
