import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { formatPrice } from '@/utils';
import { getSettings } from '@/functions';
import DeliveryForm from '@/components/checkout/DeliveryForm';
import InvoiceSummary from '@/components/checkout/InvoiceSummary';
import { RootState, CartItem, UserAddress } from '@/types';
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const CheckoutPage = () => {
    const { t, i18n } = useTranslation('common');
    const theme = useSelector((state: RootState) => state.theme);
    const cartItems = useSelector((state: RootState) => state.cart);
    const userAddresses = useSelector((state: RootState) => state.user?.addresses || []);
    const lang = i18n.language as 'fa' | 'en';
    const currency = theme?.currency ? t(theme.currency) : 'IRR';

    const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
    const [newAddress, setNewAddress] = useState<UserAddress | null>(null);
    const [deliverySettings, setDeliverySettings] = useState<any[]>([]);
    const [shippingCost, setShippingCost] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);

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
    const calculateShippingCost = (settings: any[], address: UserAddress) => {
        if (!address) return 0;

        let shippingCost = 0;

        // Find the first applicable setting
        const applicableSetting = settings.find(setting => {
            if (!setting.condition) return true;

            const conditionValue = parseFloat(setting.condition);
            if (subtotal >= conditionValue) {
                return parseFloat(setting.priceMoreThanCondition || '0');
            } else {
                return parseFloat(setting.priceLessThanCondition || '0');
            }
        });

        if (applicableSetting) {
            if (applicableSetting.condition) {
                const conditionValue = parseFloat(applicableSetting.condition);
                shippingCost = subtotal >= conditionValue
                    ? parseFloat(applicableSetting.priceMoreThanCondition || '0')
                    : parseFloat(applicableSetting.priceLessThanCondition || '0');
            } else if (applicableSetting.staticPrice) {
                shippingCost = parseFloat(applicableSetting.staticPrice);
            } else if (applicableSetting.perKiloPrice) {
                // Example: calculate based on weight (not implemented here)
                // You would need weight information in your cart items
            }
        }

        return shippingCost;
    };

    // Handle address selection
    const handleAddressSelect = (address: UserAddress) => {
        setSelectedAddress(address);
        setShowNewAddressForm(false);

        if (deliverySettings.length > 0) {
            const cost = calculateShippingCost(deliverySettings, address);
            setShippingCost(cost);
        }
    };

    // Handle new address submission
    const handleNewAddressSubmit = (addressData: UserAddress) => {
        setNewAddress(addressData);
        setSelectedAddress(addressData);
        setShowNewAddressForm(false);

        if (deliverySettings.length > 0) {
            const cost = calculateShippingCost(deliverySettings, addressData);
            setShippingCost(cost);
        }
    };

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

    // Set initial address if available
    useEffect(() => {
        if (userAddresses.length > 0 && !selectedAddress) {
            handleAddressSelect(userAddresses[0]);
        }
    }, [userAddresses, selectedAddress]);

    // Calculate total
    const total = subtotal + shippingCost;

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">{t('checkout')}</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Address Selection */}
                    <div className="lg:col-span-2">
                        {loading && hasPhysicalProducts ? (
                            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                <p>{t('loadingDeliveryOptions')}</p>
                            </div>
                        ) : hasPhysicalProducts ? (
                            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                <h2 className="text-xl font-semibold mb-4">{t('shippingAddress')}</h2>

                                {/* Address Selection */}
                                {userAddresses.length > 0 && !showNewAddressForm && (
                                    <>
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium mb-2">
                                                {t('selectAddress')}
                                            </label>
                                            <div className="space-y-3">
                                                {userAddresses.map((address, index) => (
                                                    <div
                                                        key={index}
                                                        className={`p-4 rounded border cursor-pointer ${
                                                            selectedAddress?.id === address.id
                                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                                : theme === 'dark'
                                                                ? 'border-gray-700 hover:border-gray-500'
                                                                : 'border-gray-300 hover:border-gray-400'
                                                            }`}
                                                        onClick={() => handleAddressSelect(address)}
                                                    >
                                                        <div className="font-medium">{address.fullName}</div>
                                                        <div className="text-sm mt-1">
                                                            {address.address}, {address.city}, {address.province}
                                                        </div>
                                                        <div className="text-sm mt-1">{address.phone}</div>
                                                        <div className="text-sm mt-1">{address.postalCode}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            className={`px-4 py-2 rounded font-medium ${
                                                theme === 'dark'
                                                    ? 'bg-gray-700 hover:bg-gray-600'
                                                    : 'bg-gray-200 hover:bg-gray-300'
                                                }`}
                                            onClick={() => setShowNewAddressForm(true)}
                                        >
                                            {t('addNewAddress')}
                                        </button>
                                    </>
                                )}

                                {/* New Address Form */}
                                {(showNewAddressForm || userAddresses.length === 0) && (
                                    <div className="mt-6">
                                        <DeliveryForm
                                            theme={theme}
                                            onSubmit={handleNewAddressSubmit}
                                            lang={lang}
                                        />

                                        {userAddresses.length > 0 && (
                                            <button
                                                className="mt-4 px-4 py-2 text-gray-600 dark:text-gray-300"
                                                onClick={() => setShowNewAddressForm(false)}
                                            >
                                                {t('cancel')}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Shipping Method */}
                                {selectedAddress && deliverySettings.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-medium mb-4">{t('shippingMethod')}</h3>
                                        <div className="space-y-3">
                                            {deliverySettings.map((method, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-4 rounded border ${
                                                        theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                                                        }`}
                                                >
                                                    <div className="font-medium">{method.title}</div>
                                                    {method.description && (
                                                        <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                                                            {method.description}
                                                        </div>
                                                    )}
                                                    <div className="mt-2 font-medium">
                                                        {formatPrice(
                                                            calculateShippingCost([method], selectedAddress),
                                                            currency
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                <h2 className="text-xl font-semibold mb-4">{t('digitalDelivery')}</h2>
                                <p>{t('digitalDeliveryMessage')}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Invoice Summary */}
                    <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
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