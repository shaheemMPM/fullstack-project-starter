import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@context': path.resolve(__dirname, './src/context/index.ts'),
			'@context/': path.resolve(__dirname, './src/context/'),
			'@lib': path.resolve(__dirname, './src/lib'),
			'@examples': path.resolve(__dirname, './src/examples'),
			'@utils': path.resolve(__dirname, './src/utils'),
		},
	},
	server: {
		port: 5173,
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
			},
		},
	},
});
