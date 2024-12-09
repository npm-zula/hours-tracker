/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#f5f7ff',
					100: '#ebf0fe',
					200: '#d9e2fd',
					300: '#b8c9fb',
					400: '#8fa4f7',
					500: '#6b82f3',
					600: '#4a5ee8',
					700: '#3e4dd1',
					800: '#3541aa',
					900: '#2f3a87',
				},
				secondary: {
					50: '#f7f7f7',
					100: '#e6e6e6',
					200: '#cccccc',
					300: '#b3b3b3',
					400: '#999999',
					500: '#808080',
					600: '#666666',
					700: '#4d4d4d',
					800: '#333333',
					900: '#1a1a1a',
				},
				accent: {
					50: '#fff7ed',
					100: '#ffedd5',
					200: '#fed7aa',
					300: '#fdb874',
					400: '#fb923c',
					500: '#f97316',
					600: '#ea580c',
					700: '#c2410c',
					800: '#9a3412',
					900: '#7c2d12',
				},
			},
		},
	},
	plugins: [],
}
