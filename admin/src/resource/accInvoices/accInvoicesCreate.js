import { Create } from 'react-admin';
import Form from './accInvoicesForm';

const AccInvoicesCreate = (props) => (
    <Create {...props}>
        <Form />
    </Create>
);

export default AccInvoicesCreate;
