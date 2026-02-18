import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

export default defineConfig({
	plugins: [
		tanstackRouter({ target: "react", autoCodeSplitting: true }),
		tailwindcss(),
		react(),
	],
	server: {
		host: true,
		port: 5173,
		hmr: {
			clientPort: 8443,
			protocol: "wss"
		}
	},
	resolve: {
	 alias: {
	  '@': path.resolve(__dirname, './src'),
          '@api': path.resolve(__dirname, './src/api'),
	  '@hooks': path.resolve(__dirname, './src/hooks'),
          '@assets': path.resolve(__dirname, './src/assets'),
	  '@routes': path.resolve(__dirname, './src/routes'),
          '@features': path.resolve(__dirname, './src/features'),
	  '@components': path.resolve(__dirname, './src/components')
	 }
       }
})
