import {
  SelectInput,
  TextInput,
  useTranslate,
  BooleanInput,
} from 'react-admin';

import { SimpleForm } from '@/components';
import { Val } from '@/Utils';

export default function Form({ children = undefined, ...props }) {
  const t = useTranslate();
  const lan = t('lan');

  return (
    <SimpleForm {...props} translate="yes">
      {children}
      <TextInput
        source={`title.${lan}`}
        label="resources.product.title"
        validate={Val.req}
        fullWidth
        required
      />
      <TextInput
        source={`description.${lan}`}
        label="resources.product.description"
        validate={Val.req}
        fullWidth
        required
      />
      <TextInput
        source="slug"
        label="resources.product.slug"
        validate={Val.req}
        fullWidth
        required
      />
      {/* <TextInput
        source="adscategory[0].name.fa"
        label="resources.form.category"
        fullWidth
        required
      /> */}

      <BooleanInput
        source="active"
        label="resources.customers.active"
        fullWidth
        defaultValue={true}
      />

      <SelectInput
        source="status"
        label="resources.product.status"
        choices={[
          { id: 'published', name: 'resources.product.published' },
          { id: 'processing', name: 'resources.product.processing' },
          { id: 'draft', name: 'resources.product.draft' },
          { id: 'deleted', name: 'resources.product.deleted' },
        ]}
      />
    </SimpleForm>
  );
}
