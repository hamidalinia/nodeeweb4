import { Create } from 'react-admin';
import Form from './accPaymentsForm';

const accPaymentsCreate = (props) => (
    <Create {...props}>
        <Form />
    </Create>
);

export default accPaymentsCreate;
