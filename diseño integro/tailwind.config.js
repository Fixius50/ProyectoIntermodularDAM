/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#5ee830",
                "primary-dark": "#4ac425",
                "background-light": "#f6f8f6",
                "background-dark": "#152111",
                "sage-50": "#f4f7f4",
                "sage-100": "#e3ebe3",
                "sage-200": "#c5d6c5",
                "sage-800": "#2d402d",
                "cream": "#fdfbf7",
                "secondary": "#111b0e",
                "ink-dark": "#1a2e16",
                "parchment": "#f0f5ee",
                "surface-light": "#ffffff",
                "surface-dark": "#1e2f19",
                "text-main": "#111b0e",
                "text-secondary": "#60974e",
                "text-muted": "#60974e",
                "border-light": "#eaf3e7",
                "border-dark": "#2a3825",
                "terracotta": "#e6d5c5",
                "terracotta-dark": "#3d2e24",
                "paper": "#fdfbf7",
                "ink": "#2c3e28",
                "slot-bg": "#eaf3e7",
                "slot-border": "#dce8d9",
            },
            fontFamily: {
                "display": ["Lexend", "sans-serif"],
                "handwriting": ["Segoe Print", "Bradley Hand", "chilanka", "cursive"],
            },
            backgroundImage: {
                'paper-texture': "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "2xl": "2rem",
                "full": "9999px"
            },
            boxShadow: {
                "journal": "0 4px 20px -2px rgba(21, 33, 17, 0.1)",
                "card": "0 2px 8px 0 rgba(0, 0, 0, 0.05)",
                "soft": "0 4px 20px -2px rgba(94, 232, 48, 0.15)",
                "glow": "0 0 15px rgba(94, 232, 48, 0.5)",
            }
        },
    },
    plugins: [],
}
