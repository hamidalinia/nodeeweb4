import { Edit, useTranslate ,TextInput} from 'react-admin';
import Form from './accAccountsForm';

const AccAccountsEdit = (props) => {
    const translate = useTranslate();

    return (
        <Edit {...props} redirect={false} mutationMode="pessimistic">
            <Form>
                <TextInput
                    source="_id"
                    label={translate('_id')}
                    fullWidth
                    disabled
                    className="mb-20"
                />
                {/* بقیه فیلدهای فرم هم همین‌جا یا درون کامپوننت Form باشن */}
            </Form>
        </Edit>
    );
};

export default AccAccountsEdit;
