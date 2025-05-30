import { TextField, useRecordContext, useTranslate } from 'react-admin';

export default function ShowLink({ base = 'product', theSource = 'title' }) {
  const record = useRecordContext();
  const t = useTranslate();
  const lan = t('lan');

  return (
    <>
      {record.path && record.slug && (
        <a
          rel="noopener noreferrer"
          target={'_blank'}
          href={window.BASE_URL + (base ? base + '' : '') + record.path + '/'}>
          <TextField
            source={theSource + '.' + lan}
            label={'pos.' + theSource}
            sortable={false}
          />
        </a>
      )}
      {!record.path && record.slug && (
        <a
          rel="noopener noreferrer"
          target={'_blank'}
          href={window.SHOP_URL + (base ? base + '/' : '') + record.slug + '/'}>
          <TextField
            source={theSource + '.' + lan}
            label={'pos.' + theSource}
            sortable={false}
          />
        </a>
      )}
    </>
  );
}
