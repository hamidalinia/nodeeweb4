// pages/product/[slug].tsx
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '@/components/Layout';
// import BlockRenderer from '@/components/BlockRenderer';

type ProductData = {
    _id: string;
    title: {
        fa:string;
    };
    description: {
        fa:string;
    };
    thumbnail?: string;
    // price?: number;
    [key: string]: any;
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

    return (
        <><Head>
            <title>{productData?.title?.fa} | فروشگاه</title>
            {/*<meta name="description" content={productData.description?.slice(0, 150)} />*/}
            <meta property="og:title" content={productData?.title?.fa} />
            {/*<meta property="og:description" content={productData.description?.slice(0, 150)} />*/}
            {/*{productData.image && <meta property="og:image" content={productData.image} />}*/}
        </Head>
        <Layout
            modeData={{ mode, toggleMode }}
            header={theme.header || { elements: [] }}
            footer={theme.footer || { elements: [] }}
            className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white"
        >
            <div className="container mx-auto py-10 px-4">
                <div className="grid md:grid-cols-2 gap-8">
                    {/*{productData.image && (*/}
                        {/*<img*/}
                            {/*src={productData.image}*/}
                            {/*alt={productData.name}*/}
                            {/*className="rounded-xl shadow-md w-full h-auto object-cover"*/}
                        {/*/>*/}
                    {/*)}*/}

                    <div>
                        <h1 className="text-3xl font-bold mb-4">{productData?.title?.fa}</h1>
                        <div className="text-lg text-gray-700 dark:text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: productData?.excerpt?.fa }} />
                        {/*{productData.price && (*/}
                            {/*<div className="text-xl font-semibold text-green-600 dark:text-green-400">*/}
                                {/*{productData.price.toLocaleString()} تومان*/}
                            {/*</div>*/}
                        {/*)}*/}
                    </div>
                </div>

                {/* Example: rendering custom blocks if available */}
                {/*{productData?.blocks && <BlockRenderer blocks={productData.blocks} />}*/}
            </div>
        </Layout></>
    );
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { slug } = context.params || {};
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!BASE_URL) {
        return { props: { productData: { } } };
    }

    let productData = null;

    try {
        const res = await fetch(`${BASE_URL}/customer/product/${slug}`);
        productData = await res.json();
    } catch (e) {
        console.error('Fetch error:', e);
    }

    return {
        props: {
            productData,
        },
    };
}
