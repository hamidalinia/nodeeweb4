import { useField } from 'formik';

import UploadImage from './UploadImage';

export default function AddAdvertiseStep3() {
  const [, , helper] = useField({ name: 'images' });
  return <UploadImage onChange={(e) => helper.setValue(e)} />;
}
