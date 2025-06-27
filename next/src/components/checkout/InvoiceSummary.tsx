// components/checkout/InvoiceSummary.tsx
import { useTranslation } from 'next-i18next';
import { CartItem } from '@/types/cart';
import { ThemeData } from '@/types/themeData';

interface InvoiceSummaryProps {
    items: CartItem[];
    theme: ThemeData;
    hasPhysicalProducts: boolean;
    shippingCost: number;
    currentLang: string;
}

const InvoiceSummary = ({
                            items,
                            theme,
                            hasPhysicalProducts,
                            shippingCost,
                            currentLang
                        }: InvoiceSummaryProps) => {
    const { t } = useTranslation('common');
    const themeMode=theme?.mode;

    // Calculate totals
    const subtotal = items.reduce(
        (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
        0
    );
    const total = subtotal + shippingCost;

    // Get item name based on current language
    const getItemName = (item: CartItem) => {
        return currentLang === 'fa'
            ? item.title.fa
            : (item.title.en || item.title.fa);
    };

    return (
        <div className={`p-6 rounded-lg shadow-md ${
            themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
            <h2 className="text-xl font-semibold mb-4">{t('orderSummary')}</h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1 truncate">
                            <div className="font-medium">
                                {getItemName(item)}
                            </div>
                            {item.variation && (
                                <div className="text-gray-500 mt-1">
                                    {Object.entries(item.variation.options).map(
                                        ([key, value]) => (
                                            <div key={key} className="text-xs">
                                                {value}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                        <div className="ml-4 flex flex-col items-end min-w-[90px]">
                            <span className="font-medium">
                                {((item.salePrice || item.price) * item.quantity).toLocaleString(currentLang, {
                                    style: 'currency',
                                    currency: 'IRR',
                                    minimumFractionDigits: 0
                                })}
                            </span>
                            <span className="text-gray-500 text-xs">
                                {item.quantity} × {item.salePrice || item.price}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t my-4 pt-4 space-y-2">
                <div className="flex justify-between">
                    <span>{t('subtotal')}</span>
                    <span className="font-medium">
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
                        <span className="font-medium">
                            {shippingCost.toLocaleString(currentLang, {
                                style: 'currency',
                                currency: 'IRR',
                                minimumFractionDigits: 0
                            })}
                        </span>
                    </div>
                )}

                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
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
        </div>
    );
};

export default InvoiceSummary;