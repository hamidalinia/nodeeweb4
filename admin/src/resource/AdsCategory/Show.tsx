import {
  TextField,
  NumberField,
  ReferenceField,
  useTranslate,
  Show,
  SimpleShowLayout,
  useRecordContext,
  BooleanField,
} from 'react-admin';

import { MainUrl } from '@/functions';

const CustomImageField = ({ source, label }) => {
  const { image } = useRecordContext();
  const imageSrc = `${MainUrl}/${image}`;
  return image ? (
    <a href={imageSrc} target="_blank" rel="noreferrer">
      <img loading="lazy" alt="img" style={{ height: 200 }} src={imageSrc} />
    </a>
  ) : null;
};

export default function ShowComponent(props) {
  const translate = useTranslate();
  const lan = translate('lan');

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="_id" label="_id" />
        <TextField source={`name.${lan}`} label="resources.advertise.name" />
        <TextField source={`nameForAdd.${lan}`} label="resources.advertise.nameForAdd" />
        <TextField source={`description.${lan}`} label="resources.product.description" />
        <TextField source="slug" label="resources.product.slug" />
        <ReferenceField
          label="resources.category.parent"
          source="parent"
          reference="AdsCategory">
          <TextField source={`name.${lan}`} />
        </ReferenceField>

        <NumberField source="order" label="resources.menu.order" />
        <CustomImageField source="image" label="resources.product.image" />
        <BooleanField source="active" label="resources.customers.active" />
      </SimpleShowLayout>
    </Show>
  );
}
