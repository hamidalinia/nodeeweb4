// components/checkout/OrderSummary.tsx
import { useTranslation } from 'next-i18next';
import { CartItem } from '@/types';

interface OrderSummaryProps {
    items: CartItem[];
    theme: string;
    hasPhysicalProducts: boolean;
    shippingCost: number;
    currentLang: string;
    activeStep: string;
    selectedAddress: any;
}

const OrderSummary = ({
                          items,
                          theme,
                          hasPhysicalProducts,
                          shippingCost,
                          currentLang,
                          activeStep,
                          selectedAddress
                      }: OrderSummaryProps) => {
    const { t } = useTranslation('common');

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
        <div className={`sticky top-4 p-6 rounded-lg shadow-md ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
            <h2 className="text-xl font-semibold mb-4">{t('orderSummary')}</h2>

            {/* Show selected address in shipping/payment steps */}
            {(activeStep === 'shipping' || activeStep === 'payment') && selectedAddress && (
                <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">{t('selectedAddress')}</h3>
                    <div className="font-medium">{selectedAddress.fullName}</div>
                    <div className="text-sm">
                        {selectedAddress.address}, {selectedAddress.city}
                    </div>
                    <div className="text-sm">{selectedAddress.phone}</div>
                </div>
            )}

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm pb-2 border-b">
                        <div className="flex-1 truncate">
                            <div className="font-medium">
                                {getItemName(item)}
                            </div>
                            <div className="text-gray-500 text-xs">
                                {item.quantity} × {item.salePrice || item.price}
                            </div>
                        </div>
                        <div className="ml-4 min-w-[90px] text-right">
                            <span className="font-medium">
                                {((item.salePrice || item.price) * item.quantity).toLocaleString(currentLang, {
                                    minimumFractionDigits: 0
                                })} {t('currency')}
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
                            minimumFractionDigits: 0
                        })} {t('currency')}
                    </span>
                </div>

                {hasPhysicalProducts && (
                    <div className="flex justify-between">
                        <span>{t('shipping')}</span>
                        <span className="font-medium">
                            {shippingCost.toLocaleString(currentLang, {
                                minimumFractionDigits: 0
                            })} {t('currency')}
                        </span>
                    </div>
                )}

                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                    <span>{t('total')}</span>
                    <span>
                        {total.toLocaleString(currentLang, {
                            minimumFractionDigits: 0
                        })} {t('currency')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;