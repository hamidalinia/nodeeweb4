/**
 * @file Renders the TitlesPage component.
 *
 * Renders the TitlesPage component, which shows the title and description of a title.
 *
 * Also, it uses the useParams hook to get the _id of the title from the URL.
 *
 * The useFetch hook is used to fetch the title data from the server.
 *
 * The data is then rendered in the component.
 *
 * The component also handles the loading and error states.
 *
 * The title of the page is also set based on the title name.
 *
 * The description is rendered using dangerouslySetInnerHTML, because the description is in HTML format?
 *
 *
 * @returns JSX.Element
 */

import { Alert, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { dateFormat } from '#c/functions/utils';

import useFetch from '@/hooks/useFetch';

export default function TitlesPage() {
  const { _id } = useParams();
  const { data, isLoading, error } = useFetch(`/title/${_id}`);

  console.log(data);

  return isLoading ? (
    <>
      <title>سرفصل</title>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          minHeight: '60vh',
        }}>
        <CircularProgress size={50} />
      </div>
    </>
  ) : error ? (
    <>
      <title>خطای سرور</title>
      <Alert severity="error">
        <p>مشکل در دریافت اطلاعات از سرور - 500</p>
      </Alert>
    </>
  ) : (
    <>
      <title>سرفصل {_id}</title>
      <div
        style={{
          display: 'flex',
          justifyContent: 'start',
          minHeight: '60vh',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          padding: '2rem',
        }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 500 }}>
          {data.title} - سر فصل {_id}
        </h3>
        <div
          style={{ lineHeight: '2.5rem' }}
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
        <hr style={{ width: '100%' }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
          <p>آخرین تغییرات</p>
          <p>{dateFormat(data.updatedAt)}</p>
        </div>
      </div>
    </>
  );
}
