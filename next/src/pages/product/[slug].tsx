// pages/product/[slug].tsx
import Head from 'next/head';
import {GetServerSidePropsContext} from 'next';
import {useRouter} from 'next/router';
import React, {useState , useEffect, useRef} from 'react';
import Layout from '@/components/Layout';
import TheImage from '@/components/blocks/TheImage';
import Link from 'next/link';
import { ShieldCheck, Undo2, Phone, Truck } from 'lucide-react'



type Combination = {
    id: number;
    options: Record<string, string>;
    in_stock: boolean;
    price: number;
    quantity: number;
    discounted_price?: number;
};

type OptionValue = {
    id: number;
    name: string;
    image?: string; // Add image property
};


type Option = {
    name: string;
    values: OptionValue[]; // Use updated OptionValue
    isDisabled?: boolean;
};

type Specification = {
    key: string;
    value: string;
};

type ProductData = {
    _id: string;
    title: { fa: string,en:string };
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
    // Add this with your other useState hooks
    const [expanded, setExpanded] = useState(false);
    const features = productData?.excerpt?.fa.split('\n').filter(Boolean) || [];

    // State for selected combination (variant)
    const [selectedCombinationId, setSelectedCombinationId] = useState(
        productData?.combinations?.[0]?.id ?? null
    );

    const handleOptionChange = (optionName: string, valueName: string) => {
        if (!productData?.combinations) return;

        const combo = productData.combinations.find(
            (c) => c.options[optionName] === valueName
        );
        if (combo) {
            setSelectedCombinationId(combo.id);
        }

        // Find if this option has images
        const option = productData.options?.find(opt => opt.name === optionName);
        if (option) {
            const selectedValue = option.values.find(val => val.name === valueName);
            if (selectedValue?.image) {
                setMainImage(selectedValue.image);
            }
        }
    };

// For scroll to reviews
    const scrollToReviews = () => {
        const index = tabs.findIndex(tab => tab.id === 'comments');
        setActiveTab(index);

        // Scroll after a small delay to allow tab switch
        setTimeout(() => {
            const element = document.getElementById('comments-tab-content');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 50);
    };

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

    // const handleOptionChange = (optionName: string, valueName: string) => {
    //     if (!productData.combinations) return;
    //
    //     const combo = productData.combinations.find(
    //         (c) => c.options[optionName] === valueName
    //     );
    //     if (combo) {
    //         setSelectedCombinationId(combo.id);
    //     }
    // };

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

                    {/*<div className="grid md:grid-cols-3 gap-8">*/}
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-sm">
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
                        <div >
                            <h1 className="text-2xl font-bold mb-2">{productData.title.fa}</h1>
                            <p className="text-sm text-gray-500 mb-4">{productData.title.en}</p>

                            {/* Brand */}
                            {productData.brand && (
                                <div className="text-gray-600 dark:text-gray-300 mb-4">
                                    <span className="font-semibold">برند:</span> {productData.brand}
                                </div>
                            )}



                            {/* Star Rating - Clickable */}
                            <div className="flex items-center mb-4 cursor-pointer" onClick={scrollToReviews}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className={`w-5 h-5 ${star <= 4.5 ? 'text-yellow-400' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">(۱۲ نظر)</span>
                            </div>


                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="font-bold text-lg mb-4">ویژگی‌های محصول</h3>

                                {/* Collapsible Features Section */}
                                <div className="relative">
                                    <ul className={`space-y-3 ${expanded ? '' : 'max-h-[7.5rem] overflow-hidden'}`}>
                                        {productData.excerpt?.fa.split('\n').filter(Boolean).map((feature, i) => (
                                            <li key={i} className="flex items-start">
                                                <svg className="w-5 h-5 mt-0.5 ml-1 text-green-500 flex-shrink-0"
                                                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M5 13l4 4L19 7"/>
                                                </svg>
                                                <span>{feature.trim()}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Gradient overlay for collapsed state */}
                                    {!expanded && features.length > 3 && (
                                        <div
                                            className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent dark:from-gray-900"></div>
                                    )}
                                </div>

                                {/* Show More/Less Button */}
                                {features.length > 3 && (
                                    <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="mt-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                                    >
                                        {expanded ? (
                                            <>
                                                نمایش کمتر
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M5 15l7-7 7 7"/>
                                                </svg>
                                            </>
                                        ) : (
                                            <>
                                                نمایش بیشتر
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M19 9l-7 7-7-7"/>
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/*/!* Product Options *!/*/}
                            {/*{productData.options && productData.options.map((option) => (*/}
                            {/*    <div key={option.name} className="mb-6">*/}
                            {/*        <h3 className="font-semibold mb-3">{option.name}:</h3>*/}
                            {/*        <div className="flex flex-wrap gap-2">*/}
                            {/*            {option.values.map((value) => (*/}
                            {/*                <button*/}
                            {/*                    key={value.id}*/}
                            {/*                    onClick={() => handleOptionChange(option.name, value.name)}*/}
                            {/*                    className={`px-4 py-2 rounded-md border flex items-center ${*/}
                            {/*                        selectedCombination?.options?.[option.name] === value.name*/}
                            {/*                            ? 'bg-blue-600 text-white border-blue-600'*/}
                            {/*                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-500'*/}
                            {/*                    }`}*/}
                            {/*                >*/}
                            {/*                    /!* Show color swatch if image exists *!/*/}
                            {/*                    {value.image && (*/}
                            {/*                        <span*/}
                            {/*                            className="w-6 h-6 rounded-full mr-2 border border-gray-300"*/}
                            {/*                            style={{*/}
                            {/*                                backgroundImage: `url(${value.image})`,*/}
                            {/*                                backgroundSize: 'cover',*/}
                            {/*                                backgroundPosition: 'center'*/}
                            {/*                            }}*/}
                            {/*                        ></span>*/}
                            {/*                    )}*/}
                            {/*                    {value.name}*/}
                            {/*                </button>*/}
                            {/*            ))}*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*/!*))}*!/*/}

                            {/*{productData.options && productData.options.map((option) => (*/}
                            {/*    <div key={option.name} className="mb-6">*/}
                            {/*        <label className="block font-semibold mb-2">{option.name}:</label>*/}

                            {/*        <div className="relative">*/}
                            {/*            <select*/}
                            {/*                onChange={(e) => handleOptionChange(option.name, e.target.value)}*/}
                            {/*                value={selectedCombination?.options?.[option.name] || ''}*/}
                            {/*                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"*/}
                            {/*            >*/}
                            {/*                <option value="">انتخاب کنید</option>*/}
                            {/*                {option.values.map((value) => (*/}
                            {/*                    <option key={value.id} value={value.name}>*/}
                            {/*                        {value.name}*/}
                            {/*                    </option>*/}
                            {/*                ))}*/}
                            {/*            </select>*/}

                            {/*            /!* نمایش رنگ انتخاب‌شده کنار سلکت با تصویر *!/*/}
                            {/*            {(() => {*/}
                            {/*                const selectedValue = option.values.find(*/}
                            {/*                    (v) => v.name === selectedCombination?.options?.[option.name]*/}
                            {/*                );*/}
                            {/*                return selectedValue?.image ? (*/}
                            {/*                    <span*/}
                            {/*                        className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 rounded-full border border-gray-300"*/}
                            {/*                        style={{*/}
                            {/*                            backgroundImage: `url(${selectedValue.image})`,*/}
                            {/*                            backgroundSize: 'cover',*/}
                            {/*                            backgroundPosition: 'center'*/}
                            {/*                        }}*/}
                            {/*                    ></span>*/}
                            {/*                ) : null;*/}
                            {/*            })()}*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*))}*/}

                            {/* Product Options */}
                            {productData.options && productData.options.map((option) => (
                                <div key={option.name} className="mb-6">
                                    <h3 className="font-semibold mb-3">{option.name}:</h3>
                                    <div className="relative">
                                        <select
                                            onChange={(e) => handleOptionChange(option.name, e.target.value)}
                                            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 appearance-none"
                                            value={selectedCombination?.options?.[option.name] || ''}
                                        >
                                            <option value="">انتخاب کنید</option>
                                            {option.values.map((value) => (
                                                <option
                                                    key={value.id}
                                                    value={value.name}
                                                    className="flex items-center"
                                                >
                                                    {value.name}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Custom dropdown arrow */}
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>

                                        {/* Color swatch for selected option */}
                                        {selectedCombination?.options?.[option.name] && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                                                {option.values.find(v => v.name === selectedCombination.options[option.name])?.image && (
                                                    <span
                                                        className="w-5 h-5 rounded-full border border-gray-300"
                                                        style={{
                                                            backgroundImage: `url(${option.values.find(v => v.name === selectedCombination.options[option.name])?.image})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center'
                                                        }}
                                                    ></span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                        </div>


                        {/*<div>*/}

                        <div className="border border-gray-200 dark:border-gray-300 rounded-lg p-4 mb-6">
                            {/* Guarantee Section */}
                            {/*<div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">*/}
                            <div className= "mb-7">
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center">
                                        <ShieldCheck className="w-5 h-5 text-green-500 ml-2" />
                                        گارانتی اصالت کالا
                                    </li>
                                    <li className="flex items-center">
                                        <Undo2 className="w-5 h-5 text-green-500 ml-2" />
                                        ضمانت بازگشت کالا تا ۷ روز طبق شرایط مرجوعی
                                    </li>
                                    <li className="flex items-center">
                                        <Phone className="w-5 h-5 text-green-500 ml-2" />
                                        مشاوره تلفنی رایگان
                                    </li>
                                    <li className="flex items-center">
                                        <Truck className="w-5 h-5 text-green-500 ml-2" />
                                        ارسال رایگان با خرید بیش از ۲ میلیون تومان
                                    </li>
                                </ul>

                            </div>


                            {/* Price Section - Desktop */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 hidden md:block">
                                {selectedCombination && (
                                    <>
                                        {selectedCombination.discounted_price ? (
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                                    {selectedCombination.discounted_price.toLocaleString()} تومان
                                                </div>
                                                <div className="text-lg text-gray-500 dark:text-gray-400 line-through">
                                                    {selectedCombination.price.toLocaleString()}
                                                </div>
                                                <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm px-2 py-1 rounded">
                                                    {Math.round(((selectedCombination.price - selectedCombination.discounted_price) / selectedCombination.price * 100))}%
                                                    تخفیف
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                                                {selectedCombination.price.toLocaleString()} تومان
                                            </div>
                                        )}

                                        {/* Installment Plan */}
                                        <div className="mt-2 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-md text-sm">
                                            <div className="flex items-center text-blue-700 dark:text-blue-300">
                                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>
                ۴ قسط {Math.round(
                                                    (selectedCombination.discounted_price || selectedCombination.price) / 4
                                                ).toLocaleString()} تومانی با تارا
              </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm mt-3">
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
                            <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 md:hidden z-50">
                                <div className="flex items-center justify-between gap-4">
                                    {/* Price - Mobile */}
                                    {selectedCombination && (
                                        <div className="flex flex-col text-sm text-right">
                                            {selectedCombination.discounted_price ? (
                                                <>
                                                    <div className="text-red-600 dark:text-red-400 font-bold text-base">
                                                        {selectedCombination.discounted_price.toLocaleString()} تومان
                                                    </div>
                                                    <div className="text-gray-400 line-through text-xs">
                                                        {selectedCombination.price.toLocaleString()} تومان
                                                    </div>
                                                    {/* Installment for mobile */}
                                                    <div className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                                                        ۴ قسط {Math.round(
                                                        (selectedCombination.discounted_price || selectedCombination.price) / 4
                                                    ).toLocaleString()} تومانی
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="text-green-600 dark:text-green-400 font-bold text-base">
                                                        {selectedCombination.price.toLocaleString()} تومان
                                                    </div>
                                                    {/* Installment for mobile */}
                                                    <div className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                                                        ۴ قسط {Math.round(selectedCombination.price / 4).toLocaleString()} تومانی
                                                    </div>
                                                </>
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