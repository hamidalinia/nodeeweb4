import {
  Datagrid,
  EditButton,
  Filter,
  SearchInput,
  TextField,
  useTranslate,
  FunctionField,
} from 'react-admin';
import _get from 'lodash/get';

import { List } from '@/components';

const PostFilter = (props) => {
  const t = useTranslate();

  return (
    <Filter {...props}>
      <SearchInput
        source="search"
        placeholder={t('resources.form.search')}
        alwaysOn
      />
    </Filter>
  );
};

export default function (props) {
  const t = useTranslate();
  const lan = t('lan');

  return (
    <List {...props} filters={<PostFilter />}>
      <Datagrid translate="yes">
        <TextField source={`title.${lan}`} label="resources.post.title" />
        <TextField source="data.number" label="resources.inItem.tarrif" />
        <TextField
          source="data.importduty"
          label="resources.inItem.importduty"
        />
        <FunctionField
          source="customer"
          label="resources.inItem.mojavez"
          render={(r) => {
            const item = _get(r, 'data.mojavez', []) || [];
            return item.join(', ');
          }}
        />

        <FunctionField
          source="customer"
          label="resources.inItem.order"
          render={(r) => {
            const item = r.data || {};
            return `${item.group1 || ''} ${item.emkan || ''}`;
          }}
        />

        <EditButton />
      </Datagrid>
    </List>
  );
}
