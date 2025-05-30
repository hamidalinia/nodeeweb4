import { Edit, useTranslate } from 'react-admin';
import { useEditController, TextInput } from 'react-admin';

import Form from './accountingForm';

export const AccountingEdit = (props) => {
  const translate = useTranslate();

  const { record } = useEditController({
    resource: 'accounting',
  });

  return (
    <Edit {...props} redirect={false} mutationMode="pessimistic">
      <Form record={record}>
        <TextInput
          source={'_id'}
          label={translate('_id')}
          className={'mb-20'}
          fullWidth
          disabled
        />
      </Form>
    </Edit>
  );
};

export default AccountingEdit;
