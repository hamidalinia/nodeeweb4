'use client';

import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { addToCart } from '@/store/slices/cartSlice';
import { ProductType } from '@/types/product';
import type { ProductCombination } from "@/types/product";
import type { CartItem } from "@/types/cart";
import { useTranslation } from 'next-i18next'

type Props = {
    item: ProductType;
    variable?: boolean;
    selectedVariation?: ProductCombination | null;
};


export default function AddToCartButton({ item, variable = false, selectedVariation = null }: Props) {
    const dispatch = useDispatch();
    console.log("_item",item)

    if(!item?._id){
        return <></>
    }
    console.log("_item",item,item._id)

    const { t } = useTranslation('common');
    // if (!ready) return <></>;
    // console.log(ready)
    // console.log(t('Add to cart'))
    const handleAddToCart = () => {
        if (variable && !selectedVariation) {
            toast.error(t('Please select a variation'));
            return;
        }

        // Helper function to safely convert to number
        const toNumber = (value: string | number | null | undefined): number => {
            if (value === null || value === undefined) return 0;
            return typeof value === 'string' ? parseFloat(value) || 0 : value;
        };

        // Map the variation to match CartItem's expected structure
        const mappedVariation = variable && selectedVariation ? {
            id: toNumber(selectedVariation._id), // Assuming _id exists on ProductCombination
            options: selectedVariation.options || {} // Assuming options exists on ProductCombination
        } : undefined;

        const payload: CartItem = {
            id: item._id,
            type: item.type === 'variable' ? 'variable' : 'normal',
            title: item.title,
            thumbnail: item.thumbnail || '',
            price: variable
                ? toNumber(selectedVariation?.price)
                : toNumber(item.price),
            salePrice: variable
                ? toNumber(selectedVariation?.salePrice)
                : toNumber(item.salePrice),
            quantity: 1,
            stock: variable
                ? toNumber(selectedVariation?.quantity)
                : toNumber(item.quantity),
            oneItemPerOrder: item.oneItemPerOrder ?? false,
            variation: mappedVariation,
        };

        dispatch(addToCart(payload));

        toast.success(t('Added to cart'));
    };

    return (
        <button
            onClick={handleAddToCart}
            className="add-to-cart-button cursor-pointer inline-flex items-center justify-center px-5 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            type="button"
            aria-label={t('Add to cart')}
            disabled={variable && !selectedVariation}
        >
            {t('Add to cart')}
        </button>
    );
}