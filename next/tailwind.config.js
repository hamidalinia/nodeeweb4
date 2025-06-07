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

        'sm:w-1/12',
        'sm:w-2/12',
        'sm:w-3/12',
        'sm:w-4/12',
        'sm:w-5/12',
        'sm:w-6/12',
        'sm:w-7/12',
        'sm:w-8/12',
        'sm:w-9/12',
        'sm:w-10/12',
        'sm:w-11/12',
        'sm:w-12/12',

        'md:w-1/2',
        'md:w-1/3',
        'md:w-1/4',
        'md:w-1/5',
        'md:w-1/6',
        'md:w-1/7',
        'md:w-1/8',
        'md:w-2/3',
        'md:w-3/4',
        'md:w-2/5',
        'md:w-3/5',
        'md:w-4/5',
        'md:w-5/6',


        'sm:w-1/2',
        'sm:w-1/3',
        'sm:w-1/4',
        'sm:w-1/5',
        'sm:w-1/6',
        'sm:w-1/7',
        'sm:w-1/8',
        'sm:w-2/3',
        'sm:w-3/4',
        'sm:w-2/5',
        'sm:w-3/5',
        'sm:w-4/5',
        'sm:w-5/6',


        'xs:m-auto',
        'lg:m-auto',
        'md:m-auto',
        'sm:m-auto',
        'm-[10px]',
        'p-[10px]',
        'p-[15px]',
        'p-[20px]',
        'p-[25px]',
        'p-[30px]',
        'p-[35px]',
        'p-[40px]',
        'p-[45px]',
        'p-[50px]',
        'md:p-0',
        'md:p-1',
        'md:p-2',
        'md:p-3',
        'md:p-4',
        'md:p-5',
        'md:p-6',


        'md:flex-nowrap',
        'sm:flex-nowrap',
        'flex-wrap',
        'md:flex-row',


        'grid',
        'grid-cols-1',
        'sm:grid-cols-2',
        'md:grid-cols-3',
        'gap-6',
        'mt-6',
        'col-span-full',
        'md:items-center',
        'md:justify-between',
        'justify-between',
        'py-5',
        // add more classes you might use dynamically here
    ],
};
