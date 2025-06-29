// import React from 'react';
// import Link from 'next/link';
// import { useTranslation } from 'next-i18next'
//
// interface Crumb {
//     name: string;
//     slug: string;
// }
//
// interface BreadcrumbsProps {
//     breadcrumb: {
//         path: Crumb[];
//     };
// }
//
// const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumb }) => {
//     const { t,ready } = useTranslation('common');
//     const crumbs = breadcrumb?.path || [];
//     return (
//             <ol className="text-sm text-gray-600 dark:text-gray-300 list-none p-0 inline-flex mb-3">
//                 {crumbs.map((crumb, idx) => (
//                     <li key={crumb.slug} className="flex items-center">
//                         <Link href={crumb.slug}>{t(crumb.name, { defaultValue: crumb.name })}</Link>
//                         {idx < crumbs.length - 1 && <span className="mx-2">/</span>}
//                     </li>
//                 ))}
//             </ol>
//     );
// };
//
// export default Breadcrumbs;


import Link from 'next/link';
import { useTranslation } from 'next-i18next';

type Props = {
    category?: string;
    productName: string;
};

export default function Breadcrumb({ category, productName }: Props) {
    const { t } = useTranslation('common');

    return (
        <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                        <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                        </svg>
                        {t('home')}
                    </Link>
                </li>
                <li>
                    <div className="flex items-center">
                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <Link href="/shop" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                            {t('shop')}
                        </Link>
                    </div>
                </li>
                {category && (
                    <li>
                        <div className="flex items-center">
                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                            <Link href={`/category/${category}`} className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                                {category}
                            </Link>
                        </div>
                    </li>
                )}
                <li aria-current="page">
                    <div className="flex items-center">
                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
              {productName}
            </span>
                    </div>
                </li>
            </ol>
        </nav>
    );
}