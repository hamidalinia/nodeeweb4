import { useTranslation } from 'next-i18next';
import type { Combination } from '@/types/product';

type Props = {
    combination?: Combination | null;
    isMobile?: boolean;
};

export default function ProductPrice({ combination, isMobile = false }: Props) {
    const { t } = useTranslation('product');

    if (!combination) return null;

    return (
        <div className={`${isMobile ? 'flex flex-col text-sm' : 'bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6'}`}>
            {combination.discounted_price ? (
                <div className={`flex items-center gap-4 mb-2 ${isMobile ? 'text-right' : ''}`}>
                    <div className={`${isMobile ? 'text-base font-bold' : 'text-2xl font-bold'} text-red-600 dark:text-red-400`}>
                        {combination.discounted_price.toLocaleString()} {t('currency')}
                    </div>
                    <div className={`${isMobile ? 'text-xs' : 'text-lg'} text-gray-500 dark:text-gray-400 line-through`}>
                        {combination.price.toLocaleString()}
                    </div>
                    {!isMobile && (
                        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm px-2 py-1 rounded">
                            {Math.round(
                                ((combination.price - combination.discounted_price) / combination.price) * 100
                            )}
                            % {t('discount')}
                        </div>
                    )}
                </div>
            ) : (
                <div className={`${isMobile ? 'text-base font-bold' : 'text-2xl font-bold'} text-green-600 dark:text-green-400 mb-2`}>
                    {combination.price.toLocaleString()} {t('currency')}
                </div>
            )}

            {!isMobile && (
                <div className="mt-2 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-md text-sm">
                    <div className="flex items-center text-blue-700 dark:text-blue-300">
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
              {t('installment', {
                  price: Math.round(
                      (combination.discounted_price || combination.price) / 4
                  ).toLocaleString()
              })}
            </span>
                    </div>
                </div>
            )}

            <div className={`flex items-center gap-4 text-sm ${isMobile ? 'mt-1' : 'mt-3'}`}>
        <span className="text-gray-600 dark:text-gray-300">
          {t('status')}:
            {combination.in_stock ? (
                <span className="text-green-600 dark:text-green-400 mr-1"> {t('inStock')}</span>
            ) : (
                <span className="text-red-600 dark:text-red-400 mr-1"> {t('outOfStock')}</span>
            )}
        </span>
                {combination.in_stock && !isMobile && (
                    <span className="text-gray-500 dark:text-gray-400">
            {combination.quantity} {t('inStockCount')}
          </span>
                )}
            </div>
        </div>
    );
}