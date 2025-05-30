/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'media', // or 'media'
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}', // if you're using /app directory
        "./src/**/*.{js,ts,jsx,tsx,html}", // your paths
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
