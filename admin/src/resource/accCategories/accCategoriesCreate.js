import { Create } from 'react-admin';
import Form from './accCategoriesForm';

const AccCategoriesCreate = (props) => (
    <Create {...props}>
        <Form />
    </Create>
);

export default AccCategoriesCreate;
