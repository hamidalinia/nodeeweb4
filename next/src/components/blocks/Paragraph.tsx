import React from 'react';

type ParagraphProps = {
    settings: {
        content: {
            fields: {
                text: string;
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
    const customStyle = style?.fields || {};

    return (
        <p className="text-base text-gray-700 dark:text-white leading-relaxed" style={customStyle} dangerouslySetInnerHTML={{ __html: text }} />
    );
}
