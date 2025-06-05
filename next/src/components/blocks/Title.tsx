import type { JSX } from 'react';


type TitleProps = {
    settings: {
        content?: {
            text?: string;
            element?: keyof JSX.IntrinsicElements;
        };
        style?:  React.CSSProperties;
    };
};

export default function Title({ settings }: TitleProps) {
    const element = settings?.content?.element || 'h1';
    const text = settings?.content?.text || '';
    const style = settings?.style || {};

    const Tag = element as keyof JSX.IntrinsicElements;

    return <Tag style={style} className={`text-gray-900 dark:text-white`}>{text}</Tag>;
}
