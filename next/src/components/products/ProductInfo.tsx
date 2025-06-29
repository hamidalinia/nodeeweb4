import { useState } from 'react';
import { useTranslation } from 'next-i18next';

type Title = {
    fa: string;
    en: string;
};

type Excerpt = {
    fa?: string;
};

type Props = {
    title: Title;
    brand?: string;
    excerpt?: string;
};

export default function ProductInfo({ title, brand, excerpt }: Props) {
    const { t } = useTranslation('product');
    const [expanded, setExpanded] = useState(false);
    const features = excerpt?.split('\n').filter(Boolean) || [];

    return (
        <>
            <h1 className="text-2xl font-bold mb-2">{title?.fa}</h1>
            <p className="text-sm text-gray-500 mb-4">{title?.en}</p>

            {brand && (
                <div className="text-gray-600 dark:text-gray-300 mb-4">
                    <span className="font-semibold">{t('brand')}:</span> {brand}
                </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-bold text-lg mb-4">{t('features')}</h3>

                <div className="relative">
                    <div
                        className={`space-y-3 ${expanded ? '' : 'max-h-[7.5rem] overflow-hidden'}`}
                        dangerouslySetInnerHTML={{ __html: excerpt || '' }}
                    />

                    {!expanded && features.length > 3 && (
                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent dark:from-gray-900"></div>
                    )}
                </div>

                {features.length > 3 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="mt-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                    >
                        {expanded ? (
                            <>
                                {t('showLess')}
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                </svg>
                            </>
                        ) : (
                            <>
                                {t('showMore')}
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </>
                        )}
                    </button>
                )}
            </div>
        </>
    );
}