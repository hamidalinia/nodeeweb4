import { Create } from 'react-admin';

import Form from './Form';

export default function (props) {
  return (
    <Create {...props} redirect="list">
      <Form />
    </Create>
  );
}
