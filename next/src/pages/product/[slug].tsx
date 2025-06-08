// pages/product/[slug].tsx
import Head from 'next/head';
import {GetServerSidePropsContext} from 'next';
import {useRouter} from 'next/router';
import React, {useState} from 'react';
import Layout from '@/components/Layout';
import TheImage from '@/components/blocks/TheImage';
import Link from 'next/link';


    type Combination = {
        id: number;
        options: Record<string, string>;
        in_stock: boolean;
        price: number;
        quantity: number;
        discounted_price?: number;
    };


    type Option = {
        name: string;
        values: { id: number; name: string }[];
        isDisabled?: boolean;
    };

    type Specification = {
        key: string;
        value: string;
    };

    type ProductData = {
        _id: string;
        title: { fa: string };
        description: { fa: string };
        specifications?: Specification[];
        usage_guide?: { fa: string };
        thumbnail?: string;
        photos?: string[];
        combinations?: Combination[];
        options?: Option[];
        excerpt?: { fa: string };
        in_stock?: boolean;
        brand?: string;
        category?: string;
    };

    type HomeProps = {
        theme?: any;
        productData?: ProductData;
        mode: 'light' | 'dark';
        toggleMode: () => void;
    };


    export default function ProductPage({
                                            theme = {},
                                            productData,
                                            mode,
                                            toggleMode,
                                        }: HomeProps) {
        const router = useRouter();
        const {slug} = router.query;
        const [activeTab, setActiveTab] = useState(0);
        const [quantity, setQuantity] = useState(1);
        const [mainImage, setMainImage] = useState(productData?.thumbnail || '/default.jpg');

        // State for selected combination (variant)
        const [selectedCombinationId, setSelectedCombinationId] = useState(
            productData?.combinations?.[0]?.id ?? null
        );


        if (!productData) {
            return (
                <Layout
                    modeData={{mode, toggleMode}}
                    header={theme.header || {elements: []}}
                    footer={theme.footer || {elements: []}}
                >
                    <div className="p-6 text-center text-gray-500 dark:text-gray-300">
                        محصول مورد نظر یافت نشد.
                    </div>
                </Layout>
            );
        }

        const selectedCombination =
            productData.combinations?.find((c) => c.id === selectedCombinationId) ??
            productData.combinations?.[0] ??
            null;

        const handleOptionChange = (optionName: string, valueName: string) => {
            if (!productData.combinations) return;

            const combo = productData.combinations.find(
                (c) => c.options[optionName] === valueName
            );
            if (combo) {
                setSelectedCombinationId(combo.id);
            }
        };

        const addToCart = () => {
            alert(
                `محصول ${productData.title.fa} با شناسه ترکیب ${selectedCombination?.id} به تعداد ${quantity} به سبد خرید اضافه شد. قیمت: ${selectedCombination?.price?.toLocaleString()} تومان`
            );
        };


        const incrementQuantity = () => {
            if (selectedCombination && quantity < selectedCombination.quantity) {
                setQuantity(quantity + 1);
            }
        };

        const decrementQuantity = () => {
            if (quantity > 1) {
                setQuantity(quantity - 1);
            }
        };

        const tabs = [
            {
                id: 'description',
                title: 'توضیحات محصول',
                content: (
                    <div
                        className="prose dark:prose-invert max-w-full"
                        dangerouslySetInnerHTML={{__html: productData.description.fa}}
                    />
                )
            },
            {
                id: 'specifications',
                title: 'مشخصات فنی',
                content: productData.specifications ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {productData.specifications.map((spec, i) => (
                            <div key={i} className="border-b pb-2">
                                <span className="font-medium text-gray-600 dark:text-gray-300">{spec.key}: </span>
                                <span>{spec.value}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">مشخصاتی برای این محصول ثبت نشده است.</p>
                )
            },
            {
                id: 'usage',
                title: 'روش استفاده',
                content: productData.usage_guide?.fa ? (
                    <div
                        className="prose dark:prose-invert max-w-full"
                        dangerouslySetInnerHTML={{__html: productData.usage_guide.fa}}
                    />
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">راهنمای استفاده برای این محصول ثبت نشده است.</p>
                )
            },
            {
                id: 'comments',
                title: 'نظرات کاربران',
                content: (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">هنوز نظری برای این محصول ثبت نشده است.</p>
                        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            اولین نفری باشید که نظر می دهید
                        </button>
                    </div>
                )
            }
        ];

        return (
            <>
                <Head>
                    <title>{productData?.title?.fa} | فروشگاه</title>
                    <meta property="og:title" content={productData?.title?.fa}/>
                    <meta property="og:description" content={productData?.excerpt?.fa || productData?.description?.fa}/>
                    <meta property="og:image" content={productData?.thumbnail}/>
                </Head>

                <Layout
                    modeData={{mode, toggleMode}}
                    header={theme.header || {elements: []}}
                    footer={theme.footer || {elements: []}}
                    className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white"
                >
                    <div className="container mx-auto py-6 px-4">
                        {/* Breadcrumb */}
                        <nav className="flex mb-6" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
                                <li className="inline-flex items-center">
                                    <Link href="/"
                                          className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                        <svg className="w-3 h-3 me-2.5" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                                        </svg>
                                        خانه
                                    </Link>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2" d="m1 9 4-4-4-4"/>
                                        </svg>
                                        <Link href="/shop"
                                              className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                                            فروشگاه
                                        </Link>
                                    </div>
                                </li>
                                {productData.category && (
                                    <li>
                                        <div className="flex items-center">
                                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                                                 aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                 viewBox="0 0 6 10">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                      strokeWidth="2" d="m1 9 4-4-4-4"/>
                                            </svg>
                                            <Link href={`/category/${productData.category}`}
                                                  className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                                                {productData.category}
                                            </Link>
                                        </div>
                                    </li>
                                )}
                                <li aria-current="page">
                                    <div className="flex items-center">
                                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2" d="m1 9 4-4-4-4"/>
                                        </svg>
                                        <span
                                            className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                                        {productData.title.fa}
                                    </span>
                                    </div>
                                </li>
                            </ol>
                        </nav>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Left: Images */}
                            <div className="sticky top-4 max-md:static">
                                <div
                                    className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
                                    <TheImage
                                        settings={{
                                            style: {borderRadius: '0.5rem'},
                                            content: {
                                                classes: 'rounded-md object-cover',
                                                src: mainImage,
                                                alt: productData.title.fa,
                                            },
                                        }}
                                    />
                                </div>

                                {/* Thumbnail Gallery */}
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {/* Main thumbnail */}
                                    <button
                                        onClick={() => setMainImage(productData.thumbnail || '/default.jpg')}
                                        className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${mainImage === productData.thumbnail ? 'border-blue-500' : 'border-transparent'}`}
                                    >
                                        <TheImage
                                            settings={{
                                                content: {
                                                    classes: 'object-cover w-full h-full',
                                                    src: productData.thumbnail || '/default.jpg',
                                                    alt: productData.title.fa,
                                                },
                                            }}
                                        />
                                    </button>

                                    {/* Additional photos */}
                                    {productData.photos && productData.photos.map((photo, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setMainImage(photo)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${mainImage === photo ? 'border-blue-500' : 'border-transparent'}`}
                                        >
                                            <TheImage
                                                settings={{
                                                    content: {
                                                        classes: 'object-cover w-full h-full',
                                                        src: photo || '/default.jpg',
                                                        alt: productData.title.fa,
                                                    },
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Product Info */}
                            <div>
                                <h1 className="text-2xl font-bold mb-2">{productData.title.fa}</h1>

                                {/* Brand */}
                                {productData.brand && (
                                    <div className="text-gray-600 dark:text-gray-300 mb-4">
                                        <span className="font-semibold">برند:</span> {productData.brand}
                                    </div>
                                )}

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <h3 className="font-bold text-lg mb-4">ویژگی‌های محصول</h3>
                                    <ul className="space-y-3">
                                        {productData.excerpt?.fa.split('\n').filter(Boolean).map((feature, i) => (
                                            <li key={i} className="flex items-start">
                                                <svg className="w-5 h-5 mt-0.5 ml-1 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>{feature.trim()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>



                                {/* Product Options */}
                                {productData.options && productData.options.map((option) => (
                                    <div key={option.name} className="mb-6">
                                        <h3 className="font-semibold mb-3">{option.name}:</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {option.values.map((value) => (
                                                <button
                                                    key={value.id}
                                                    onClick={() => handleOptionChange(option.name, value.name)}
                                                    className={`px-4 py-2 rounded-md border ${
                                                        selectedCombination?.options?.[option.name] === value.name
                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-500'
                                                    }`}
                                                >
                                                    {value.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                            </div>

                            <div>

                                {/* Price Section - Desktop */}
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 hidden md:block">
                                    {selectedCombination && (
                                        <>
                                            {selectedCombination.discounted_price ? (
                                                <div className="flex items-center gap-4 mb-2">
                                                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                                        {selectedCombination.discounted_price.toLocaleString()} تومان
                                                    </div>
                                                    <div
                                                        className="text-lg text-gray-500 dark:text-gray-400 line-through">
                                                        {selectedCombination.price.toLocaleString()}
                                                    </div>
                                                    <div
                                                        className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm px-2 py-1 rounded">
                                                        {Math.round(((selectedCombination.price - selectedCombination.discounted_price) / selectedCombination.price * 100))}%
                                                        تخفیف
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                                                    {selectedCombination.price.toLocaleString()} تومان
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                        وضعیت:
                        {selectedCombination.in_stock ? (
                            <span className="text-green-600 dark:text-green-400 mr-1"> موجود</span>
                        ) : (
                            <span className="text-red-600 dark:text-red-400 mr-1"> ناموجود</span>
                        )}
                    </span>
                                                {selectedCombination.in_stock && (
                                                    <span className="text-gray-500 dark:text-gray-400">
                            {selectedCombination.quantity} عدد در انبار
                        </span>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Quantity Selector - Desktop */}
                                <div className="mb-6 hidden md:block">
                                    <h3 className="font-semibold mb-3">تعداد:</h3>
                                    <div className="flex items-center border rounded-md w-32 overflow-hidden">
                                        <button
                                            onClick={decrementQuantity}
                                            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        >
                                            -
                                        </button>
                                        <span className="flex-1 text-center">{quantity}</span>
                                        <button
                                            onClick={incrementQuantity}
                                            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Add to Cart Button - Desktop */}
                                <button
                                    onClick={addToCart}
                                    disabled={!selectedCombination?.in_stock}
                                    className={`w-full py-3 text-lg font-bold rounded-md mb-6 hidden md:block ${
                                        selectedCombination?.in_stock
                                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                                            : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                    }`}
                                >
                                    افزودن به سبد خرید
                                </button>

                                {/* --- Mobile Fixed Bottom Bar --- */}
                                <div
                                    className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 md:hidden z-50">
                                    <div className="flex items-center justify-between gap-4">

                                        {/* Price - Mobile */}
                                        {selectedCombination && (
                                            <div className="flex flex-col text-sm text-right">
                                                {selectedCombination.discounted_price ? (
                                                    <>
                                                        <div
                                                            className="text-red-600 dark:text-red-400 font-bold text-base">
                                                            {selectedCombination.discounted_price.toLocaleString()} تومان
                                                        </div>
                                                        <div className="text-gray-400 line-through text-xs">
                                                            {selectedCombination.price.toLocaleString()} تومان
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div
                                                        className="text-green-600 dark:text-green-400 font-bold text-base">
                                                        {selectedCombination.price.toLocaleString()} تومان
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Quantity - Mobile */}
                                        <div className="flex items-center border rounded-md w-24 overflow-hidden">
                                            <button
                                                onClick={decrementQuantity}
                                                className="px-2 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                            >
                                                -
                                            </button>
                                            <span className="flex-1 text-center text-sm">{quantity}</span>
                                            <button
                                                onClick={incrementQuantity}
                                                className="px-2 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Add to Cart Button - Mobile */}
                                        <button
                                            onClick={addToCart}
                                            disabled={!selectedCombination?.in_stock}
                                            className={`flex-1 py-3 text-sm font-bold rounded-md ${
                                                selectedCombination?.in_stock
                                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                            }`}
                                        >
                                            افزودن
                                        </button>
                                    </div>
                                </div>

                            </div>


                        </div>


                        {/* Product Tabs */}
                        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                            <div className="border-b border-gray-200 dark:border-gray-700">
                                <nav className="flex -mb-px space-x-8">
                                    {tabs.map((tab, index) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(index)}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                                activeTab === index
                                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                            }`}
                                        >
                                            {tab.title}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                            <div className="py-6">
                                {tabs[activeTab].content}
                            </div>
                        </div>
                    </div>
                </Layout>
            </>
        );
    }

    export async function getServerSideProps(context: GetServerSidePropsContext) {
        const {slug} = context.params || {};
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

        if (!BASE_URL) {
            return {props: {productData: null}};
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
                productData,
            },
        };
    }