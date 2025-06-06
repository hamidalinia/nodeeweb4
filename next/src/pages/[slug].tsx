// pages/[slug].tsx
import Head from 'next/head';
import React from 'react';
import Layout from '@/components/Layout';
import BlockRenderer from '@/components/BlockRenderer';
import { GetServerSidePropsContext } from 'next';
type HomeProps = {
    theme?: any;
    pageData?: any;
    mode: 'light' | 'dark';
    toggleMode: () => void;
};
export default function DynamicPage({
                                 theme = {},
                                 pageData = { }
                                 , mode, toggleMode }: HomeProps) {
    console.log("pageData",pageData?.elements)
    return ( <><Head>
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
            {pageData?.image && (
                <meta property="og:image" content={pageData.image} />
            )}

            <meta property="og:type" content="website" />
            <meta name="robots" content="index, follow" />
        </Head>
        <Layout modeData={{mode,toggleMode}} header={theme.header || { elements: [] }} footer={theme.footer || { elements: [] }} className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
            <BlockRenderer  blocks={pageData?.elements || []}
                            modeData={{mode,toggleMode}}
            />
        </Layout></>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { slug } = context.params || {};
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!BASE_URL) {
        return { props: { pageData: { } } };
    }

    let pageData = null;

    try {
        const res = await fetch(`${BASE_URL}/customer/page/${slug}`);
        pageData = await res.json();
    } catch (e) {
        console.error('Fetch error:', e);
    }

    return {
        props: {
            pageData,
        },
    };
}
