/**
 * Renders a preview of an image on a canvas with specified crop, scale, and rotation.
 * @param image - The HTMLImageElement representing the image to be previewed.
 * @param canvas - The HTMLCanvasElement on which the image will be rendered.
 * @param crop - The PixelCrop object specifying the crop area of the image.
 * @param scale - The scale factor to apply to the image (default: 1).
 * @param rotate - The rotation angle in degrees to apply to the image (default: 0).
 * @throws Error if the 2d context of the canvas is not available.
 */
import { PixelCrop } from 'react-image-crop';

const TO_RADIANS = Math.PI / 180;

export async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0
) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = window.devicePixelRatio;
  // const pixelRatio = 1

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  ctx.rotate(rotateRads);
  // 2) Scale the image
  ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
}
