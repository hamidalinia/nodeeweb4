import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { formatPrice } from '@/utils';
import { getSettings, getAddress, saveAddress } from '@/functions';
import DeliveryForm from '@/components/checkout/DeliveryForm';
import InvoiceSummary from '@/components/checkout/InvoiceSummary';
import { RootState, CartItem, UserAddress } from '@/types';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const CheckoutPage = () => {
    const { t, i18n } = useTranslation('common');
    const theme = useSelector((state: RootState) => state.theme);
    const cartItems = useSelector((state: RootState) => state.cart);
    const reduxAddresses = useSelector((state: RootState) => state.user?.addresses || []);
    const lang = i18n.language as 'fa' | 'en';
    const currency = theme?.currency ? t(theme.currency) : 'IRR';

    const [addresses, setAddresses] = useState<UserAddress[]>(reduxAddresses);
    const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
    const [deliverySettings, setDeliverySettings] = useState<any[]>([]);
    const [shippingCost, setShippingCost] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeStep, setActiveStep] = useState<'address' | 'shipping'>('address');
    const [selectedShippingMethod, setSelectedShippingMethod] = useState<number>(0);

    // Check if cart contains physical products
    const hasPhysicalProducts = cartItems.some(
        (item: CartItem) => !item.isVirtual
    );

    // Calculate subtotal
    const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
        0
    );

    // Calculate shipping cost based on settings
    const calculateShippingCost = (method: any, address: UserAddress) => {
        if (!address) return 0;

        let cost = 0;

        if (method.condition) {
            const conditionValue = parseFloat(method.condition);
            cost = subtotal >= conditionValue
                ? parseFloat(method.priceMoreThanCondition || '0')
                : parseFloat(method.priceLessThanCondition || '0');
        } else if (method.staticPrice) {
            cost = parseFloat(method.staticPrice);
        } else if (method.perKiloPrice) {
            // Placeholder for weight-based calculation
            cost = 5; // Default shipping cost
        }

        return cost;
    };

    // Handle address selection
    const handleAddressSelect = (address: UserAddress) => {
        setSelectedAddress(address);
        setActiveStep('shipping');

        if (deliverySettings.length > 0) {
            const cost = calculateShippingCost(deliverySettings[selectedShippingMethod], address);
            setShippingCost(cost);
        }
    };

    // Handle new address submission
    const handleNewAddressSubmit = async (addressData: UserAddress) => {
        try {
            setLoading(true);
            // Save new address to database
            const savedAddress = await saveAddress(addressData);

            // Update addresses list
            const updatedAddresses = [...addresses, savedAddress];
            setAddresses(updatedAddresses);

            // Select the new address
            handleAddressSelect(savedAddress);
        } catch (err) {
            setError(t('failedToSaveAddress'));
            console.error('Failed to save address:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle shipping method selection
    const handleShippingSelect = (index: number) => {
        setSelectedShippingMethod(index);
        if (selectedAddress) {
            const cost = calculateShippingCost(deliverySettings[index], selectedAddress);
            setShippingCost(cost);
        }
    };

    // Load addresses if not in Redux
    useEffect(() => {
        const fetchAddresses = async () => {
            if (reduxAddresses.length === 0) {
                try {
                    setLoading(true);
                    const fetchedAddresses = await getAddress();
                    setAddresses(fetchedAddresses);

                    if (fetchedAddresses.length > 0) {
                        setSelectedAddress(fetchedAddresses[0]);
                    }
                } catch (err) {
                    setError(t('failedToLoadAddresses'));
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchAddresses();
    }, [reduxAddresses, t]);

    // Load delivery settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const settings = await getSettings('delivery');
                setDeliverySettings(settings);
            } catch (err) {
                setError(t('failedToLoadSettings'));
                console.error('Failed to load delivery settings:', err);
            } finally {
                setLoading(false);
            }
        };

        if (hasPhysicalProducts) {
            fetchSettings();
        }
    }, [hasPhysicalProducts, t]);

    // Calculate total
    const total = subtotal + shippingCost;

    // Step indicators for better UX
    const StepIndicator = ({ step, title }: { step: string, title: string }) => (
        <div
            className={`flex items-center cursor-pointer ${activeStep === step ? 'text-purple-600 dark:text-purple-400 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveStep(step)}
        >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                activeStep === step
                    ? 'bg-purple-600 text-white dark:bg-purple-700'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                {step === 'address' ? '1' : '2'}
            </div>
            <span>{title}</span>
        </div>
    );

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8 text-center">{t('checkout')}</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Step Indicators */}
                <div className="flex justify-center mb-8 gap-8">
                    <StepIndicator step="address" title={t('shippingAddress')} />
                    {hasPhysicalProducts && (
                        <StepIndicator step="shipping" title={t('shippingMethod')} />
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Checkout Steps */}
                    <div className="lg:col-span-2">
                        {loading ? (
                            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} flex justify-center items-center h-64`}>
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                            </div>
                        ) : hasPhysicalProducts ? (
                            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                {/* Address Step */}
                                {activeStep === 'address' && (
                                    <div className="animate-fadeIn">
                                        <h2 className="text-xl font-semibold mb-4">{t('shippingAddress')}</h2>

                                        {addresses.length > 0 ? (
                                            <>
                                                <div className="mb-6">
                                                    <label className="block text-sm font-medium mb-2">
                                                        {t('selectAddress')}
                                                    </label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {addresses.map((address, index) => (
                                                            <div
                                                                key={index}
                                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                                    selectedAddress?.id === address.id
                                                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md'
                                                                        : theme === 'dark'
                                                                        ? 'border-gray-700 hover:border-gray-500'
                                                                        : 'border-gray-200 hover:border-gray-400'
                                                                    }`}
                                                                onClick={() => handleAddressSelect(address)}
                                                            >
                                                                <div className="font-medium flex items-center">
                                                                    {address.fullName}
                                                                    {address.isDefault && (
                                                                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                                                            {t('default')}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-sm mt-2">
                                                                    {address.address}, {address.city}, {address.province}
                                                                </div>
                                                                <div className="text-sm mt-1">{address.phone}</div>
                                                                <div className="text-sm mt-1">{address.postalCode}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                                                        theme === 'dark'
                                                            ? 'bg-gray-700 hover:bg-gray-600'
                                                            : 'bg-gray-200 hover:bg-gray-300'
                                                        }`}
                                                    onClick={() => setActiveStep('address')}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {t('addNewAddress')}
                                                </button>
                                            </>
                                        ) : (
                                            <DeliveryForm
                                                theme={theme}
                                                onSubmit={handleNewAddressSubmit}
                                                lang={lang}
                                                showCancel={false}
                                            />
                                        )}
                                    </div>
                                )}

                                {/* Shipping Method Step */}
                                {activeStep === 'shipping' && selectedAddress && (
                                    <div className="animate-fadeIn">
                                        <div className="mb-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('selectedAddress')}</h3>
                                            <div className="font-medium">{selectedAddress.fullName}</div>
                                            <div className="text-sm">
                                                {selectedAddress.address}, {selectedAddress.city}
                                            </div>
                                            <button
                                                className="mt-2 text-purple-600 dark:text-purple-400 text-sm font-medium"
                                                onClick={() => setActiveStep('address')}
                                            >
                                                {t('change')}
                                            </button>
                                        </div>

                                        <h2 className="text-xl font-semibold mb-4">{t('shippingMethod')}</h2>

                                        {deliverySettings.length > 0 ? (
                                            <div className="space-y-4">
                                                {deliverySettings.map((method, index) => (
                                                    <div
                                                        key={index}
                                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                            selectedShippingMethod === index
                                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md'
                                                                : theme === 'dark'
                                                                ? 'border-gray-700 hover:border-gray-500'
                                                                : 'border-gray-200 hover:border-gray-400'
                                                            }`}
                                                        onClick={() => handleShippingSelect(index)}
                                                    >
                                                        <div className="flex items-start">
                                                            <div className={`flex items-center h-5 mt-1 mr-3 ${
                                                                selectedShippingMethod === index
                                                                    ? 'text-purple-600 dark:text-purple-400'
                                                                    : 'text-gray-500'
                                                                }`}>
                                                                <input
                                                                    type="radio"
                                                                    checked={selectedShippingMethod === index}
                                                                    onChange={() => handleShippingSelect(index)}
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
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                {t('noShippingMethods')}
                                            </div>
                                        )}

                                        <div className="mt-8 flex justify-between">
                                            <button
                                                className="px-6 py-3 rounded-lg font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                                                onClick={() => setActiveStep('address')}
                                            >
                                                {t('back')}
                                            </button>
                                            <button
                                                className="px-6 py-3 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white"
                                                onClick={() => console.log('Proceed to payment')}
                                            >
                                                {t('continueToPayment')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                <h2 className="text-xl font-semibold mb-4">{t('digitalDelivery')}</h2>
                                <p className="mb-4">{t('digitalDeliveryMessage')}</p>
                                <button
                                    className="px-6 py-3 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white"
                                    onClick={() => console.log('Proceed to payment')}
                                >
                                    {t('continueToPayment')}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Invoice Summary (Always visible) */}
                    <div className={`sticky top-4 h-fit p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <InvoiceSummary
                            items={cartItems}
                            theme={theme}
                            lang={lang}
                            currency={currency}
                            subtotal={subtotal}
                            shippingCost={shippingCost}
                            total={total}
                            hasPhysicalProducts={hasPhysicalProducts}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export async function getStaticProps({ locale }: { locale: string }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}

export default CheckoutPage;