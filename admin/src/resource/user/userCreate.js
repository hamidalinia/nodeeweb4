import {
  BooleanField,
  Edit,
  Create,
  Datagrid,
  TextField,
    SelectInput,
  ReferenceInput,
  EmailField,
  DateField,
  EditButton,
  DeleteButton,
  TextInput,
  PasswordInput,
  BooleanInput,
  useTranslate
} from 'react-admin';
import { List, SimpleForm } from '@/components';

export const userCreate = (props) => {
  const translate=useTranslate();

  return(
    <Create {...props}>
      <SimpleForm>
        <TextInput disabled source="id" label={translate("resources.user._id")} />
        <TextInput source="nickname" label={translate("resources.user.nickname")} />
        <TextInput source="email" type="email" label={translate("resources.user.email")} />
        <TextInput source="username" label={translate("resources.user.username")} />
          <SelectInput
              label={translate("resources.user.role")}
              defaultValue={"post"}
              source="role"
              choices={[
                  {id: "admin", name: translate("resources.user.admin")},
                  {id: "agent", name: translate("resources.user.agent")}
              ]}
          />
        <ReferenceInput
          label={translate("resources.user.organisationRole")}
          source="organisationRole"
          reference="organisationRole"
          perPage={1000}
          allowEmpty>
          <SelectInput optionText={"name." + translate("lan")} optionValue="id"/>
        </ReferenceInput>
        <PasswordInput source="password" label={translate("resources.user.password")} />
        <BooleanInput source="active" label={translate("resources.user.active")} />
      </SimpleForm>
    </Create>
  );
}
export default userCreate;
