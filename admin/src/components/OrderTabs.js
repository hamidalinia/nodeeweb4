import { useTranslate } from 'react-admin';

export default () => {
  const t = useTranslate();
  return [
    { id: 'all', name: t('resources.order.allOrders') },
    { id: 'processing', name: t('resources.order.processing') },
    { id: 'indoing', name: t('resources.order.confirmed') },
    { id: 'makingready', name: t('resources.order.makingready') },
    { id: 'inpeyk', name: t('resources.order.inpeyk') },
    { id: 'complete', name: t('resources.order.complete') },
    { id: 'cancel', name: t('resources.order.canceled') },
  ];
};
