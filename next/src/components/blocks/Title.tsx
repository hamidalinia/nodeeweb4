import React from 'react';

type TitleProps = {
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

export default function Title({ settings }: TitleProps) {
    // return JSON.stringify(settings)
    const { content, style } = settings;
    const text = content?.fields?.text || '';
    const customStyle = style?.fields || {};

    return <h2 style={customStyle}>{text}</h2>;
}
