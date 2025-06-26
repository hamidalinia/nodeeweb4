// components/checkout/ShippingMethodStep.tsx
import React from 'react';
import { formatPrice } from '@/utils';
import { useTranslation } from 'next-i18next';

const ShippingMethodStep = ({
                                theme,
                                selectedAddress,
                                deliverySettings,
                                selectedShippingMethod,
                                handleShippingSelect,
                                calculateShippingCost,
                                currency,
                                setActiveStep
                            }: {
    theme: string;
    selectedAddress: any;
    deliverySettings: any[];
    selectedShippingMethod: number;
    handleShippingSelect: (index: number) => void;
    calculateShippingCost: (method: any, address: any) => number;
    currency: string;
    setActiveStep: (step: 'address' | 'shipping' | 'payment') => void;
}) => {
    const { t, i18n } = useTranslation('common');

    return (
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="mb-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('selectedAddress')}</h3>
                        <div className="font-medium">{selectedAddress.fullName}</div>
                        <div className="text-sm">
                            {selectedAddress.address}, {selectedAddress.city}
                        </div>
                    </div>
                    <button
                        className="text-purple-600 dark:text-purple-400 text-sm font-medium whitespace-nowrap"
                        onClick={() => setActiveStep('address')}
                    >
                        {t('change')}
                    </button>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">{t('shippingMethod')}</h2>

            {deliverySettings.length > 0 ? (
                <div className="space-y-4">
                    {deliverySettings.map((method, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                selectedShippingMethod === index
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md'
                                    : theme === 'dark'
                                    ? 'border-gray-700 hover:border-gray-500'
                                    : 'border-gray-200 hover:border-gray-400'
                                }`}
                            onClick={() => handleShippingSelect(index)}
                        >
                            <div className="flex items-start">
                                <div className={`flex items-center h-5 mt-1 mr-3 ml-3 ${
                                    selectedShippingMethod === index
                                        ? 'text-purple-600 dark:text-purple-400'
                                        : 'text-gray-500'
                                    }`}>
                                    <input
                                        type="radio"
                                        checked={selectedShippingMethod === index}
                                        readOnly
                                        className="w-4 h-4"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium flex justify-between">
                                        <span>{method.title}</span>
                                        <span>
                                            {formatPrice(
                                                calculateShippingCost(method, selectedAddress),
                                                currency
                                            )}
                                        </span>
                                    </div>
                                    {method.description && (
                                        <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                                            {method.description}
                                        </div>
                                    )}
                                    {method.estimatedDelivery && (
                                        <div className="text-sm mt-2 text-green-600 dark:text-green-400">
                                            {t('estimatedDelivery')}: {method.estimatedDelivery}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-xl font-semibold"></div>

                            <button
                                className={`px-4 py-2 rounded-lg font-medium flex items-center text-sm ${
                                    theme === 'dark'
                                        ? 'bg-gray-700 hover:bg-gray-600'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                    }`}

                                onClick={() => handleShippingSelect(0)}
                            >
                                {t('selectDeliveryMethod')}
                            </button>

                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    {t('noShippingMethods')}
                </div>
            )}
        </div>
    );
};

export default ShippingMethodStep;