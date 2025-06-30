'use client';

import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { addToWishlist } from '@/store/slices/wishlistSlice';
import { ProductType } from '@/types/product';
import type { ProductCombination } from "@/types/product";
import { useTranslation } from 'next-i18next';
import { Heart } from 'lucide-react';

type Props = {
    item: ProductType;
    variable?: boolean;
    selectedVariation?: ProductCombination | null;
};

export default function AddToWishlistButton({ item, variable = false, selectedVariation = null }: Props) {
    const dispatch = useDispatch();
    const { t } = useTranslation('common');

    if (!item?._id) {
        return <></>;
    }

    const handleAddToWishlist = () => {
        if (variable && !selectedVariation) {
            toast.error(t('Please select a variation'));
            return;
        }

        const payload = {
            id: item._id,
            title: item.title,
            thumbnail: item.thumbnail || '',
            price: variable
                ? selectedVariation?.price
                : item.price,
            variation: variable && selectedVariation ? {
                id: selectedVariation._id,
                options: selectedVariation.options || {}
            } : undefined,
        };

        dispatch(addToWishlist(payload));
        toast.success(t('Added to wishlist'));
    };

    return (
        <button
            onClick={handleAddToWishlist}
            className="wishlist-button cursor-pointer inline-flex items-center justify-center px-5 py-2 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 gap-2"
            type="button"
            aria-label={t('Add to wishlist')}
            disabled={variable && !selectedVariation}
        >
            <Heart className="w-5 h-5" />
            <span>{t('Wishlist')}</span>
        </button>
    );
}