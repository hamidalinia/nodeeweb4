// components/checkout/CheckoutStepIndicator.tsx
import React from 'react';

const CheckoutStepIndicator = ({
                                   activeStep,
                                   hasPhysicalProducts,
                                   t
                               }: {
    activeStep: string;
    hasPhysicalProducts: boolean;
    t: (key: string) => string;
}) => {
    const getStepClass = (step: string) => {
        return activeStep === step
            ? 'text-purple-600 font-medium border-b-2 border-purple-600 pb-2'
            : 'text-gray-500';
    };

    return (
        <div className="flex justify-center mb-8 gap-8 border-b">
            {hasPhysicalProducts && (
                <div className={`px-4 py-2 ${getStepClass('address')}`}>
                    {t('shippingAddress')}
                </div>
            )}

            {hasPhysicalProducts && (
                <div className={`px-4 py-2 ${getStepClass('shipping')}`}>
                    {t('shippingMethod')}
                </div>
            )}

            <div className={`px-4 py-2 ${getStepClass('payment')}`}>
                {t('payment')}
            </div>
        </div>
    );
};

export default CheckoutStepIndicator;