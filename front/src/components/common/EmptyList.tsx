import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

interface Props {
  className?: string;
}

export default function EmptyList({ className }: Props) {
  const { t } = useTranslation();
  return (
    <div className={clsx(className, 'text-center fs-2')}>
      {t('empty-list')}
    </div>
  );
}
