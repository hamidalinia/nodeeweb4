import { SelectInput, TextInput, useTranslate, NumberInput } from 'react-admin';

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
      <NumberInput
        source="data.number"
        label="resources.inItem.tarrif"
        fullWidth
        required
      />
      <NumberInput
        source="data.importduty"
        label="resources.inItem.importduty"
        validate={Val.reqNum}
        fullWidth
        required
      />
      <TextInput
        source="data.mojavez"
        label="resources.inItem.mojavez"
        validate={Val.req}
        fullWidth
        required
      />
      <NumberInput
        source="data.group1"
        label="resources.inItem.order"
        validate={Val.reqNum}
        fullWidth
        required
      />
      <SelectInput
        source="data.emkan"
        label="resources.customers.active"
        fullWidth
        required
        choices={[
          { id: 'فعال', name: 'فعال' },
          { id: 'غیرفعال', name: 'غیرفعال' },
        ]}
      />
    </SimpleForm>
  );
}
