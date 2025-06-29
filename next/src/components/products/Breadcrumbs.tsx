import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next'

interface Crumb {
    name: string;
    slug: string;
}

interface BreadcrumbsProps {
    breadcrumb: {
        path: Crumb[];
    };
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumb }) => {
    const { t,ready } = useTranslation('common');
    const crumbs = breadcrumb?.path || [];
    return (
            <ol className="text-sm text-gray-600 dark:text-gray-300 list-none p-0 inline-flex mb-3">
                {crumbs.map((crumb, idx) => (
                    <li key={crumb.slug} className="flex items-center">
                        <Link href={crumb.slug}>{t(crumb.name, { defaultValue: crumb.name })}</Link>
                        {idx < crumbs.length - 1 && <span className="mx-2">/</span>}
                    </li>
                ))}
            </ol>
    );
};

export default Breadcrumbs;

