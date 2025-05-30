import {
  Datagrid,
  EditButton,
  Filter,
  ArrayField,
  SearchInput,
  ShowButton,
  TextField,
  useTranslate,
  SingleFieldList,
  ChipField,
  SelectField,
  FunctionField,
  Link,
} from 'react-admin';

import { List } from '@/components';

const PostFilter = (props) => {
  const translate = useTranslate();

  return (
    <Filter {...props}>
      <SearchInput
        source="Search"
        placeholder={translate('resources.category.name')}
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
        <FunctionField
          source="customer"
          label="resources.action.user"
          render={(r) => {
            const item = r.customer || {};
            return (
              <Link to={`/customer/${item._id}`}>
                {`${item.firstName} ${item.lastName}`}
              </Link>
            );
          }}
        />
        <TextField source={`title.${lan}`} label="resources.post.title" />
        {/* <TextField
          source={`description.${lan}`}
          label="resources.post.description"
        /> */}

        <TextField source="adNumber" label="resources.advertise.adNumber" />
        <ArrayField label="resources.form.category" source="adscategory">
          <SingleFieldList linkType={false}>
            <ChipField source={`name.${lan}`} size="small" />
          </SingleFieldList>
        </ArrayField>

        <SelectField
          source="status"
          label="resources.product.status"
          choices={[
            { id: 'published', name: t('resources.product.published') },
            { id: 'processing', name: t('resources.product.processing') },
            { id: 'draft', name: t('resources.product.draft') },
            { id: 'deleted', name: t('resources.product.deleted') },
          ]}
        />

        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
}
