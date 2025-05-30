import CONFIG from '@/config';
import { isClient } from '@/functions';

export let url = CONFIG.SHOP_URL;
if (isClient) {
  url += 'site_setting/img/';
}

export const defaultImg = url + 'not-found.png';
export const chapterDisabled = url + 'chapter-disabled.svg';

export const SnapChatIcon = url + 'snapchat.svg';
export const logoImg = url + 'logo.png';
export const payImg = url + 'pay.png';
export const enamadImg = url + 'enamad.png';
export const etmeImg = url + 'etme.jpeg';
export const etehadImg = url + 'etehad.png';
export const blueImg = url + 'blue.png';
export const topsaleImg = url + 'topsale.png';

export const slide1Img = url + 'im/slide1.jpg';
export const slide2Img = url + 'im/slide2.jpg';
export const slide3Img = url + 'im/slide3.jpg';
export const slide4Img = url + 'im/slide4.jpg';
export const slide5Img = url + 'im/slide5.jpg';
export const valentineDays = url + 'im/valentine-days.jpg';
export const eid = url + 'im/eid.jpg';
// export const slideOffer1Img = path.resolve(__dirname, ".", "img/im/offer-1.png");
export const slideOffer1Img = url + 'im/offer-1.png';
export const slideOffer2Img = url + 'im/offer-2.png';
export const slideOffer3Img = url + 'im/offer-3.png';
export const slideOffer4Img = url + 'im/offer-4.png';
export const slideOffer5Img = url + 'im/offer-5.png';
export const slideOffer6Img = url + 'im/offer-6.png';
export const slideOffer7Img = url + 'im/offer-7.png';
export const slideOffer8Img = url + 'im/offer-8.png';
export const spriteImg = url + 'icons-sprite_2x.png';
// export const slideOffer5Img = url+('im/offer-5.png');
