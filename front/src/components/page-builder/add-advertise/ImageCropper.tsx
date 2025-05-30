import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';

import { MutableRefObject, useRef, useState } from 'react';

import { useDebounceEffect } from '@/hooks/useDebouncEffect';

import { canvasPreview } from './CanvasPreview';

function ImageCropper({
  imgSrc,
  imgRef,
  previewCanvasRef,
}: {
  imgSrc: string;
  imgRef: MutableRefObject<HTMLImageElement>;
  previewCanvasRef: MutableRefObject<HTMLCanvasElement>;
}) {
  const [crop, setCrop] = useState<Crop>({
    unit: 'px', // Can be 'px' or '%'
    x: 50,
    y: 50,
    width: 250,
    height: 250,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>({
    x: 50,
    y: 50,
    width: 250,
    height: 250,
    unit: 'px',
  });

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop
          //   scale,
          //   rotate,
        );
      }
    },
    100,
    [completedCrop]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        width: '100%',
      }}>
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        aspect={1}
        onComplete={(c) => setCompletedCrop(c)}>
        <img
          src={imgSrc as string}
          alt="Preview"
          ref={imgRef}
          style={{ width: '25rem', height: '25rem' }}
        />
      </ReactCrop>

      {!!completedCrop && (
        <canvas
          ref={previewCanvasRef}
          style={{
            border: '1px solid black',
            objectFit: 'contain',
            width: completedCrop.width,
            height: completedCrop.height,
          }}
        />
      )}
    </div>
  );
}

export default ImageCropper;
