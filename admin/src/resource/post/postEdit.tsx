import { Edit, useEditContext, useTranslate, TextInput } from 'react-admin';

import Form from './postForm';

const Component = () => {
  const translate = useTranslate();
  const { record, resource } = useEditContext();

  return (
    <Form record={record} Resource_Name={resource}>
      <TextInput
        source="_id"
        label={translate('_id')}
        className="mb-20"
        fullWidth
        disabled
      />
    </Form>
  );
};

export default function PostEdit(props) {
  return (
    <Edit {...props} redirect={false} mutationMode={'pessimistic'}>
      <Component />
    </Edit>
  );
}
