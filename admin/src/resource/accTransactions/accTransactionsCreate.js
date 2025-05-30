import { Create } from 'react-admin';
import Form from './accTransactionsForm';

const AccTransactionsCreate = (props) => (
    <Create {...props}>
        <Form />
    </Create>
);

export default AccTransactionsCreate;
