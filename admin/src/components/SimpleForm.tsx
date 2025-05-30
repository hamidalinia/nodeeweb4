import { SimpleForm, SimpleFormProps } from 'react-admin';

export default (props: SimpleFormProps) => (
  <SimpleForm {...props} warnWhenUnsavedChanges />
);
