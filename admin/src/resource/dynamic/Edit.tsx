import { memo } from 'react';
import {
  Edit,
  RefreshButton,
  ShowButton,
  TextInput,
  useEditContext,
  useTranslate,
} from 'react-admin';
import CardActions from '@mui/material/CardActions';

import TelegramPushPostButton from '@/components/TelegramPushPostButton';

import Form from './dynamicForm';

const PostEditActions = () => {
  const { record } = useEditContext();
  return (
    <CardActions>
      <ShowButton record={record} />
      <RefreshButton />
      <TelegramPushPostButton record={record} />
    </CardActions>
  );
};

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

function EditComponent() {
  return (
    <Edit
      actions={<PostEditActions />}
      redirect="list"
      mutationMode="pessimistic">
      <Component />
    </Edit>
  );
}

export default memo(EditComponent);
