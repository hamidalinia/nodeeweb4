import { useShowContext, useTranslate } from 'react-admin';

import { SubmitCustomerStatus } from '@/components';

export default function CustomerStatus() {
  const t = useTranslate();
  const { record } = useShowContext();
  const { _id, status } = record;

  return (
    <div style={{ padding: '10px' }}>
      <div className="label-top-table">
        <span>{t('customerStatus')}</span>
      </div>
      <SubmitCustomerStatus _id={_id} theStatus={status} />
    </div>
  );
}
