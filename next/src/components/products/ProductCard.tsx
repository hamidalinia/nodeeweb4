import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';
import { NormalizePrice, PriceFormat } from '@/utils';
import type { ProductType } from '@/types/product';
import type { ProductCombination } from '@/types/product';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { formatPrice } from '@/utils';
import { getBaseUrl } from '@/constants/config';
import { useTranslation } from 'next-i18next'
import TheImage from '@/components/blocks/TheImage'; // Adjust path if needed

type Props = {
    product: ProductType;
};

const ProductCard = ({ product }: Props) => {
    let BaseConfig=getBaseUrl();
    const { t,ready } = useTranslation('common');
    BaseConfig='https://asakala.shop'
    const theme = useSelector((state: RootState) => state.theme);
    const [selectedVariation, setSelectedVariation] = useState<ProductCombination | null>(null);
    const [imgSrc, setImgSrc] = useState(product.thumbnail
        ? product.thumbnail.startsWith('/')
            ? BaseConfig+product.thumbnail
            : `${BaseConfig}/${product.thumbnail}`
        : '/default.jpg');
    let currency = theme.data?.currency ? t(theme.data.currency) : '';

    const taxRate = theme.data?.tax && theme.data?.taxAmount
        ? 1 + parseFloat(theme.data.taxAmount) / 100
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
        ? (Math.round(NormalizePrice(basePrice) * taxRate)) : undefined;

    const normalizedSalePrice = baseSalePrice !== undefined
        ? (Math.round(NormalizePrice(baseSalePrice) * taxRate)) : undefined;

    // Format prices for display
    const displayPrice = normalizedPrice !== undefined
        ? PriceFormat(normalizedPrice) : '';

    const displaySalePrice = normalizedSalePrice !== undefined
        ? PriceFormat(normalizedSalePrice) : undefined;

    const title = product.title?.fa || '';
    // let imageSrc = product.thumbnail || '/default.jpg';
    //  imageSrc = product.thumbnail
    //     ? product.thumbnail.startsWith('/')
    //         ? product.thumbnail
    //         : `/${product.thumbnail}`
    //     : '/default.jpg';
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
                item={product}
                variable={product.type === 'variable'}
                selectedVariation={selectedVariation}
            />
            </div>
        </div>
    );
};

export default ProductCard;