import { Edit, TextInput } from 'react-admin';
import Form from './accCategoriesForm';

const AccCategoriesEdit = (props) => {
    return (
        <Edit {...props} redirect={false} mutationMode="pessimistic">
            <Form />
        </Edit>
    );
};

export default AccCategoriesEdit;
