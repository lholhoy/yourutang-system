/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#F3F4F6', // Gray 100 - Cleaner background
                primary: {
                    DEFAULT: '#0F9E99',
                    50: '#E7F6F5',
                    100: '#CFEDEC',
                    200: '#9FDBDA',
                    300: '#6FC9C7',
                    400: '#3FB7B5',
                    500: '#0F9E99',
                    600: '#0C7E7A',
                    700: '#095F5C',
                    800: '#063F3D',
                    900: '#03201F',
                },
                secondary: '#1F2937', // Gray 800
                content: {
                    DEFAULT: '#1F2937', // Gray 800
                    muted: '#6B7280', // Gray 500
                    light: '#9CA3AF', // Gray 400
                },
                card: '#FFFFFF',
                border: '#E5E7EB', // Gray 200
                success: '#10B981',
                danger: '#EF4444',
                warning: '#F59E0B',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Outfit', 'Inter', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)',
                'card-hover': '0 0 0 1px rgba(0,0,0,0.03), 0 8px 16px rgba(0,0,0,0.08)',
            },
            borderRadius: {
                DEFAULT: '0.75rem', // 12px
                'xl': '1rem',      // 16px
                '2xl': '1.5rem',   // 24px
            },
        },
    },
    plugins: [],
}