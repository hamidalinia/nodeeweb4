// pages/index.tsx
import React from 'react';
import Layout from '@/components/Layout';
import BlockRenderer from '@/components/BlockRenderer';
import { GetServerSidePropsContext } from 'next';
type HomeProps = {
    theme?: any;
    pageData?: { elements?: any[] };
    mode: 'light' | 'dark';
    toggleMode: () => void;
};
export default function DynamicPage({
                                 theme = {},
                                 pageData = { elements: [] }
                                 , mode, toggleMode }: HomeProps) {
    return (
        <Layout modeData={{mode,toggleMode}} header={theme.header || { elements: [] }} footer={theme.footer || { elements: [] }} className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
            <BlockRenderer  blocks={pageData.elements || []}
                            modeData={{mode,toggleMode}}
            />
        </Layout>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { slug } = context.params || {};
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!BASE_URL) {
        return { props: { pageData: { elements: [] } } };
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
