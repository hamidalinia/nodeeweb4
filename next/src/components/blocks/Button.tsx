import React from 'react';
import {
    ShoppingBasket, // already imported
    LogIn,          // login icon
    Menu,           // menu/hamburger icon
    HelpCircle      // support/help icon
} from 'lucide-react';

type ButtonProps = {
    settings?: {
        style?: React.CSSProperties;
        content?: {
                classes?: string;
                text?: string;
                action?: string;
                iconFont?: string;
                iconPosition?: 'left' | 'right';
        };
    };
};

export default function Button({settings}: ButtonProps) {
    const style = settings?.style || {};
    const action = settings?.content?.action || '#';
    const classes = settings?.content?.classes || '';
    const iconFont = settings?.content?.iconFont || '';
    const iconPosition = settings?.content?.iconPosition || 'left';
    const className=classes
    // return action;
    if (action == 'toggleContact') {
        return (
            <button
                // href={action}
                className={`${className} cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition`}
                style={style}
            >
      <span className="flex items-center gap-2">
        <HelpCircle className="w-4 h-4"/>
      </span>
            </button>
        );
    }
    if (action == '/login') {
        return (
            <button
                // href={action}
                className={`${className} cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition`}
                style={style}
            >
      <span className="flex items-center gap-2">
        <LogIn className="w-4 h-4"/>
      </span>
            </button>
        );
    }
    if (action == 'toggleMenu') {
        return (
            <button
                // href={action}
                className={`${className} cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition`}
                style={style}
            >
      <span className="flex items-center gap-2">
        <Menu className="w-4 h-4"/>
      </span>
            </button>
        );
    }
    if (action == 'toggleCart') {
        return (
            <button
                // href={action}
                className={`${className} cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition`}
                style={style}
            >
      <span className="flex items-center gap-2">
        <ShoppingBasket className="w-4 h-4"/>
      </span>
            </button>
        );
    }
    return (
        <a
            href={action}
            className={`${className} inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition`}
            style={style}
        >
      <span className="flex items-center gap-2">
        {iconPosition === 'left' && iconFont && <i className={iconFont}></i>}
          <span>{settings?.content?.text}</span>
          {iconPosition === 'right' && iconFont && <i className={iconFont}></i>}
      </span>
        </a>
    );
}
