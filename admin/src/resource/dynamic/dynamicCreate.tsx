import { Create, useCreateContext } from 'react-admin';

import Form from './dynamicForm';

const Component = () => {
  const { record, resource } = useCreateContext();

  return <Form record={record} Resource_Name={resource}></Form>;
};

const CreateComponent = (props) => {
  return (
    <Create {...props}>
      <Component />
    </Create>
  );
};

export default CreateComponent;
