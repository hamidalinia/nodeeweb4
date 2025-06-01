import { Moon, Sun } from "lucide-react";
import React from "react";
import { getResponsiveClass } from '@/utils';

type ThemeModeProps = {
    settings: {
        style?: {
            fields?: React.CSSProperties;
        };
        responsive?: {
            showInMobile?: boolean;
            showInDesktop?: boolean;
        };
    };
    modeData?: {
        mode: "light" | "dark";
        toggleMode: () => void;
    };
};

export default function ThemeMode({settings, modeData }: ThemeModeProps) {
    if (!modeData) return null;
    const style = settings?.style?.fields || {};
    const responsive = settings?.responsive || {};
    const visibilityClasses = getResponsiveClass(responsive);
    const { mode, toggleMode } = modeData;
    const isDark = mode === "dark";

    return (
        <button
            onClick={toggleMode}
            aria-label="Toggle Dark Mode"
            className={`${visibilityClasses} relative inline-flex items-center h-8 w-16 rounded-full transition-colors duration-300 focus:outline-none bg-gray-300 dark:bg-gray-600 cursor-pointer`}
            style={style}
        >
      <span
          className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform duration-300 ${
              isDark ? "translate-x-8" : "translate-x-0"
              }`}
      />
            <span className="absolute left-1.5 top-2 text-yellow-500 dark:text-gray-300">
        <Sun size={16} />
      </span>
            <span className="absolute right-1.5 top-2 text-gray-700 dark:text-yellow-300">
        <Moon size={16} />
      </span>
        </button>
    );
}
