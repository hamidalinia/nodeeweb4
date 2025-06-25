import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TheImage from '@/components/blocks/TheImage'; // Adjust path if needed
import { formatPrice } from '@/utils';


const CartPage = () => {
    const { t, i18n } = useTranslation('common');
    const theme = useSelector((state: RootState) => state.theme);
    const cartItems = useSelector((state: RootState) => state.cart);
    const lang = i18n.language as 'fa' | 'en'; // Assuming these are your supported languages
    const currency = theme?.currency ? t(theme.currency) : '';


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
                                <div className="col-span-3">{t('quantity')}</div>
                                <div className="col-span-2">{t('total')}</div>
                            </div>

                            {cartItems.map((item) => {
                                // Get title based on current language
                                const title = item.title[lang] || item.title.fa;

                                // Handle variations display
                                const variationText = item.type === 'variable' && item.variation
                                    ? Object.entries(item.variation.options)
                                        .map(([key, value]) => `${key}: ${value}`)
                                        .join(', ')
                                    : null;

                                return (
                                    <div key={item.id} className="grid grid-cols-12 gap-4 p-6 border-b">
                                        <div className="col-span-12 md:col-span-5 flex items-center">
                                            <div className="mr-4">
                                                {item.thumbnail && (
                                                    <TheImage
                                                        settings={{
                                                            style: { borderRadius: '0.5rem',width:'90px' ,height:'90px'},
                                                            content: {
                                                                classes: 'rounded-md object-cover',
                                                                src: item.thumbnail || '/default.jpg',
                                                                alt: title,
                                                            },
                                                        }}
                                                    />
                                                )}

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

                                        <div className="col-span-6 md:col-span-2 flex items-center">
                                            <span className="md:hidden font-medium mr-2">
                                                {t('price')}:
                                            </span>
                                            <span>{formatPrice(item.price,currency)}</span>
                                        </div>

                                        <div className="col-span-6 md:col-span-3 flex items-center">
                                            <span className="md:hidden font-medium mr-2">
                                                {t('quantity')}:
                                            </span>
                                            <span>{item.quantity}</span>
                                        </div>

                                        <div className="col-span-12 md:col-span-2 flex items-center justify-end">
                                            <span className="font-medium">
                                                {formatPrice(item.price * item.quantity,currency)}
                                            </span>
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
                                    <span>{formatPrice(cartTotal,currency)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>{t('shipping')}</span>
                                    <span>{t('free_shipping')}</span>
                                </div>

                                <div className="flex justify-between border-t pt-4 font-bold text-lg">
                                    <span>{t('total')}</span>
                                    <span>{formatPrice(cartTotal,currency)}</span>
                                </div>

                                <Link href={'/checkout'} className="block text-center w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition mt-6">
                                    {t('proceed_to_checkout')}
                                </Link>

                                <Link href="/" className="block text-center text-blue-600 hover:underline mt-4">
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