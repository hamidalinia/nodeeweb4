import { Edit, useEditContext, useTranslate, TextInput } from 'react-admin';
import _get from 'lodash/get';

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

const TransformData = (data) => {
  const mojavez = _get(data, 'data.mojavez', '') || '';
  console.log('sdf', mojavez);
  return {
    ...data,
    data: {
      ...data.data,
      mojavez: Array.isArray(mojavez)
        ? mojavez
        : mojavez.split(',').map((i) => i.trim()),
    },
  };
};

export default function EditComponent(props) {
  return (
    <Edit
      {...props}
      redirect="list"
      mutationMode="pessimistic"
      transform={TransformData}>
      <Component />
    </Edit>
  );
}
