import React, { useState } from 'react';
import Link from 'next/link';
import AddToCartButton from '@/components/products/AddToCartButton';
import { NormalizePrice, PriceFormat } from '@/utils';
import type { ProductType } from '@/types/product';
import type { ProductCombination } from '@/types/product';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { formatPrice } from '@/utils';
import { getBaseUrl } from '@/constants/config';
import { useTranslation } from 'next-i18next';
import TheImage from '@/components/blocks/TheImage';

type Props = {
    product: ProductType;
};

const ProductCard = ({ product }: Props) => {
    let BaseConfig = getBaseUrl();
    const { t } = useTranslation('common');
    BaseConfig = 'https://asakala.shop';
    const theme = useSelector((state: RootState) => state.theme);
    const [selectedVariation, setSelectedVariation] = useState<ProductCombination | null>(null);
    const [selectedCombinationId, setSelectedCombinationId] = useState(
        product.combinations?.[0]?.id ?? null
    );

    const getStockStatus = () => {
        // For products with combinations
        if (product.combinations?.length) {
            const combination = product.combinations.find(c => c.id === selectedCombinationId) ??
                product.combinations[0];
            return {
                inStock: combination?.in_stock ?? false,
                quantity: combination?.quantity ?? 0
            };
        }

        // For simple products (no combinations)
        return {
            inStock: product.in_stock ?? false,
            quantity: product.quantity ?? 0
        };
    };

    const { inStock, quantity: availableQuantity } = getStockStatus();

    const selectedCombination = product.combinations?.find(c => c.id === selectedCombinationId)
        ?? product.combinations?.[0]
        ?? {
            id: null,
            options: {},
            in_stock: product.in_stock ?? false,
            price: product.price || 0,
            quantity: product.quantity ?? 0,
            discounted_price: product.discounted_price
        };

    const [imgSrc, setImgSrc] = useState(
        product.thumbnail
            ? product.thumbnail.startsWith('/')
                ? BaseConfig + product.thumbnail
                : `${BaseConfig}/${product.thumbnail}`
            : '/default.jpg'
    );

    let currency = theme?.currency ? t(theme.currency) : '';

    const taxRate = theme?.tax && theme?.taxAmount
        ? 1 + parseFloat(String(theme.taxAmount)) / 100
        : 1;

    // Initialize with product prices
    let basePrice: number | undefined = product.price ? Number(product.price) : undefined;
    let baseSalePrice: number | undefined = product.salePrice ? Number(product.salePrice) : undefined;

    // Handle combinations if they exist
    if (product.combinations?.length) {
        let minPrice = Infinity;
        product.combinations.forEach((com) => {
            const comboPrice = com.price ? Number(com.price) : Infinity;
            const comboSalePrice = com.salePrice ? Number(com.salePrice) : comboPrice;
            const normalizedComboPrice = NormalizePrice(comboSalePrice);

            if (normalizedComboPrice < minPrice) {
                minPrice = normalizedComboPrice;
                basePrice = comboPrice;
                baseSalePrice = comboSalePrice;
            }
        });
    }

    // Calculate normalized prices with tax
    const normalizedPrice = basePrice !== undefined
        ? Math.round(NormalizePrice(basePrice) * taxRate)
        : undefined;

    const normalizedSalePrice = baseSalePrice !== undefined
        ? Math.round(NormalizePrice(baseSalePrice) * taxRate)
        : undefined;

    // Format prices for display
    const displayPrice = normalizedPrice !== undefined
        ? PriceFormat(normalizedPrice)
        : '';

    const displaySalePrice = normalizedSalePrice !== undefined
        ? PriceFormat(normalizedSalePrice)
        : undefined;

    const title = product.title?.fa || '';

    const handleAddToCart = () => {
        console.log('Adding to cart:', {
            product: product.title?.fa,
            inStock,
            availableQuantity,
            selectedCombination
        });
        // Your actual add to cart logic here
    };

    return (
        <div className="product-card rounded-lg border p-3 shadow-sm hover:shadow-md transition cursor-pointer bg-white dark:bg-gray-900 dark:text-white">
            <Link href={`/product/${product.slug}`} passHref>
                <div className="relative aspect-square">
                    <TheImage
                        settings={{
                            style: { borderRadius: '0.5rem' },
                            content: {
                                classes: 'rounded-md object-cover',
                                src: product.thumbnail || '/default.jpg',
                                alt: title,
                            },
                        }}
                    />
                </div>
                <h3 className="mt-2 text-md font-medium line-clamp-3">{title}</h3>
            </Link>

            <div className="product-price-wrapper w-full mt-2 flex items-center justify-center">
                {displaySalePrice ? (
                    <div className="flex flex-col">
                        <span className="text-green-600 font-semibold whitespace-nowrap">
                            {formatPrice(displaySalePrice, currency)}
                        </span>
                        {normalizedPrice !== normalizedSalePrice && (
                            <span className="line-through text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                {formatPrice(displayPrice, currency)}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="text-gray-800 dark:text-gray-100 font-semibold whitespace-nowrap">
                        {formatPrice(displayPrice, currency)}
                    </div>
                )}
            </div>

            <div className="w-full mt-2 flex items-center justify-center">
                <AddToCartButton
                    product={product}
                    onAddToCart={() => console.log('Add to cart:', product)}
                    disabled={!inStock}
                    inStock={inStock}
                    maxQuantity={availableQuantity}
                    className="mb-6"
                />

            </div>
        </div>
    );
};

export default ProductCard;