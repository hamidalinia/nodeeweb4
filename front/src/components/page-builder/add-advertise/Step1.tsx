import { FormHelperText } from '@mui/material';
import { useField } from 'formik';

import SidebarCategories from './SidebarCategories';

export default function AddAdvertiseStep1() {
  const [, meta, helper] = useField({ name: 'mainCategory' });
  const error = meta.touched && meta.error ? meta.error : false;

  return (
    <>
      <SidebarCategories onMainCategory={(v) => helper.setValue(v)} />
      {error ? <FormHelperText error>{error}</FormHelperText> : null}
    </>
  );
}
