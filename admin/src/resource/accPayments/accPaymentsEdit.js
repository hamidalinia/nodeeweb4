import { Edit, useTranslate, useEditController, TextInput } from 'react-admin';
import Form from './accPaymentsForm';

const accPaymentsEdit = (props) => {
    const translate = useTranslate();
    const { record } = useEditController({
        resource: 'accPayments',
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

export default accPaymentsEdit;
