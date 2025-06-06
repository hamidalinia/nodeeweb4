import React from 'react';

type ParagraphProps = {
    settings: {
        content?: {
                text: string;
                link: string;
        };
        style?: React.CSSProperties;
    };
};

export default function Paragraph({ settings }: ParagraphProps) {
    const { content, style } = settings;
    const text = content?.text || '';
    const link = content?.link || '';
    const customStyle = style || {};
if(link){
    return (
        <a href={link} className="text-base text-gray-700 dark:text-white leading-relaxed" style={customStyle} dangerouslySetInnerHTML={{ __html: text }} />
    );
}
    return (
        <p className="text-base text-gray-700 dark:text-white leading-relaxed" style={customStyle} dangerouslySetInnerHTML={{ __html: text }} />
    );
}
