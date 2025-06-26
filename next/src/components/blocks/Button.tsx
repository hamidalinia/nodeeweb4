import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/router';
import { toggleMenu } from '@/store/slices/menuSlice';

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
    const className=classes;
    const dispatch = useDispatch();
    const isMenuOpen = useSelector((state: RootState) => state.menu.isMenuOpen);
    const cart = useSelector((state: RootState) => state.cart);
    // console.log("cart",cart?.length)
    const router = useRouter();
    // return action;
    if (action == 'toggleContact') {
        return (
            <button
                className={`${className} toggleContact cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition`}
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
                onClick={() => router.push('/login')}
                className={`${className} login cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition`}
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
                onClick={() => dispatch(toggleMenu())}
                className={`${className} toggleMenu cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition`}
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
                onClick={() => router.push('/cart')}

                // href={action}
                className={`${className} cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition`}
                style={style}
            >
      <span className="flex toggleCart items-center gap-2 relative">
        <ShoppingBasket className="w-4 h-4"/>
           <span className="absolute -top-4 -right-4 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
               {cart.length}
      </span>
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
