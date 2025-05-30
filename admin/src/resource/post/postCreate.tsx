import { Create, useCreateContext } from 'react-admin';

import Form from './postForm';

const Component = () => {
  const { record, resource } = useCreateContext();

  return <Form record={record} Resource_Name={resource}></Form>;
};

const CreateComponent = (props) => (
  <Create {...props}>
    <Component />
  </Create>
);

export default CreateComponent;
