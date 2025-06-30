import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import { fetchEntity } from '@/functions';
import ProductCard from '@/components/products/ProductCard';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Breadcrumbs from '@/components/products/Breadcrumbs';
import AddToWishlistButton from '@/components/products/AddToWishlistButton';
import Filters from '@/components/products/Filters';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import type { ProductType } from '@/types/product';
import { Filter, X } from 'lucide-react';

type HomeProps = {
    theme?: any;
    products?: ProductType[];
    categoryInfo?: any;
    breadcrumb?: any;
    filters?: any;
    totalProducts: number;
    currentPage: number;
    mode: 'light' | 'dark';
    toggleMode: () => void;
    categorySlug?: string; // New prop for category slug
};

const PAGE_SIZE = 12;

export default function ProductPage({
                                        theme = {},
                                        products = [],
                                        breadcrumb = {},
                                        filters = {},
                                        totalProducts,
                                        currentPage = 1,
                                        mode,
                                        toggleMode,
                                        categorySlug, // Receive category slug
                                        categoryInfo
                                    }: HomeProps) {
    // return JSON.stringify(categoryInfo);
    const router = useRouter();
    const { t } = useTranslation('common');
    const [isClient, setIsClient] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const onFilterChange = (key: string, values: string[]) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [key]: values,
        }));
    };
    // Generate canonical URL - preserve category in URL
    const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath.split('?')[0]}`;

    // Handle pagination - preserve category in URL
    const handlePageChange = (newPage: number) => {
        const query = { ...router.query, page: newPage };
        router.push({
            pathname: router.pathname,
            query,
        }, undefined, { scroll: true });
    };

    // Calculate pagination
    const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
    const startProduct = (currentPage - 1) * PAGE_SIZE + 1;
    const endProduct = Math.min(currentPage * PAGE_SIZE, totalProducts);

    // Generate SEO title based on category
    console.log("categoryInfo",categoryInfo)
    const getPageTitle = () => {
        if (categoryInfo) {
            // const categoryName = breadcrumb?.path?.find(
            //     (item: any) => item.slug === `/product-category/${categorySlug}`
            // )?.name;
            return categoryInfo?.name?.fa
                ? `${categoryInfo?.name?.fa}`
                : t('Products Archive');
        }
        return t('Products Archive');
    };

    // Generate SEO description based on category
    const getPageDescription = () => {
        if (categorySlug) {
            const categoryName = categoryInfo?.name?.fa;
            return categoryName
                ? `${t('Browse our')} ${t(categoryName)} ${t('products with various filters and options')}`
                : t('Browse our complete product catalog');
        }
        return t('Browse our complete product catalog with various filters and categories');
    };
// console.log("breadcrumb.path",breadcrumb.path)
    return (
        <>
            <Head>
                <title>{getPageTitle()}</title>
                <meta name="description" content={getPageDescription()} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content={getPageTitle()} />
                <meta property="og:description" content={getPageDescription()} />
                <meta name="robots" content="index, follow" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": breadcrumb?.path?.map((item: { name: string; slug: string }, index: number) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "name": t(item.name),
                            "item": `${item.slug}`
                        }))
                    })}
                </script>
            </Head>

            <Layout
                modeData={{ mode, toggleMode }}
                header={theme.header || { elements: [] }}
                footer={theme.footer || { elements: [] }}
                className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white"
            >
                <div className="container mx-auto py-5 px-4 ">
                    {/*<div className="flex flex-row md:flex-row md:items-center justify-between">*/}

                    {/* Breadcrumb */}
                    {breadcrumb?.path?.length > 0 && (
                        <Breadcrumbs breadcrumb={breadcrumb} />
                    )}
                    {/*</div>*/}
                    <div className="flex flex-row md:flex-row md:items-center justify-between gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold ">
                        {getPageTitle()}
                    </h1>
                             {/*Product count*/}
                            {isClient && (
                            <div className="hidden md:block text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {t('Showing')} {startProduct} - {endProduct} {t('of')} {totalProducts} {t('products')}
                            </div>
                            )}
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="show-filter md:hidden flex-col  bg-blue-600 text-white rounded-md w-full flex items-center justify-center"
                        >
                            {showMobileFilters ? (
                                <>
                                    <X size={18} />
                                    <span>{t('Hide Filters')}</span>
                                </>
                            ) : (
                                <>
                                    <Filter size={18} />
                                    <span>{t('Show Filters')}</span>
                                </>
                            )}
                        </button>

                    </div>
                </div>
                <div className="container mx-auto py-5 px-4">


                    {/* Filters */}
                    {/*<Filters filters={filters} />*/}
                    <div className="flex flex-col md:flex-row gap-4">
                        {(showMobileFilters || isClient) && (
                            <div className={`md:block ${showMobileFilters ? 'block' : 'hidden'}`}>
                                <Filters

                        filters={filters}
                        selectedFilters={selectedFilters}
                        onFilterChange={onFilterChange}
                                /></div>)}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Products */}
                    {products.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 dark:text-gray-300 text-lg">
                                {t('No products found')}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/*<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">*/}
                                {products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                    />
                                ))}
                            {/*</div>*/}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="col-span-full flex flex-col sm:flex-row items-center justify-center mt-10 w-full space-x-4">
                                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 sm:mb-0">
                                        {t('Page')} {currentPage} {t('of')} {totalPages}
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage <= 1}
                                            className={`px-4 py-2 rounded-md ${
                                                currentPage <= 1
                                                    ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}
                                        >
                                            {t('Previous')}
                                        </button>



                                        <div className="hidden md:flex space-x-2">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                return pageNum <= totalPages ? (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`px-4 py-2 rounded-md ${
                                                            currentPage === pageNum
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                ) : null;
                                            })}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage >= totalPages}
                                            className={`px-4 py-2 rounded-md ${
                                                currentPage >= totalPages
                                                    ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}
                                        >
                                            {t('Next')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const locale = context.locale ?? 'fa';
    const { query, params } = context;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    // Extract pagination parameters
    const currentPage = Number(query.page) || 1;
    const offset = (currentPage - 1) * PAGE_SIZE;
console.log("params",params)
    // Extract category slug from route parameters
    const categorySlug = params?.slug as string | undefined;

    if (!BASE_URL) {
        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                products: [],
                totalProducts: 0,
                currentPage: 1,
                categorySlug: categorySlug || null,
            },
        };
    }

    try {
        // Prepare filters - combine query filters with category filter
        const { q = '', page, ...otherQueryParams } = query;
        let filters: { [key: string]: any } = {};


        // Add category filter if category slug exists
        if (categorySlug) {
            console.log("categorySlug",categorySlug)

            filters["productCategory.slug"] = categorySlug;
        }
        console.log("filters",filters)

        const res = await fetchEntity(
            `product/archive`,
            offset,
            PAGE_SIZE,
            filters
        );
console.log("res",res)
        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                products: res?.products || [],
                categoryInfo: res?.categoryInfo || {},
                breadcrumb: res?.breadcrumb || {},
                filters: res?.filters || {},
                totalProducts: res?.totalCount || 0,
                currentPage,
                categorySlug: categorySlug || null, // Pass to component
            },
        };
    } catch (e) {
        console.error('Fetch error:', e);
        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                products: [],
                totalProducts: 0,
                currentPage: 1,
                categorySlug: categorySlug || null,
            }
        };
    }
}