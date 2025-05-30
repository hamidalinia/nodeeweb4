import {
  BooleanField,
  Edit,
  Create,
  Datagrid,
  TextField,
  EmailField,
    SelectInput,
  DateField,
  ReferenceInput,
  EditButton,
  DeleteButton,
  TextInput,
  PasswordInput,
  BooleanInput,
  useTranslate
} from 'react-admin';
import { List, SimpleForm } from '@/components';


export const userEdit = (props) => {
  const translate=useTranslate();

  return(
    <Edit {...props}>
      <SimpleForm>
        <TextInput disabled fullWidth source="id" label={translate("resources.user._id")} />
        <TextInput fullWidth source="nickname" label={translate("resources.user.nickname")} />
        <TextInput fullWidth source="email" type="email" label={translate("resources.user.email")} />
        <TextInput fullWidth source="username" label={translate("resources.user.username")} />
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

        <PasswordInput fullWidth source="password" label={translate("resources.user.password")} />
        <BooleanInput fullWidth source="active" label={translate("resources.user.active")} />
      </SimpleForm>
    </Edit>
  );
}

export default userEdit;
