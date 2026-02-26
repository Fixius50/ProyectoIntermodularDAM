/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#7C9A92',
                    dark: '#5A7A72'
                },
                cream: '#FDFBF7',
                'background-dark': '#1e293b',
                'background-light': '#f8fafc',
                'ink-dark': '#2C3E50',
                sage: {
                    100: '#E4EDE5',
                    800: '#4A6B63'
                },
            }
        },
    },
    plugins: [],
}
