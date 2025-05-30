import {
  SelectInput,
  TextInput,
  ReferenceInput,
  useTranslate,
  BooleanInput,
  NumberInput,
} from 'react-admin';

import { SimpleForm } from '@/components';
import { Val } from '@/Utils';

import ImageInput from './ImageInput';

export default function Form({ children = undefined, ...props }) {
  const translate = useTranslate();
  const lan = translate('lan');

  return (
    <SimpleForm {...props} translate="yes">
      {children}
      {/* show on ad page, ad list */}
      <TextInput
        source={`name.${lan}`}
        label="resources.advertise.name"
        validate={Val.req}
        fullWidth
        required
      />

      {/* show on create ad page */}
      <TextInput
        source={`nameForAdd.${lan}`}
        label="resources.advertise.nameForAdd"
        validate={Val.req}
        fullWidth
        required
      />
      <TextInput
        source={`description.${lan}`}
        label="resources.product.description"
        validate={Val.req}
        fullWidth
        multiline
        minRows={3}
        maxRows={3}
        required
      />
      <TextInput
        source="slug"
        label="resources.product.slug"
        validate={Val.req}
        fullWidth
        required
      />
      <ReferenceInput
        source="parent"
        label="resources.category.parent"
        reference="AdsCategory"
        perPage={1000}>
        <SelectInput optionText={`name.${lan}`} optionValue="id" fullWidth />
      </ReferenceInput>

      <NumberInput
        source="order"
        label="resources.menu.order"
        fullWidth
        required
        min={0}
      />

      <BooleanInput
        source="active"
        label="resources.customers.active"
        fullWidth
        defaultValue={true}
      />

      <ImageInput
        source="image"
        label="resources.product.image"
        accept="image/*"
        isRequired
      />
    </SimpleForm>
  );
}
