import { useState } from 'react';
import { LinearProgress } from '@mui/material';
import { ImageField, ImageInput, useInput } from 'react-admin';
import { useWatch } from 'react-hook-form';

import API from '@/functions/API';
import { TheImages } from '@/components';

API.defaults.headers.common['Content-Type'] = 'multipart/form-data';

export default (props) => {
  let valuesphotos = useWatch({ name: 'photos' });
  let valuesthumbnail = useWatch({ name: 'thumbnail' });

  // let {values} = useFormState();
  const { field } = useInput(props);
  // console.log("input", field);

  const [gallery, setGallery] = useState(valuesphotos || []);
  const [counter, setCounter] = useState(0);
  const [progress, setProgress] = useState(0);
  // console.log('props.photos',valuesthumbnail);

  const [v, setV] = useState(valuesthumbnail || '');

  // useEffect(() => {
  //   console.log("React.useEffect UploaderField");
  //   if (field.value) setV(field.value);
  // }, []);

  const handleUpload = (files) => {
    let GalleryTemp = gallery;
    // console.log("hanfleUpload");
    let file = files[0];

    if (!file) return;

    let formData = new FormData();
    formData.append('file', file);
    formData.append('type', file.type);
    API.post('/media/fileUpload', formData, {
      onUploadProgress: (e) => {
        let p = Math.floor((e.loaded * 100) / e.total);
        setProgress(p);
      },
    })
      .then(({ data = {} }) => {
        if (data.success) {
          let { url, type, _id } = data.media;
          // let a = [...valuesphotos, { url, type, _id }];
          // console.log("a", { url, type, _id }, valuesphotos);
          setProgress(0);
          GalleryTemp.push(url);
          // console.log("GalleryTemp", GalleryTemp);
          // console.log("gallery", gallery);
          if (data.media && data.media.url) {
            // console.log("setGallery...");
            setGallery(null);
            valuesphotos = GalleryTemp;
            props.inReturn(GalleryTemp).then((res) => {
              setGallery(GalleryTemp);
              setCounter(counter + 1);
              // console.log('res ',res);
            });
          }
          // console.log('props',props);
        }
      })
      .catch((err) => {
        // console.log("error", err);
        setProgress(0);
      });
  };
  const deleteFromObject = (photo, key) => {
    let cc = [];
    // console.log('valuesphotos',valuesphotos);

    gallery.forEach((item) => {
      if (item !== photo) {
        cc.push(item);
      }
    });
    setGallery(cc);
    setProgress(0);
    props.setPhotos(cc);

    // console.log('valuesphotos',valuesphotos);
  };
  const onImageClick = (photo) => {
    props.thep(photo);
    setV(photo);
  };

  return (
    <>
      <ImageInput
        label={props.label}
        source={props.source}
        name={field.name}
        onChange={field.onChange}
        onBlur={field.onBlur}
        accept={props.accept}
        options={{
          onDrop: handleUpload,
        }}>
        <ImageField
          source="url"
          title="title"
          sx={{
            '& img': {
              height: '300px !important',
            },
          }}
        />
      </ImageInput>
      <TheImages
        gallery={gallery}
        v={v}
        onImageClick={onImageClick}
        deleteFromObject={deleteFromObject}
      />
      {progress ? (
        <LinearProgress variant="determinate" value={progress} />
      ) : null}
    </>
  );
};
