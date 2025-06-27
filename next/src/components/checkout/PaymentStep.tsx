// components/checkout/PaymentStep.tsx
import React, { useState, useEffect } from 'react';
import { CartItem } from '@/types/cart';
import { getGateways } from '@/functions';
import { formatPrice } from '@/utils';
import { ThemeData } from '@/types/themeData';

interface PaymentStepProps {
    theme: ThemeData;
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

interface Gateway {
    _id: string;
    title: { [key: string]: string };
    description: { [key: string]: string };
    slug: string;
    active: boolean;
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
    const currency = theme?.currency ? t(theme.currency) : '';
    const themeMode=theme?.mode;

    const [gateways, setGateways] = useState<Gateway[]>([]);
    const [selectedGateway, setSelectedGateway] = useState<string>('');
    const [loadingGateways, setLoadingGateways] = useState(true);

    // Helper function to get localized text
    const getLocalizedText = (textObj: { [key: string]: string }, fallbackKey = 'fa'): string => {
        if (textObj[currentLang]) return textObj[currentLang];
        if (textObj.en) return textObj.en;
        if (textObj[fallbackKey]) return textObj[fallbackKey];

        // Return first available text if none match
        const keys = Object.keys(textObj);
        return keys.length > 0 ? textObj[keys[0]] : '';
    };

    // Fetch payment gateways on component mount
    useEffect(() => {
        const fetchGateways = async () => {
            try {
                const allGateways = await getGateways();

                // Filter out unwanted gateways and inactive ones
                const validGateways = allGateways.filter((gateway:any)=>
                    gateway.active

                );

                setGateways(validGateways);

                // Set default selection to first available gateway
                if (validGateways.length > 0) {
                    setSelectedGateway(validGateways[0]._id);
                }
            } catch (error) {
                console.error('Failed to load payment gateways:', error);
            } finally {
                setLoadingGateways(false);
            }
        };

        fetchGateways();
    }, []);

    const getItemName = (item: CartItem) => {
        return currentLang === 'fa'
            ? item.title.fa
            : (item.title.en || item.title.fa);
    };

    const handlePayment = () => {
        const selected = gateways.find(gw => gw._id === selectedGateway);
        if (selected) {
            console.log('Processing payment with:', selected.slug);
            // Add actual payment processing logic here
        }
    };

    return (
        <div className={`p-6 rounded-lg ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-6">{t('payment')}</h2>

            {/* Order Summary Section */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">{t('orderSummary')}</h3>

                {hasPhysicalProducts && selectedAddress && (
                    <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">{t('shippingAddress')}</h4>
                        <div className="font-medium">{selectedAddress.fullName}</div>
                        <div className="text-sm">
                            {selectedAddress.address}, {selectedAddress.city}
                        </div>
                    </div>
                )}

                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                    {items.map(item => {
                        const price = item.salePrice || item.price;
                        if (price <= 0) return null;

                        return (
                            <div key={item.id} className="flex justify-between text-sm pb-2 border-b">
                                <div className="flex-1 truncate">
                                    <div className="font-medium">
                                        {getItemName(item)}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        {item.quantity} × {formatPrice(price, currency)}
                                    </div>
                                </div>
                                <div className="ml-4 min-w-[90px] text-right">
                                    <span className="font-medium">
                                        {formatPrice(price * item.quantity, currency)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="border-t my-4 pt-4 space-y-2">
                    <div className="flex justify-between">
                        <span>{t('subtotal')}</span>
                        <span className="font-medium">
                            {formatPrice(subtotal, currency)}
                        </span>
                    </div>

                    {hasPhysicalProducts && shippingCost > 0 && (
                        <div className="flex justify-between">
                            <span>{t('shipping')}</span>
                            <span className="font-medium">
                                {formatPrice(shippingCost, currency)}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                        <span>{t('total')}</span>
                        <span>
                            {formatPrice(total, currency)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Payment Methods Section */}
            <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">{t('selectPaymentMethod')}</h3>

                {loadingGateways ? (
                    <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                        <p className="mt-2 text-gray-500">{t('loadingPaymentMethods')}</p>
                    </div>
                ) : gateways.length === 0 ? (
                    <div className="text-center py-4">
                        <div className="text-red-500 font-medium mb-2">{t('noPaymentMethods')}</div>
                        <p className="text-gray-500 text-sm">{t('contactSupportMessage')}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {gateways.map(gateway => (
                            <div
                                key={gateway._id}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                    selectedGateway === gateway._id
                                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 shadow-md'
                                        : themeMode === 'dark'
                                        ? 'border-gray-700 hover:border-gray-500'
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                onClick={() => setSelectedGateway(gateway._id)}
                            >
                                <div className="flex items-start">
                                    <input
                                        type="radio"
                                        name="payment"
                                        className="mt-1 w-5 h-5 mr-3 ml-3"
                                        checked={selectedGateway === gateway._id}
                                        onChange={() => setSelectedGateway(gateway._id)}
                                    />
                                    <div>
                                        <div className="font-medium text-lg">
                                            {getLocalizedText(gateway.title)}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {getLocalizedText(gateway.description)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-between">
                <button
                    className="px-6 py-3 rounded-lg font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => setActiveStep(hasPhysicalProducts ? 'shipping' : 'address')}
                >
                    {t('back')}
                </button>

                <button
                    className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                        gateways.length === 0 || loadingGateways
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                    onClick={handlePayment}
                    disabled={gateways.length === 0 || loadingGateways}
                >
                    {t('completePurchase')}
                </button>
            </div>
        </div>
    );
};

export default PaymentStep;