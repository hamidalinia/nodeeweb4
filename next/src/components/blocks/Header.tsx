import type { JSX } from 'react';


type HeaderProps = {
    settings: {
        content?: {
            fields?: {
                text?: string;
                element?: keyof JSX.IntrinsicElements;
            };
        };
        style?: {
            fields?: React.CSSProperties;
        };
    };
};

export default function Header({ settings }: HeaderProps) {
    const element = settings?.content?.fields?.element || 'h1';
    const text = settings?.content?.fields?.text || '';
    const style = settings?.style?.fields || {};

    const Tag = element as keyof JSX.IntrinsicElements;

    return <Tag style={style}>{text}</Tag>;
}
