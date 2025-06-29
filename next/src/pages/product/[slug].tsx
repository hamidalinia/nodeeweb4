import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Breadcrumb from '@/components/products/Breadcrumb';
import ProductImages from '@/components/products/ProductImages';
import ProductInfo from '@/components/products/ProductInfo';
import ProductOptions from '@/components/products/ProductOptions';
import GuaranteeSection from '@/components/products/GuaranteeSection';
import ProductPrice from '@/components/products/ProductPrice';
import QuantitySelector from '@/components/products/QuantitySelector';
import ProductTabs from '@/components/products/ProductTabs';
import AddToCartButton from '@/components/products/AddToCartButton';

import type { ProductData, Combination, HomeProps } from '@/types/product';
import type { TabItem } from '@/types/ui';

export default function ProductPage({
                                        theme = {},
                                        productData,
                                        mode,
                                        toggleMode,
                                    }: HomeProps) {
    const { t } = useTranslation('product');
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedCombinationId, setSelectedCombinationId] = useState(
        productData?.combinations?.[0]?.id ?? null
    );

    if (!productData) {
        return (
            <Layout
                modeData={{ mode, toggleMode }}
                header={theme.header || { elements: [] }}
                footer={theme.footer || { elements: [] }}
            >
                <div className="p-6 text-center text-gray-500 dark:text-gray-300">
                    {t('productNotFound')}
                </div>
            </Layout>
        );
    }

    const selectedCombination =
        productData.combinations?.find((c) => c.id === selectedCombinationId) ??
            productData.combinations?.[0] ??
                null;

    const handleOptionChange = (optionName: string, valueName: string) => {
        if (!productData?.combinations) return;

        const combo = productData.combinations.find(
            (c) => c.options[optionName] === valueName
        );
        if (combo) setSelectedCombinationId(combo.id);
    };

    const incrementQuantity = () => {
        if (selectedCombination && quantity < selectedCombination.quantity) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const tabs: TabItem[] = [
        {
            id: 'description',
            title: t('tabs.description'),
            content: (
                <div
                    className="prose dark:prose-invert max-w-full"
                    dangerouslySetInnerHTML={{ __html: productData?.description?.fa }}
                />
            ),
        },
        {
            id: 'specifications',
            title: t('tabs.specifications'),
            content: productData.specifications ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {productData.specifications.map((spec, i) => (
                        <div key={i} className="border-b pb-2">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {spec.key}:{' '}
              </span>
                            <span>{spec.value}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">
                    {t('noSpecifications')}
                </p>
            ),
        },
        {
            id: 'usage',
            title: t('tabs.usageGuide'),
            content: productData.usage_guide?.fa ? (
                <div
                    className="prose dark:prose-invert max-w-full"
                    dangerouslySetInnerHTML={{ __html: productData.usage_guide.fa }}
                />
            ) : (
                <p className="text-gray-500 dark:text-gray-400">
                    {t('noUsageGuide')}
                </p>
            ),
        },
        {
            id: 'comments',
            title: t('tabs.reviews'),
            content: (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('noReviews')}
                    </p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        {t('beFirstReviewer')}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head>
                <title>
                    {productData?.title?.fa} | {t('storeName')}
                </title>
                <meta property="og:title" content={productData?.title?.fa} />
                <meta
                    property="og:description"
                    content={productData?.excerpt?.fa || productData?.description?.fa}
                />
                <meta property="og:image" content={productData?.thumbnail} />
            </Head>

            <Layout
                modeData={{ mode, toggleMode }}
                header={theme.header || { elements: [] }}
                footer={theme.footer || { elements: [] }}
                className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white"
            >
                <div className="container mx-auto py-6 px-4">
                    <Breadcrumb
                        category={productData?.category}
                        productName={productData?.title?.fa}
                    />

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-sm">
                        <ProductImages
                            thumbnail={productData?.thumbnail}
                            photos={productData?.photos}
                            productName={productData?.title?.fa}
                        />

                        <div>
                            <ProductInfo
                                title={productData.title}
                                brand={productData.brand}
                                excerpt={productData.excerpt?.fa}
                            />

                            <ProductOptions
                                options={productData.options}
                                selectedCombination={selectedCombination}
                                onOptionChange={handleOptionChange}
                            />
                        </div>

                        <div className="border border-gray-200 dark:border-gray-300 rounded-lg p-4 mb-6">
                            <GuaranteeSection />

                            <div className="hidden md:block">
                                <ProductPrice combination={selectedCombination} />
                                <QuantitySelector
                                    quantity={quantity}
                                    maxQuantity={selectedCombination?.quantity}
                                    onIncrement={incrementQuantity}
                                    onDecrement={decrementQuantity}
                                />
                                <AddToCartButton
                                    product={productData}
                                    variable={productData?.type === 'variable'}
                                    selectedVariation={selectedCombination}
                                    quantity={quantity}
                                />
                            </div>
                        </div>
                    </div>

                    <ProductTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

                    {/* Mobile Fixed Bottom Bar */}
                    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 md:hidden z-50">
                        <div className="flex items-center justify-between gap-4">
                            <ProductPrice combination={selectedCombination} isMobile />
                            <QuantitySelector
                                quantity={quantity}
                                maxQuantity={selectedCombination?.quantity}
                                onIncrement={incrementQuantity}
                                onDecrement={decrementQuantity}
                                isMobile
                            />
                            <AddToCartButton
                                item={productData}
                                variable={productData?.type === 'variable'}
                                selectedVariation={selectedCombination}
                                quantity={quantity}

                            />
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { slug } = context.params || {};
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const translations = await serverSideTranslations(
        context.locale || 'fa',
        ['common', 'product']
    );

    if (!BASE_URL) {
        return { props: { ...translations, productData: null } };
    }

    let productData = null;

    try {
        const res = await fetch(`${BASE_URL}/customer/product/${slug}`);
        if (!res.ok) throw new Error("Product not found");
        productData = await res.json();
    } catch (e) {
        console.error("Fetch error:", e);
    }

    return {
        props: {
            ...translations,
            productData,
        },
    };
}