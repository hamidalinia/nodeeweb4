import { useRef, useState } from 'react';
import { Col, Row } from 'shards-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import ImageCompression, {
  Options as ImageCompressionOptions,
} from 'browser-image-compression';
import { AddPhotoAlternateRounded, DeleteRounded } from '@mui/icons-material';
import { Button, ButtonBase } from '@mui/material';
import 'react-image-crop/dist/ReactCrop.css';

import { MainUrl, savePost, uploadPostFile } from '@/functions';

import ImageCropper from './ImageCropper';
import { Buttons } from './components';

const byteToMB = (s) => (s / 1024 / 1024).toFixed(2);

let files = [];
export default function CustomFileUpload({
  label = 'افزودن عکس',
  kind = 'image',
  onChange,
}) {
  const { t } = useTranslation();

  const [state, setState] = useState({
    selectedFiles: [],
    next: true,
  });
  const [imgSrc, setImgSrc] = useState<string | ArrayBuffer>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setImgSrc(reader.result);
      };

      reader.readAsDataURL(file);
    }
    window.scrollTo({
      top: document.body.offsetHeight - 1000,
      left: 0,
    });
  };

  const onChangeHandler = (e) => {
    const imageFile = e.target.files[0];

    if (!imageFile) return;

    const length = state.selectedFiles.length;

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('type', imageFile.type);
    uploadPostFile(formData, onUploadProgress, length, this)
      .then(async (d) => {
        if (d && d['success']) {
          files[length] = {
            url: MainUrl + '/' + d.media.url,
            type: d.media.type,
          };
          console.log('file uploaded...', d);
          setState({
            selectedFiles: [
              { url: MainUrl + '/' + d.media.url, type: 'image/png' },
            ],
            next: false,
          });
          // await savePost({ files: files });
        }
      })
      .catch((err) => {
        toast.info(t('Upload canceled!'));
        console.log(err);
      });
  };

  const processFile = async (e) => {
    console.group('compress');

    console.log('previewCanvasRef', previewCanvasRef);
    const imageFile = await fetch(previewCanvasRef.current.toDataURL())
      .then((response) => response.blob())
      .then((blob) => new File([blob], 'image.jpg', { type: 'image/jpeg' }));

    if (!imageFile) return;

    let ref = this;
    console.log(`Original File: ${byteToMB(imageFile.size)} MB`);
    const { selectedFiles } = state;

    const options: ImageCompressionOptions = {
      maxSizeMB: 0.7,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      fileType: 'image/jpeg',
      alwaysKeepResolution: true,
      onProgress: (p) => {
        console.log('progress', p);
        // toast(t('Compressing image...'), {
        //   type: 'warning'
        // });
      },
    };
    ImageCompression(imageFile, options)
      .then((f) => {
        const length = selectedFiles.length;

        console.log(`Compressed File: ${byteToMB(f.size)} MB`);
        const file = new File([f], f.name, { type: f.type });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', file.type);

        uploadPostFile(formData, onUploadProgress, length, ref)
          .then((d) => {
            if (d && d.success) {
              files[length] = {
                url: MainUrl + '/' + d.media.url,
                type: d.media.type,
              };
              const temp = {
                url: MainUrl + '/' + d.media.url,
                type: 'image/png',
              };
              setState({
                selectedFiles: [temp],
                next: false,
              });

              onChange([temp]);
            } else toast.error('مشکلی در آپلود وجود دارد.');
          })
          .catch((err) => {
            toast.info(t('Upload canceled!'));

            console.log('error on upload', err);
          });
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        console.groupEnd();
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });
  };

  const onUploadProgress = (ev, id, ref, cancel) => {
    // console.log(cancel);
    // let ref=this;
    const progress = (ev.loaded / ev.total) * 100;
    var { selectedFiles } = state;
    if (selectedFiles && selectedFiles[id]) {
      selectedFiles[id]['loader'] = Math.round(progress);
      selectedFiles[id]['cancel'] = cancel;
      let next = false;
      if (selectedFiles[id]['loader'] > 99) {
        console.log(
          "selectedFiles[id]['loader'] > 99",
          selectedFiles[id]['loader']
        );
        delete selectedFiles[id]['loader'];
        next = true;
      }
      setState({
        selectedFiles: selectedFiles,
        next: next,
        // selectedFiled[(lastFile-1)]['loader']:Math.round(progress)
      });
    } else {
    }
  };

  const deleteThis = (_id) => {
    let { selectedFiles } = state;
    selectedFiles.map((file, idx) => {
      if (idx === _id) {
        if (file.cancel) file.cancel();
        selectedFiles.splice(idx, 1);
        files = selectedFiles;
        savePost({ files: files });

        setState({
          selectedFiles: selectedFiles,
          next: false,
        });
      }
      return 0;
    });
  };

  let format;
  if (kind === 'image') format = 'image/*';
  else if (kind === 'video') format = 'video/*';
  else if (kind === 'audio') format = 'audio/*';
  let { selectedFiles } = state;

  return (
    <Row>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          justifyContent: 'start',
          alignItems: 'center',
        }}>
        {selectedFiles?.map((file, idx) => {
          if (
            kind === 'image' &&
            ['image/png', 'image/jpeg', 'jpeg'].includes(file.type)
          )
            return (
              <Col key={idx} sm="6">
                <div className="img100">
                  <img
                    alt="uploaded compressed"
                    loading="lazy"
                    src={previewCanvasRef.current.toDataURL()}
                  />
                  <ButtonBase
                    className="delete"
                    onClick={() => deleteThis(idx)}>
                    <DeleteRounded fontSize="medium" />
                    حذف
                    {file.loader && (
                      <span className="loaderl">{file.loader}%</span>
                    )}
                  </ButtonBase>
                </div>
              </Col>
            );
          // if (kind === 'video' && (d === 'video/quicktime' || d === 'mov'))
          //   return (
          //     <Col key={idx} sm="12" className="img100">
          //       <video controls={true}>
          //         <source src={file.url} type="audio/mpeg"/>
          //         Your browser does not support the audio element.
          //       </video>
          //       <div className="delete" onClick={() => {
          //         this.deleteThis(idx);
          //       }}>
          //         <i className="material-icons">
          //           delete
          //         </i><span>حذف</span>
          //         {file.loader && <span className="loaderl">{file.loader}%</span>}
          //       </div>
          //     </Col>
          //   );
          // if (kind === 'audio' && (d === 'audio/mp3'))
          //   return (
          //     <Col key={idx} sm="12" className="img100">
          //       <audio controls={true}>
          //         <source src={file.url} type="audio/mpeg"/>
          //         Your browser does not support the audio element.
          //       </audio>
          //       <div className="delete" onClick={() => {
          //         this.deleteThis(idx);
          //       }}>
          //         <i className="material-icons">
          //           delete
          //         </i><span>حذف</span>
          //         {file.loader && <span className="loaderl">{file.loader}%</span>}
          //       </div>
          //     </Col>
          //   );
          return null;
        })}
        <Col sm="12">
          <div className="img100" style={{ marginBottom: '2rem' }}>
            <label className="custom-image-label">
              <input
                hidden
                multiple
                accept={format}
                type="file"
                name="file"
                onChange={handleFileChange}
              />
              <AddPhotoAlternateRounded
                sx={{
                  textAlign: 'center',
                  fontSize: 33,
                  color: '#00adff',
                }}
              />
              {label}
            </label>
          </div>
          {!!imgSrc && (
            <>
              <ImageCropper
                imgRef={imgRef}
                imgSrc={imgSrc as string}
                previewCanvasRef={previewCanvasRef}
              />
              <Buttons>
                <Button
                  className="upload"
                  onClick={(e) => {
                    if (format === 'image/*') processFile(e);
                    else onChangeHandler(e);
                  }}>
                  آپلود تصویر
                </Button>
              </Buttons>
            </>
          )}
        </Col>
      </div>
    </Row>
  );
}
