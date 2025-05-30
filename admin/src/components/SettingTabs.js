import { useTranslate } from 'react-admin';

export default () => {
  const t = useTranslate();
  return [
    { id: 'general', name: t('resources.settings.general') },
    { id: 'shop', name: t('resources.settings.shop') },
    { id: 'crm', name: t('resources.settings.crm') },
    { id: 'sms', name: t('resources.settings.sms') },
    { id: 'authForm', name: t('resources.settings.authForm') },
    { id: 'other', name: t('resources.settings.other') },
    { id: 'importExport', name: t('resources.settings.import_export') }
  ];
};
