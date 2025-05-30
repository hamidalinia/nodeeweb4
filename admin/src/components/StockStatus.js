import { useTranslate } from 'react-admin';

export default function StockStatus() {
  const translate = useTranslate();
  return [
    {
      value: false,
      label: translate('resources.product.isnt'),
    },
    {
      value: true,
      label: translate('resources.product.is'),
    },
  ];
}
