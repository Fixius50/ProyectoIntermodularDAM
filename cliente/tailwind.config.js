/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#5ee830',
                    dark: '#4ac425',
                },
                sage: {
                    50: '#f4f7f4',
                    100: '#e3ebe3',
                    200: '#c5d6c5',
                    700: '#3a5239',
                    800: '#2d402d',
                },
                cream: '#fdfbf7',
            },
            fontFamily: {
                display: ['Outfit', 'sans-serif'],
                sans: ['Outfit', 'sans-serif'],
            },
            animation: {
                'fade-in-down': 'fade-in-down 0.5s ease-out',
                'fade-in': 'fade-in 0.3s ease-out forwards',
                'scale-up': 'scale-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                'fade-in-down': {
                    'from': { opacity: '0', transform: 'translateY(-10px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in': {
                    'from': { opacity: '0' },
                    'to': { opacity: '1' },
                },
                'scale-up': {
                    'from': { opacity: '0', transform: 'scale(0.95)' },
                    'to': { opacity: '1', transform: 'scale(1)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-5px)' },
                }
            }
        },
    },
    plugins: [],
}
