// i18n.ts یا i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from '@/locales/en/translation.json';
import translationFa from '@/locales/fa/translation.json';

i18n
    .use(initReactI18next) // این قسمت خیلی مهمه
    .init({
        resources: {
            fa: { translation: translationFa },
            en: { translation: translationEn },
        },
        lng: 'fa', // زبان پیش‌فرض
        fallbackLng: 'en', // زبان پشتیبان
        interpolation: {
            escapeValue: false, // برای React نیازی به escape نیست
        },
    });

export default i18n;
