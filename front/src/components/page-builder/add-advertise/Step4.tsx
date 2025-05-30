import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Grid, Typography } from '@mui/material';

export default function AddAdvertiseStep4() {
  const { t } = useTranslation();
  const { values } = useFormikContext<any>();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {values.images?.map((i, idx) => (
          <img key={idx} src={i.url} loading="lazy" alt={`img-${idx}`} />
        ))}
      </Grid>
      <Grid item xs={12}>
        <Typography>
          {t('category')}: {values.mainCategory?.name}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          {t('title')}: {values.title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          {t('description')}: {values.description}
        </Typography>
      </Grid>
    </Grid>
  );
}
