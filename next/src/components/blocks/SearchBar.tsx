'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { getResponsiveClass } from '@/utils';

type SearchBarProps = {
    settings?: {
        style?: React.CSSProperties;
        content?: { colCount?: number;
            classes?: string;
        };
        responsive?: {
            showInMobile?: boolean;
            showInDesktop?: boolean;
        };
    };
};

export default function SearchBar({ settings }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const style = settings?.style || {};
    const responsive = settings?.responsive || {};
    const colCount = settings?.content?.colCount || 1;
    const classes = settings?.content?.classes || '';
    const visibilityClasses = getResponsiveClass(responsive);
    const className = `${visibilityClasses} w-full max-w-screen-sm mx-auto ${classes}`.trim();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Search:', query);
    };

    return (
        <form
            className={className}
            onSubmit={handleSubmit}
            style={style }
        >
            <div className="relative">
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="جستجو..."
                    className={`
            w-full pl-4 pr-10 py-2
            text-sm md:text-base
            rounded-full
            border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none
          `}
                />
                <button
                    type="submit"
                    className={`
            absolute right-1 top-1/2 -translate-y-1/2
            p-2 bg-blue-600 hover:bg-blue-700
            text-white rounded-full transition
          `}
                    aria-label="جستجو"
                >
                    <Search className="w-4 h-4" />
                </button>
            </div>
        </form>
    );
}
