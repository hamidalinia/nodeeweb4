import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { removeFromCart  } from '@/store';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TheImage from '@/components/blocks/TheImage';
import { formatPrice } from '@/utils';

const CartPage = () => {
    const { t, i18n } = useTranslation('common');
    const theme = useSelector((state: RootState) => state.theme);
    const cartItems = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const lang = i18n.language as 'fa' | 'en';
    const currency = theme?.currency ? t(theme.currency) : '';

    // Delete item function with confirmation
    const handleDeleteItem = (itemId: string) => {
        if (window.confirm(t('confirm_delete'))) {
            dispatch(removeFromCart (itemId));
        }
    };

    // Calculate total
    const cartTotal = cartItems.reduce(
        (total, item) => total + (item.price * item.quantity),
        0
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{t('cart_title')}</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl mb-4">{t('empty_cart')}</p>
                    <Link href="/" className="text-blue-600 hover:underline">
                        {t('continue_shopping')}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100 font-semibold">
                                <div className="col-span-5">{t('product')}</div>
                                <div className="col-span-2">{t('price')}</div>
                                <div className="col-span-2">{t('quantity')}</div>
                                <div className="col-span-2">{t('total')}</div>
                                <div className="col-span-1">{t('action')}</div>
                            </div>

                            {cartItems.map((item) => {
                                const title = item.title[lang] || item.title.fa;
                                const variationText = item.type === 'variable' && item.variation
                                    ? Object.entries(item.variation.options)
                                        .map(([key, value]) => `${key}: ${value}`)
                                        .join(', ')
                                    : null;

                                return (
                                    <div key={item.id} className="grid grid-cols-12 gap-4 p-6 border-b items-center">
                                        {/* Product Info */}
                                        <div className="col-span-12 md:col-span-5 flex items-center">
                                            <div className="mr-4">
                                                <TheImage
                                                    settings={{
                                                        style: { borderRadius: '0.5rem', width: '90px', height: '90px' },
                                                        content: {
                                                            classes: 'rounded-md object-cover',
                                                            src: item.thumbnail || '/default.jpg',
                                                            alt: title,
                                                        },
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{title}</h3>
                                                {variationText && (
                                                    <p className="text-sm text-gray-500">
                                                        {t('variation')}: {variationText}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="col-span-6 md:col-span-2 flex items-center">
                                            <span className="md:hidden font-medium mr-2">{t('price')}:</span>
                                            <span>{formatPrice(item.price, currency)}</span>
                                        </div>

                                        {/* Quantity */}
                                        <div className="col-span-6 md:col-span-2 flex items-center">
                                            <span className="md:hidden font-medium mr-2">{t('quantity')}:</span>
                                            <span>{item.quantity}</span>
                                        </div>

                                        {/* Total */}
                                        <div className="col-span-6 md:col-span-2 flex items-center">
                                            <span className="md:hidden font-medium mr-2">{t('total')}:</span>
                                            <span className="font-medium">
                        {formatPrice(item.price * item.quantity, currency)}
                      </span>
                                        </div>

                                        {/* Delete Button */}
                                        <div className="col-span-6 md:col-span-1 flex items-center justify-end">
                                            <button
                                                onClick={() => handleDeleteItem(item.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                title={t('remove_item')}
                                                aria-label={t('remove_item')}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">{t('order_summary')}</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span>{t('subtotal')}</span>
                                    <span>{formatPrice(cartTotal, currency)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t('shipping')}</span>
                                    <span>{t('free_shipping')}</span>
                                </div>
                                <div className="flex justify-between border-t pt-4 font-bold text-lg">
                                    <span>{t('total')}</span>
                                    <span>{formatPrice(cartTotal, currency)}</span>
                                </div>
                                <Link
                                    href="/checkout"
                                    className="block w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition text-center"
                                >
                                    {t('proceed_to_checkout')}
                                </Link>
                                <Link
                                    href="/"
                                    className="block text-center text-blue-600 hover:underline mt-4"
                                >
                                    {t('continue_shopping')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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

export default CartPage;