import { Create } from 'react-admin';

import Form from './pageForm';

const create = (props) => (
  <Create {...props}>
    <Form></Form>
  </Create>
);

export default create;
