import React, {ReactNode} from 'react';
import Link from 'next/link';

type NavigationItemProps = {
    settings: {
        style?: React.CSSProperties;
        content?: {
                link?: string;
                text?: string;
                borderRadious?: string;
        };
    };
    children?: ReactNode | null;
};

type ChildWithBlocks = {
    blocks?: unknown[];
};


export default function NavigationItem({settings, children}: NavigationItemProps) {
    const style = settings?.style || {};
    const {
        link = '#',
        text = 'Item',
        borderRadious = '0',
    } = settings?.content || {};

    const isExternal = link.startsWith('http');
    const blocks =
        React.isValidElement(children) && children.props
            ? (children.props as ChildWithBlocks).blocks
            : undefined;
    return (
        <div
            className="relative group navigation-item-wrapper"
            style={{...style, borderRadius: borderRadious}}
        >
            {isExternal ? (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 whitespace-nowrap navigation-item-link"
                >
                    {text}
                </a>
            ) : (
                <Link
                    href={link}
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 whitespace-nowrap navigation-item-link"
                >
                    {text}
                </Link>
            )}
            {/*{console.log("children",children)}*/}
            {React.isValidElement(children) &&
            Array.isArray(blocks) &&
            blocks.length > 0 && (
                <div
                    className="absolute right-0 top-full hidden group-hover:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-10 min-w-[180px] navigation-item-children">
                    <div className="flex flex-col">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}
