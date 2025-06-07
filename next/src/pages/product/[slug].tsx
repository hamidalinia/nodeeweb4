// pages/product/[slug].tsx
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import TheImage from '@/components/blocks/TheImage'; // Adjust path if needed

type Combination = {
    id: number;
    options: Record<string, string>;
    in_stock: boolean;
    price: number;
    quantity: number;
};

type Option = {
    name: string;
    values: { id: number; name: string }[];
    isDisabled?: boolean;
};

type ProductData = {
    _id: string;
    title: { fa: string };
    description: { fa: string };
    thumbnail?: string;
    photos?: string[];
    combinations?: Combination[];
    options?: Option[];
    excerpt?: { fa: string };
    in_stock?: boolean;
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
    const { slug } = router.query;

    // State for selected combination (variant)
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
            `محصول با شناسه ترکیب ${selectedCombination?.id} به سبد خرید اضافه شد. قیمت: ${selectedCombination?.price?.toLocaleString()} تومان`
        );
    };

    return (
        <>
            <Head>
                <title>{productData?.title?.fa} | فروشگاه</title>
                <meta property="og:title" content={productData?.title?.fa} />
            </Head>

            <Layout
                modeData={{ mode, toggleMode }}
                header={theme.header || { elements: [] }}
                footer={theme.footer || { elements: [] }}
                className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white"
            >
                <div className="container mx-auto py-10 px-4">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left: Images */}
                        <div>

                            <div className="relative aspect-square">
                                <TheImage
                                    settings={{
                                        style: { borderRadius: '0.5rem' },
                                        content: {
                                            classes: 'rounded-md object-cover',
                                            src: productData.thumbnail || '/default.jpg',
                                            alt: productData.title.fa,
                                        },
                                    }}
                                />

                            </div>
                            {productData.photos && productData.photos.length > 0 && (
                                <div className="flex gap-3 mt-4 overflow-x-auto">
                                    {productData.photos.map((photo, i) => (
                                        <div className="relative aspect-square">
                                            <TheImage
                                                settings={{
                                                    style: { borderRadius: '0.5rem' },
                                                    content: {
                                                        classes: 'rounded-md object-cover',
                                                        src: photo || '/default.jpg',
                                                        alt: productData.title.fa,
                                                    },
                                                }}
                                            />

                                        </div>

                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Info */}
                        <div>
                            <h1 className="text-3xl font-bold mb-4">{productData.title.fa}</h1>

                            {productData.excerpt?.fa && (
                                <div
                                    className="text-lg text-gray-700 dark:text-gray-300 mb-4"
                                    dangerouslySetInnerHTML={{ __html: productData.excerpt.fa }}
                                />
                            )}

                            {/* Price & Stock */}
                            {selectedCombination && (
                                <div className="mb-6">
                                    <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                                        {selectedCombination.price.toLocaleString()} تومان
                                    </div>
                                    <div className="mt-1">
                                        موجودی:{" "}
                                        {selectedCombination.in_stock ? (
                                            <span className="text-green-600 dark:text-green-400">موجود</span>
                                        ) : (
                                            <span className="text-red-600 dark:text-red-400">ناموجود</span>
                                        )}
                                    </div>
                                    <div className="mt-1">تعداد موجود: {selectedCombination.quantity}</div>
                                </div>
                            )}

                            {/* Options */}
                            {productData.options &&
                            productData.options.map((opt) => (
                                <div key={opt.name} className="mb-4">
                                    <label
                                        htmlFor={opt.name}
                                        className="block mb-1 font-semibold"
                                    >
                                        {opt.name}:
                                    </label>
                                    <select
                                        id={opt.name}
                                        disabled={opt.isDisabled}
                                        className="w-full border border-gray-300 rounded-md p-2 dark:bg-gray-800 dark:text-white"
                                        value={
                                            selectedCombination?.options?.[opt.name] ??
                                                opt.values[0]?.name
                                        }
                                        onChange={(e) =>
                                            handleOptionChange(opt.name, e.target.value)
                                        }
                                    >
                                        {opt.values.map((val) => (
                                            <option key={val.id} value={val.name}>
                                                {val.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}

                            <button
                                onClick={addToCart}
                                disabled={!selectedCombination?.in_stock}
                                className={`w-full py-3 mt-6 font-bold rounded-md ${
                                    selectedCombination?.in_stock
                                        ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                        : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                    }`}
                            >
                                افزودن به سبد خرید
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div
                        className="mt-12 leading-relaxed text-justify prose dark:prose-invert max-w-full"
                        dangerouslySetInnerHTML={{ __html: productData.description.fa }}
                    />
                </div>
            </Layout>
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { slug } = context.params || {};
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!BASE_URL) {
        return { props: { productData: null } };
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
