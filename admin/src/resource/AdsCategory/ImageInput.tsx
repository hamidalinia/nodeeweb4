import { useCallback, useState } from 'react';
import {
  ImageInput as RaImageInput,
  ImageInputProps,
  ImageField,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';
import _get from 'lodash/get';

import API from '@/functions/API';

export default function ImageInput(props: ImageInputProps) {
  const ctx = useFormContext();

  const [loading, setLoading] = useState(false);

  const handleUpload = useCallback(
    (files) => {
      let file = files[0];

      if (!file) return;
      setLoading(true);

      let formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type);
      API.post('/media/fileUpload', formData, {})
        .then(({ data }) => {
          if (data.success) {
            let url = _get(data, 'media.url', '');
            console.log('sdf', url);
            ctx.setValue(props.source, url);
            ctx.setValue('tempRaImage', null);
          }
        })
        .finally(() => setLoading(false));
    },
    [ctx, props.source]
  );

  return (
    // <Loading>
    <RaImageInput
      source="tempRaImage"
      label={props.label}
      accept={props.accept}
      isRequired={props.isRequired}
      options={{
        onDrop: handleUpload,
      }}>
      <ImageField source="src" title="title" />
    </RaImageInput>
    // </Loading>
  );
}
