// pages/checkout.tsx
import { useState, useEffect, useCallback, useRef,useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { getSettings, getAddress, updateAddress } from '@/functions';
import CheckoutStepIndicator from '@/components/checkout/CheckoutStepIndicator';
import AddressStep from '@/components/checkout/AddressStep';
import ShippingMethodStep from '@/components/checkout/ShippingMethodStep';
import PaymentStep from '@/components/checkout/PaymentStep';
import { CartItem } from '@/types/cart';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from 'next/router';
import {usePathname, useSearchParams} from "next/navigation";
const VALID_TABS = ['address', 'orders', 'transactions'];
import type { RootState } from '@/store';

const CheckoutPage = () => {
    const { t, i18n } = useTranslation('common');
    type Step = 'address' | 'shipping' | 'payment';
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const queryStep = searchParams.get('step') as Step | null;
    const activeTab: Step =
        queryStep && VALID_TABS.includes(queryStep)
            ? (queryStep as Step)
            : 'address';
    // const queryStep = router.query.step as 'address' | 'shipping' | 'payment' | undefined;
// console.log("queryStep",queryStep,activeTab)
    const theme = useSelector((state: RootState) => state.theme);
    const themeMode=theme?.mode;

    const cartItems = useSelector((state: RootState) => state.cart);
    const isCartReady = cartItems?.length > 0;

    const user = useSelector((state: RootState) => state.user);
    const reduxAddresses = user?.address || [];
    const lang = i18n.language as 'fa' | 'en';
    const currency = theme?.currency ? t(theme.currency) : 'IRR';

    const [apiAddresses, setApiAddresses] = useState<any[]>([]);
    const addresses = reduxAddresses.length > 0 ? reduxAddresses : apiAddresses;
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [deliverySettings, setDeliverySettings] = useState<any[]>([]);
    const [shippingCost, setShippingCost] = useState(0);
    const [loading, setLoading] = useState(true);
    const [addressLoading, setAddressLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeStep, setActiveStepState] = useState<Step>(activeTab);


    const [selectedShippingMethod, setSelectedShippingMethod] = useState<number>(0);


    // Always update the query string when step changes
    const setActiveStep = useCallback((step: 'address' | 'shipping' | 'payment') => {
        setActiveStepState(step);
        router.push({
            pathname: router.pathname,
            query: { ...router.query, step },
        }, undefined, { shallow: true }); // shallow avoids full reload
    }, [router]);

    const hasFetchedAddresses = useRef(false);

    const hasPhysicalProducts = useMemo(() => {
        if (!cartItems || cartItems.length === 0) {
            console.log('🟡 cartItems not ready');
            return false;
        }

        const result = cartItems.some((item: CartItem) => {
            const isPhysical = item.isVirtual !== true && (item.price > 0 || (item.salePrice || 0) > 0);
            console.log('✅ Item:', item.title?.fa, '| IsPhysical:', isPhysical);
            return isPhysical;
        });

        console.log('📦 Has Physical Products:', result);
        return result;
    }, [cartItems]);


    useEffect(() => {
        console.log("queryStep is:",queryStep)
        if (queryStep === 'address' || queryStep === 'shipping' || queryStep === 'payment') {
            setActiveStepState(queryStep);
        } else if (!hasPhysicalProducts && isCartReady) {
            setActiveStep('payment');
        }
        // if(!queryStep){
        //     setActiveStep('address');
        //
        // }
    }, [queryStep, hasPhysicalProducts, isCartReady, setActiveStep]);



    // Calculate subtotal (exclude zero-price items)
    const subtotal = useCallback(() => {
        return cartItems.reduce((sum, item) => {
            const price = item.salePrice || item.price;
            return price > 0 ? sum + price * item.quantity : sum;
        }, 0);
    }, [cartItems]);

    // Calculate shipping cost
    const calculateShippingCost = useCallback((method: any, address: any) => {
        if (!address) return 0;
        let cost = 0;

        if (method.condition) {
            const conditionValue = parseFloat(method.condition);
            cost = subtotal() >= conditionValue
                ? parseFloat(method.priceMoreThanCondition || '0')
                : parseFloat(method.priceLessThanCondition || '0');
        } else if (method.staticPrice) {
            cost = parseFloat(method.staticPrice);
        }
        return cost;
    }, [subtotal]);

    // Handle address selection
    const handleAddressSelect = useCallback((address: any) => {
        console.log('Selected address:', address);
        const hasPhysical = hasPhysicalProducts;
        console.log('Redirecting to:', hasPhysical ? 'shipping' : 'payment');
        setSelectedAddress(address);
        setActiveStep(hasPhysical ? 'shipping' : 'payment');
    }, [hasPhysicalProducts]);


    // Handle new address submission
    const handleNewAddressSubmit = useCallback(async (addressData: any) => {
        try {
            setLoading(true);
            const savedAddress = await updateAddress(addressData);
            setApiAddresses(prev => [...prev, savedAddress]);
            handleAddressSelect(savedAddress);
        } catch (err) {
            setError(t('failedToupdateAddress'));
        } finally {
            setLoading(false);
        }
    }, [handleAddressSelect, t]);

    // Handle shipping method selection
    const handleShippingSelect = useCallback((index: number) => {
        setSelectedShippingMethod(index);
        if (selectedAddress) {
            const cost = calculateShippingCost(deliverySettings[index], selectedAddress);
            setShippingCost(cost);
        }
        setActiveStep('payment');
    }, [deliverySettings, selectedAddress, calculateShippingCost]);

    // Load addresses if not in Redux
    useEffect(() => {
        if (reduxAddresses.length === 0 && !hasFetchedAddresses.current) {
            hasFetchedAddresses.current = true;

            const fetchAddresses = async () => {
                try {
                    setAddressLoading(true);
                    const response = await getAddress();
                    if (response.success) {
                        setApiAddresses(response.customer.address);
                        // if (response.customer.address.length > 0) {
                        //     handleAddressSelect(response.customer.address[0]);
                        // }

                    }
                } catch (err) {
                    setError(t('failedToLoadAddresses'));
                } finally {
                    setAddressLoading(false);
                }
            };
            fetchAddresses();
        }
    }, [reduxAddresses, t]);

    // Load delivery settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const settings = await getSettings();
                setDeliverySettings(settings);
            } catch (err) {
                setError(t('failedToLoadSettings'));
            } finally {
                setLoading(false);
            }
        };

        if (hasPhysicalProducts) {
            fetchSettings();
        } else {
            setShippingCost(0);
        }
    }, [hasPhysicalProducts, t]);

    // Calculate total
    const total = subtotal() + shippingCost;

    // Determine initial step based on product type
    useEffect(() => {
        if (!hasPhysicalProducts && isCartReady) {
            setActiveStep('payment');
        }
    }, [hasPhysicalProducts,isCartReady]);

    return (
        <div className={`min-h-screen ${themeMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8 text-center">{t('checkout')}</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Step Indicators */}
                <CheckoutStepIndicator
                    activeStep={activeStep}
                    hasPhysicalProducts={hasPhysicalProducts}
                    t={t}
                />

                <div className="max-w-4xl mx-auto">
                    {/* Step 1: Address Selection (only for physical products) */}
                    {activeStep === 'address' && hasPhysicalProducts && (
                        <AddressStep
                            theme={theme}
                            t={t}
                            addresses={addresses}
                            selectedAddress={selectedAddress}
                            addressLoading={addressLoading}
                            handleAddressSelect={handleAddressSelect}
                            handleNewAddressSubmit={handleNewAddressSubmit}
                            lang={lang}
                        />
                    )}

                    {/* Step 2: Shipping Method (only for physical products) */}
                    {activeStep === 'shipping' && hasPhysicalProducts && selectedAddress && (
                        <ShippingMethodStep
                            theme={theme}
                            selectedAddress={selectedAddress}
                            deliverySettings={deliverySettings}
                            selectedShippingMethod={selectedShippingMethod}
                            handleShippingSelect={handleShippingSelect}
                            calculateShippingCost={calculateShippingCost}
                            currency={currency}
                            setActiveStep={setActiveStep}
                        />
                    )}

                    {/* Step 3: Payment (final step for all products) */}
                    {activeStep === 'payment' && (
                        <PaymentStep
                            theme={theme}
                            t={t}
                            setActiveStep={setActiveStep}
                            hasPhysicalProducts={hasPhysicalProducts}
                            items={cartItems}
                            shippingCost={shippingCost}
                            currentLang={lang}
                            selectedAddress={selectedAddress}
                            subtotal={subtotal()}
                            total={total}
                        />
                    )}
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