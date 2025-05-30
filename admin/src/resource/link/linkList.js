import {

    Datagrid,
    DateField,
    DeleteButton,
    EditButton,
    TextField,
  useTranslate
} from 'react-admin';

import {List, SimpleForm} from '@/components';

export const linkList = (props) => {
  const translate = useTranslate();
  return(

    <List {...props}>
      <Datagrid>
        <TextField source="from" label={translate('resources.link.from')}/>
        <TextField source="to" label={translate('resources.link.to')}/>
        <TextField source="status" label={translate('resources.link.status')}/>
        <EditButton/>
        <DeleteButton />
      </Datagrid>
    </List>
  );
}

export default linkList;
