// pages/index.tsx
import React from 'react';
import Layout from '@/components/Layout';
import { fetchEntity } from '@/functions';
import BlockRenderer from '@/components/BlockRenderer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSidePropsContext } from 'next';
import { Block } from '@/types/block';
import Head from 'next/head';

// Define proper types for your data structures
// type Block = {
//     type?: string;
//     settings?: {
//         content?: {
//                 entity?: string;
//         };
//     };
//     customQuery?: string;
//     children?: Block[];
//     fetchedProducts?: any;
//     fetchedPosts?: any;
// };

type PageData = {
    elements?: Block[];
    title?: {
        fa:string;
    };
    metatitle?: {
        fa:string;
    };
    metadescription?: {
        fa:string;
    };
    keywords?: {
        fa:string;
    };
};

type Theme = {
    header?: { elements: Block[] };
    footer?: { elements: Block[] };
    language?: string;
};

type HomeProps = {
    theme?: Theme;
    pageData?: PageData;
    mode: 'light' | 'dark';
    toggleMode: () => void;
};

const Home: React.FC<HomeProps> = ({
                                       theme = {},
                                       pageData = { elements: [] },
                                       mode,
                                       toggleMode,
                                   }) => {
    console.log("pageData",pageData)
    return (
        <><Head>
            <title>{pageData?.metatitle?.fa || pageData?.title?.fa}</title>

            {pageData?.metadescription?.fa && (
                <meta name="description" content={pageData.metadescription.fa} />
            )}

            {pageData?.keywords?.fa && (
                <meta name="keywords" content={pageData.keywords.fa} />
            )}

            <meta property="og:title" content={pageData?.metatitle?.fa || pageData?.title?.fa} />

            {pageData?.metadescription?.fa && (
                <meta property="og:description" content={pageData.metadescription.fa} />
            )}

            {/* Optional: include an OG image if you have one */}
            {/*{pageData?.image && (*/}
                {/*<meta property="og:image" content={pageData.image} />*/}
            {/*)}*/}

            <meta property="og:type" content="website" />
            <meta name="robots" content="index, follow" />
        </Head>
        <Layout
            modeData={{ mode, toggleMode }}
            header={theme?.header || { elements: [] }}
            footer={theme?.footer || { elements: [] }}
            className={`min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white ${
                theme?.language === 'fa' ? 'rtl' : 'ltr'
                }`}
        >
            {/*<div className=" hidden md:flex row flex flex-wrap gap-4">*/}
                {/*<div className="  col  md:w-8/12" ><a href="/product-category/skin-care"*/}
                                                                       {/*><img*/}
                    {/*src="https://asakala.shop/customer/2024-9-28-11-24-15bannerrrrr1.webp" alt="image"*/}
                   {/*/></a></div>*/}
                {/*<div className="  col  md:w-4/12"><a href="/product-category/cosmetics"><img*/}
                    {/*src="https://asakala.shop/customer/2024-9-28-11-16-38bannerr2-3.webp" alt="image"*/}
                    {/*/></a></div>*/}
            {/*</div>*/}
            <BlockRenderer
                modeData={{ mode, toggleMode }}
                blocks={pageData.elements || []}
            />
        </Layout></>
    );
};

// Helper function to find sliders by entity type
const findSlidersByEntity = (blocks: Block[] = [], entityType: string): Block[] => {
    return blocks.reduce<Block[]>((sliders, block) => {
        if (
            block?.type === 'slider' &&
            block?.settings?.content?.entity === entityType
        ) {
            sliders.push(block);
        }

        if (Array.isArray(block.children)) {
            sliders.push(...findSlidersByEntity(block.children, entityType));
        }

        return sliders;
    }, []);
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const locale = context.locale ?? 'fa';
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!BASE_URL) {
        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                pageData: { elements: [] },
            },
        };
    }

    try {
        const res = await fetch(`${BASE_URL}/customer/page/home`);
        const pageData: PageData = await res.json();

        // Find all product and post sliders
        const productSliders = findSlidersByEntity(pageData.elements, 'product');
        const postSliders = findSlidersByEntity(pageData.elements, 'post');

        // Fetch data for all sliders in parallel
        await Promise.all([
            ...productSliders.map(async (block) => {
                try {
                    block.fetchedProducts = await fetchEntity('product', 0, 10, '');
                } catch (err) {
                    console.error('Error fetching products for slider:', err);
                }
            }),
            ...postSliders.map(async (block) => {
                try {
                    block.fetchedPosts = await fetchEntity('post', 0, 10, '');
                } catch (err) {
                    console.error('Error fetching posts for slider:', err);
                }
            }),
        ]);

        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                pageData,
            },
        };
    } catch (e) {
        console.error('Fetch error:', e);
        return {
            props: {
                ...(await serverSideTranslations(locale, ['common'])),
                pageData: { elements: [] },
            },
        };
    }
};

export default Home;