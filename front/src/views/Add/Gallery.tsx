import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Options } from '@splidejs/splide';

import { MainUrl } from '@/functions';
import { defaultImg } from '@/assets';

// import Slider from '@/components/swiper'
import { ImageContainer, Image } from './components';

const SliderOptions: Options = {
  type: 'loop',
  perPage: 1,
  perMove: 1,
  pagination: true,
  arrows: true,
  autoplay: true,
  lazyLoad: true,
  direction: 'rtl',
  interval: 2000,
  pauseOnHover: true,
  pauseOnFocus: true,
};

function moveArrayItemToNewIndex(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
}
export default function Gallery({ photos, thumbnail }) {
  const index = photos ? photos.indexOf(thumbnail) : -1;

  if (index > -1) photos = moveArrayItemToNewIndex(photos, index, 0);

  const hasPhotos = photos && photos.length > 0;

  return (
    <ImageContainer>
      {hasPhotos && (
        <Splide options={SliderOptions}>
          {photos.map((i, idx) => (
            <SplideSlide key={idx}>
              <Image src={i.url} loading="lazy" alt={`img-${idx}`} />
            </SplideSlide>
          ))}
        </Splide>
      )}
      {!hasPhotos && (
        <div>
          {thumbnail ? (
            <Image
              src={`${MainUrl}/${thumbnail}`}
              loading="lazy"
              alt="thumbnail"
            />
          ) : (
            <div className="the-defaultImg">
              <Image src={defaultImg} loading="lazy" alt="thumbnail" />
            </div>
          )}
        </div>
      )}
    </ImageContainer>
  );
}
