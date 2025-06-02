// pages/index.tsx
import React from 'react';
import Layout from '@/components/Layout';
import {fetchEntity} from '@/functions';
import BlockRenderer from '@/components/BlockRenderer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSidePropsContext } from 'next';

type HomeProps = {
    theme?: any;
    pageData?: { elements?: any[] };
    mode: 'light' | 'dark';
    toggleMode: () => void;
};
export default function Home({
                                 theme = {},
                                 pageData = { elements: [] }
    , mode, toggleMode }: HomeProps) {
    return (
        <Layout modeData={{mode,toggleMode}} header={theme?.header || { elements: [] }} footer={theme?.footer || { elements: [] }} className={"min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white "+((theme?.language=='fa') ? 'rtl' : 'ltr')} >
            <BlockRenderer modeData={{mode,toggleMode}} blocks={pageData.elements || []} />
        </Layout>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const locale = context.locale ?? 'fa';
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!BASE_URL) {
        return { props: { pageData: { elements: [] } } };
    }

    let pageData = { elements: [] };

    try {
        const res = await fetch(`${BASE_URL}/customer/page/home`);
        pageData = await res.json();


        // Helper function to find product sliders
        const findProductSliders = (blocks: any[]): any[] => {
            let sliders: any[] = [];

            for (const block of blocks) {
                // console.log("block",block)

                if (
                    block?.type === 'slider' &&
                    block?.settings?.content?.fields?.entity === 'product'
                ) {
                    sliders.push(block);
                }

                // Recursively check children
                if (Array.isArray(block.children)) {
                    sliders = sliders.concat(findProductSliders(block.children));
                }
            }

            return sliders;
        };

        const productSliders = findProductSliders(pageData.elements);

        // Fetch product data for each customQuery
        const fetches = productSliders.map(async (block) => {

            try {
                const query = new URLSearchParams(block.customQuery).toString();
                // console.log("query",query)
                const data = await fetchEntity('product',0,10,'')

                // const res = await fetch(`${BASE_URL}/customer/product?${query}`);
                // const data = await res.json();
                // console.log("data",data)
                block.fetchedProducts = data; // attach fetched products to the block
            } catch (err) {
                console.error('Error fetching products for slider:', err);
            }
        });

        await Promise.all(fetches);


    } catch (e) {
        console.error('Fetch error:', e);
    }

    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
            pageData,
        },
    };
}

