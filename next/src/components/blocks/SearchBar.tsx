import React from 'react';

type SearchBarProps = {
    settings: {
        style?: { fields?: React.CSSProperties };
        content?: { fields?: { colCount?: number } };
    };
};

export default function SearchBar({ settings }: SearchBarProps) {
    const style = settings?.style?.fields || {};
    const colCount = settings?.content?.fields?.colCount || 1;

    return (
        <input
            type="search"
            style={{
                width: colCount * 200, // example width based on colCount
                ...style,
            }}
            placeholder="Search..."
        />
    );
}
