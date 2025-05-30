import { Edit, useTranslate, TextInput, useEditContext, SimpleForm } from 'react-admin';
import Form from './accTransactionsForm';

const CustomIdField = () => {
    const translate = useTranslate();
    const { record } = useEditContext();

    if (!record) return null;

    return (
        <TextInput
            source="_id"
            label={translate('_id')}
            fullWidth
            disabled
            className="mb-20"
        />
    );
};

const AccTransactionsEdit = (props) => {
    return (
        <Edit {...props} redirect={false} mutationMode="pessimistic">
            <SimpleForm>
                <Form /> {/* فرم سفارشی شما */}
                <CustomIdField />
            </SimpleForm>
        </Edit>
    );
};

export default AccTransactionsEdit;
