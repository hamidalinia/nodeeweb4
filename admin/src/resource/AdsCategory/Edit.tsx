import { Edit, useEditContext, useTranslate, TextInput } from 'react-admin';

import Form from './Form';

const Component = () => {
  const translate = useTranslate();
  const { record } = useEditContext();

  return (
    <Form record={record}>
      <TextInput source="_id" label={translate('_id')} fullWidth disabled />
    </Form>
  );
};

export default function EditComponent(props) {
  return (
    <Edit {...props} redirect="list" mutationMode="pessimistic">
      <Component />
    </Edit>
  );
}
