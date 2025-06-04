import React from 'react';

type ParagraphProps = {
    settings: {
        content: {
            fields: {
                text: string;
                link: string;
            };
        };
        style?: {
            fields?: React.CSSProperties;
        };
    };
};

export default function Paragraph({ settings }: ParagraphProps) {
    const { content, style } = settings;
    const text = content?.fields?.text || '';
    const link = content?.fields?.link || '';
    const customStyle = style?.fields || {};
if(link){
    return (
        <a href={link} className="text-base text-gray-700 dark:text-white leading-relaxed" style={customStyle} dangerouslySetInnerHTML={{ __html: text }} />
    );
}
    return (
        <p className="text-base text-gray-700 dark:text-white leading-relaxed" style={customStyle} dangerouslySetInnerHTML={{ __html: text }} />
    );
}
