import { Grid, Box, Typography } from '@mui/material';
import {
  Show,
  FunctionField,
  SimpleShowLayout,
  useTranslate,
  TextField,
  DateField,
} from 'react-admin';

import { EntryStatus } from '@/components';
import { MainUrl } from '@/functions';

const CustomImageField = ({ value }) => {
  return value.startsWith(MainUrl) ? (
    <a href={value} target="_blank" rel="noreferrer">
      <img loading="lazy" alt="img" style={{ height: 200 }} src={value} />
    </a>
  ) : (
    value
  );
};

export default function EntryShow() {
  const t = useTranslate();

  return (
    <Show>
      <Grid container spacing={0}>
        <Grid item lg={9} md={8} xs={12}>
          <SimpleShowLayout>
            <TextField source="_id" label="_id" />
            <TextField
              source="trackingCode"
              label="resources.entry.trackingCode"
            />
            <DateField
              source="createdAt"
              label="resources.form.createdAt"
              showTime
            />
            <Typography variant="h5">{t('resources.entry.data')}</Typography>
            <hr style={{ border: '3px solid #ddd' }} />
            <FunctionField
              render={({ data = {} }) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    '& span': {
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}>
                  {Object.keys(data).map((i) => (
                    <span dir="ltr">
                      {(i)} :{' '}
                      <CustomImageField value={data[i]} />
                    </span>
                  ))}
                </Box>
              )}
            />
          </SimpleShowLayout>
        </Grid>
        <Grid item lg={3} md={4} xs={12}>
          <FunctionField
            label={t('resources.entry.tasks')}
            render={(record) => <EntryStatus record={record} />}
          />
        </Grid>
      </Grid>
    </Show>
  );
}
