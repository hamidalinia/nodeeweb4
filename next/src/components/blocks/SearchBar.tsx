'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

type SearchBarProps = {
    settings?: {
        style?: { fields?: React.CSSProperties };
        content?: { fields?: { colCount?: number } };
    };
};

export default function SearchBar({ settings }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const style = settings?.style?.fields || {};
    const colCount = settings?.content?.fields?.colCount || 1;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Search:', query);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-screen-sm mx-auto"
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
