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

type Props = {
    product: ProductType;
};

const ProductCard = ({ product }: Props) => {
    let BaseConfig=getBaseUrl()
    BaseConfig='https://asakala.shop'
    const theme = useSelector((state: RootState) => state.theme);
    const [selectedVariation, setSelectedVariation] = useState<ProductCombination | null>(null);
    const [imgSrc, setImgSrc] = useState(product.thumbnail
        ? product.thumbnail.startsWith('/')
            ? BaseConfig+product.thumbnail
            : `${BaseConfig}/${product.thumbnail}`
        : '/default.jpg');
    const currency = theme.data?.currency || 'تومان';
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
        ? PriceFormat(normalizedPrice) : 'قیمت ناموجود';

    const displaySalePrice = normalizedSalePrice !== undefined
        ? PriceFormat(normalizedSalePrice) : undefined;

    const title = product.title?.fa || 'بدون عنوان';
    // let imageSrc = product.thumbnail || '/default.jpg';
    //  imageSrc = product.thumbnail
    //     ? product.thumbnail.startsWith('/')
    //         ? product.thumbnail
    //         : `/${product.thumbnail}`
    //     : '/default.jpg';
    return (
        <div className="rounded-lg border p-3 shadow-sm hover:shadow-md transition cursor-pointer bg-white">
            <Link href={`/product/${product.slug}`} passHref>
                <div className="relative aspect-square">
                    <img
                        src={imgSrc}
                        alt={title}
                        // fill
                        className="rounded-md object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        // onError={(e) => {
                        //     const target = e.target as HTMLImageElement;
                        //     target.src = '/default.jpg';
                        // }}
                        onError={() => setImgSrc('/default.jpg')}
                    />
                </div>
                <h3 className="mt-2 text-lg font-medium line-clamp-2">{title}</h3>
            </Link>

            <div className="mt-2 flex items-center justify-between">
                <div className="product-price-wrapper">
                    {displaySalePrice ? (
                        <div className="flex flex-col">
                            <span className="text-green-600 font-semibold">
                                {formatPrice(displaySalePrice, currency)}
                            </span>
                            {normalizedPrice !== normalizedSalePrice && (
                                <span className="line-through text-sm text-gray-400">
                                    {formatPrice(displayPrice, currency)}
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="text-gray-800 font-semibold">
                            {formatPrice(displayPrice, currency)}
                        </div>
                    )}
                </div>
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