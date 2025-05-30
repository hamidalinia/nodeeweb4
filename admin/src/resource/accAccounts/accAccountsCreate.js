import { Create } from 'react-admin';
import Form from './accAccountsForm';

const AccAccountsCreate = (props) => (
    <Create {...props}>
        <Form />
    </Create>
);

export default AccAccountsCreate;
