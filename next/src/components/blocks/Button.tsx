import React from 'react';

type ButtonProps = {
    settings: {
        style?: {
            fields?: React.CSSProperties;
        };
        content?: {
            fields?: {
                text?: string;
                action?: string;
                iconFont?: string;
                iconPosition?: 'left' | 'right';
            };
        };
    };
};

export default function Button({ settings }: ButtonProps) {
    const style = settings?.style?.fields || {};
    const action = settings?.content?.fields?.action || '#';
    const iconFont = settings?.content?.fields?.iconFont || '';
    const iconPosition = settings?.content?.fields?.iconPosition || 'left';

    return (
        <a
            href={action}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            style={style}
        >
      <span className="flex items-center gap-2">
        {iconPosition === 'left' && iconFont && <i className={iconFont}></i>}
          <span>{settings?.content?.fields?.text}</span>
          {iconPosition === 'right' && iconFont && <i className={iconFont}></i>}
      </span>
        </a>
    );
}
