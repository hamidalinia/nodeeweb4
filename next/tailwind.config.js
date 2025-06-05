//tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'selector',
    // darkMode: 'media', // or 'media'
    content: [
        "./src/**/*.{js,ts,jsx,tsx,html}",
        "./src/**/**/*.{js,ts,jsx,tsx,html}",
        "./src/**/**/**/*.{js,ts,jsx,tsx,html}",
    ],
    theme: {
        screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
        },
        extend: {
            colors: {
                primary: 'rgb(var(--color-primary))',

            }
        }
    },
    plugins: [

    ],
    safelist: [
        'md:w-1/12',
        'md:w-2/12',
        'md:w-3/12',
        'md:w-4/12',
        'md:w-5/12',
        'md:w-6/12',
        'md:w-7/12',
        'md:w-8/12',
        'md:w-9/12',
        'md:w-10/12',
        'md:w-11/12',
        'md:w-12/12',
        // add more classes you might use dynamically here
    ],
};
