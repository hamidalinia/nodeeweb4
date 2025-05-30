import {
  Datagrid,
  EditButton,
  Filter,
  ReferenceField,
  SearchInput,
  ShowButton,
  DeleteButton,
  TextField,
  useTranslate,
  useRecordContext,
  BooleanField,
} from 'react-admin';

import { List } from '@/components';
import { MainUrl } from '@/functions';

const CustomImageField = ({ source, label }) => {
  const { image } = useRecordContext();
  const imageSrc = `${MainUrl}/${image}`;
  return image ? (
    <img loading="lazy" alt="img" style={{ height: 70 }} src={imageSrc} />
  ) : null;
};

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
  const translate = useTranslate();
  const lan = translate('lan');

  return (
    <List {...props} filters={<PostFilter />}>
      <Datagrid translate="yes">
        <CustomImageField source="image" label="resources.product.image" />
        <TextField source={`name.${lan}`} label="resources.advertise.name" />
        <TextField source={`nameForAdd.${lan}`} label="resources.advertise.nameForAdd" />
        <TextField source="slug" label="resources.category.slug" />
        <ReferenceField
          label="resources.category.parent"
          source="parent"
          reference="AdsCategory">
          <TextField source={`name.${lan}`} />
        </ReferenceField>
        <TextField source="order" label="resources.category.order" />

        <BooleanField source="active" label="resources.customers.active" />

        <EditButton />
        <ShowButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
}
