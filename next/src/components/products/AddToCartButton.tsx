'use client';

import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { addToCart } from '@/store/slices/cartSlice';
import { useTranslation } from 'next-i18next';

type Props = {
    product: ProductType;
    onAddToCart?: () => void;
    disabled?: boolean;
    inStock?: boolean;
    maxQuantity?: number;
    className?: string;
};

export default function AddToCartButton({
                                            product,
                                            onAddToCart,
                                            disabled = false,
                                            inStock = true,
                                            maxQuantity,
                                            className = ''
                                        }: Props) {
    const dispatch = useDispatch();
    const { t } = useTranslation('common');

    const isOutOfStock = !inStock || maxQuantity === 0;

    const handleAddToCart = () => {
        if (disabled || isOutOfStock) {
            toast.error(t('Product is not available'));
            return;
        }

        const payload: CartItem = {
            id: product._id,
            type: product.type === 'variable' ? 'variable' : 'normal',
            title: product.title,
            thumbnail: product.thumbnail || '',
            price: product.price || 0,
            salePrice: product.salePrice || 0,
            quantity: 1,
            stock: maxQuantity || product.quantity || 0,
            oneItemPerOrder: product.oneItemPerOrder ?? false,
        };

        dispatch(addToCart(payload));
        toast.success(t('Added to cart'));

        if (onAddToCart) {
            onAddToCart();
        }
    };

    if (!product?._id) return null;

    return (
        <button
            onClick={handleAddToCart}
            className={`add-to-cart-button inline-flex items-center justify-center px-5 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isOutOfStock
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'cursor-pointer text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-900'
            } ${className}`}
            type="button"
            aria-label={t('Add to cart')}
            disabled={disabled || isOutOfStock}
        >
            {isOutOfStock ? t('Product is out of stock') : t('Add to cart')}
        </button>
    );
}
