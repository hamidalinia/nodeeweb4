import { Grid } from '@mui/material';
import { useFormikContext } from 'formik';

import TextInput from './TextInput';

export default function AddAdvertiseStep2() {
  const { values } = useFormikContext<any>();

  const mainCategory = values.mainCategory || {};

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <label>ثبت آگهی در دسته</label>
        <span className="tag-style">{mainCategory.name}</span>
      </Grid>

      <Grid item xs={12}>
        <TextInput
          label="عنوان آگهی"
          name="title"
          placeholder="عنوان آگهی"
          required
        />
      </Grid>

      <Grid item xs={12}>
        <TextInput
          name="description"
          placeholder="توضیحات"
          label="توضیحات آگهی"
          required
          multiline
          maxRows={3}
          minRows={3}
        />
      </Grid>
    </Grid>
  );
}
