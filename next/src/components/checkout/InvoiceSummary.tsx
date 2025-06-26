import { useTranslation } from 'next-i18next';
import { CartItem } from '@/types/cart';

const InvoiceSummary = ({
                            items,
                            theme,
                            hasPhysicalProducts
                        }: {
    items: CartItem[];
    theme: string;
    hasPhysicalProducts: boolean;
}) => {
    const { t, i18n } = useTranslation('common');
    const currentLang = i18n.language; // 'fa' or 'en'

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = hasPhysicalProducts ? 5.99 : 0;
    const total = subtotal + shipping;

    // Get item name based on current language
    const getItemName = (item: CartItem) => {
        return currentLang === 'fa'
            ? item.title.fa
            : (item.title.en || item.title.fa);
    };

    return (
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">{t('orderSummary')}</h2>

            <div className="space-y-4">
                {items.map(item => (
                    <div key={item.id} className="flex justify-between">
                        <div className="flex-1 truncate pr-2">
                            {getItemName(item)}
                            {item.variation && (
                                <div className="text-sm text-gray-500 mt-1">
                                    {Object.entries(item.variation.options).map(([key, value]) => (
                                        <div key={key}>
                                            {currentLang === 'fa' ? value : key}: {currentLang === 'fa' ? key : value}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-end">
              <span>
                {item.price.toLocaleString(currentLang, {
                    style: 'currency',
                    currency: 'IRR',
                    minimumFractionDigits: 0
                })}
              </span>
                            <span className="text-sm text-gray-500">
                × {item.quantity}
              </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t my-6 pt-4 space-y-2">
                <div className="flex justify-between">
                    <span>{t('subtotal')}</span>
                    <span>
            {subtotal.toLocaleString(currentLang, {
                style: 'currency',
                currency: 'IRR',
                minimumFractionDigits: 0
            })}
          </span>
                </div>

                {hasPhysicalProducts && (
                    <div className="flex justify-between">
                        <span>{t('shipping')}</span>
                        <span>
              {shipping.toLocaleString(currentLang, {
                  style: 'currency',
                  currency: 'IRR',
                  minimumFractionDigits: 0
              })}
            </span>
                    </div>
                )}

                <div className="flex justify-between font-bold text-lg pt-2">
                    <span>{t('total')}</span>
                    <span>
            {total.toLocaleString(currentLang, {
                style: 'currency',
                currency: 'IRR',
                minimumFractionDigits: 0
            })}
          </span>
                </div>
            </div>

            <button
                className={`w-full py-3 rounded font-semibold ${
                    theme === 'dark'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white transition-colors duration-200`}
            >
                {t('proceedToPayment')}
            </button>
        </div>
    );
};

export default InvoiceSummary;