// components/checkout/PaymentStep.tsx
import React from 'react';
import { CartItem } from '@/types';

interface PaymentStepProps {
    theme: string;
    t: (key: string) => string;
    setActiveStep: (step: 'address' | 'shipping' | 'payment') => void;
    hasPhysicalProducts: boolean;
    items: CartItem[];
    shippingCost: number;
    currentLang: string;
    selectedAddress: any;
    subtotal: number;
    total: number;
}

const PaymentStep = ({
                         theme,
                         t,
                         setActiveStep,
                         hasPhysicalProducts,
                         items,
                         shippingCost,
                         currentLang,
                         selectedAddress,
                         subtotal,
                         total
                     }: PaymentStepProps) => {
    // Format price with commas for Persian
    const formatPrice = (price: number) => {
        return price.toLocaleString(currentLang, {
            minimumFractionDigits: 0
        }) + ' ' + t('currency');
    };

    // Get item name based on current language
    const getItemName = (item: CartItem) => {
        return currentLang === 'fa'
            ? item.title.fa
            : (item.title.en || item.title.fa);
    };

    return (
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-6">{t('payment')}</h2>

            {/* Order Summary Section */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">{t('orderSummary')}</h3>

                {/* Selected Address (if physical products) */}
                {hasPhysicalProducts && selectedAddress && (
                    <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">{t('shippingAddress')}</h4>
                        <div className="font-medium">{selectedAddress.fullName}</div>
                        <div className="text-sm">
                            {selectedAddress.address}, {selectedAddress.city}
                        </div>
                    </div>
                )}

                {/* Order Items */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                    {items.map(item => {
                        // Calculate item price
                        const price = item.salePrice || item.price;
                        if (price <= 0) return null; // Skip free items

                        return (
                            <div key={item.id} className="flex justify-between text-sm pb-2 border-b">
                                <div className="flex-1 truncate">
                                    <div className="font-medium">
                                        {getItemName(item)}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        {item.quantity} × {formatPrice(price)}
                                    </div>
                                </div>
                                <div className="ml-4 min-w-[90px] text-right">
                                    <span className="font-medium">
                                        {formatPrice(price * item.quantity)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Totals */}
                <div className="border-t my-4 pt-4 space-y-2">
                    <div className="flex justify-between">
                        <span>{t('subtotal')}</span>
                        <span className="font-medium">
                            {formatPrice(subtotal)}
                        </span>
                    </div>

                    {hasPhysicalProducts && shippingCost > 0 && (
                        <div className="flex justify-between">
                            <span>{t('shipping')}</span>
                            <span className="font-medium">
                                {formatPrice(shippingCost)}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                        <span>{t('total')}</span>
                        <span>
                            {formatPrice(total)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">{t('selectPaymentMethod')}</h3>
                <div className="space-y-3">
                    <div className={`p-4 rounded-lg border-2 cursor-pointer ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                        }`}>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                name="payment"
                                className="w-5 h-5 mr-3 ml-3"
                                defaultChecked
                            />
                            <div>
                                <div className="font-medium">{t('creditCard')}</div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {t('creditCardDescription')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`p-4 rounded-lg border-2 cursor-pointer ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                        }`}>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                name="payment"
                                className="w-5 h-5 mr-3 ml-3"
                            />
                            <div>
                                <div className="font-medium">{t('paypal')}</div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {t('paypalDescription')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    className="px-6 py-3 rounded-lg font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                    onClick={() => setActiveStep(hasPhysicalProducts ? 'shipping' : 'address')}
                >
                    {t('back')}
                </button>

                <button
                    className="px-6 py-3 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => console.log('Process payment')}
                >
                    {t('completePurchase')}
                </button>
            </div>
        </div>
    );
};

export default PaymentStep;