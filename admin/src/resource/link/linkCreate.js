import {

    Create,
    Datagrid,
    DateField,
    DeleteButton,
    Edit,
    EditButton,
    ReferenceField,
    ReferenceInput,
    RefreshButton,
    SelectInput,
    ShowButton,
    TextField,
    TextInput,
  useTranslate
} from 'react-admin';
import CardActions from '@mui/material/CardActions';
import {Textsms as Icon,Send} from '@mui/icons-material';
import Button from '@mui/material/Button';
import axios from 'axios';
import {List, SimpleForm} from '@/components';

const SmsEditActions = ({basePath, data, resource}) => (
    <CardActions>
        <ShowButton record={data}/>
        <RefreshButton/>
    </CardActions>
);




export const linkCreate = (props) => {
  const translate = useTranslate();

  return(
    <Create {...props}>
      <SimpleForm>


        <TextInput source="from" label={translate("resources.link.from")} fullWidth ltr className={'ltr'}/>
        <TextInput source="to" label={translate("resources.link.to")} fullWidth ltr className={'ltr'}/>
          <SelectInput
              label={translate("resources.link.status")}
              fullWidth

              source="status"
              choices={[
                  { id: "301", name: "301" },
                  { id: "302", name: "302" },
              ]}
          />
       </SimpleForm>
    </Create>
  );
};


export default linkCreate;
