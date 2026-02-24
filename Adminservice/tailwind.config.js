/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#0ea5e9', // Blue-500
                    dark: '#0284c7', // Blue-600
                },
                secondary: {
                    DEFAULT: '#10b981', // Emerald-500
                    dark: '#059669', // Emerald-600
                }
            }
        },
    },
    plugins: [],
}
