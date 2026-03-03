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
		  '@assets': path.resolve(__dirname, './src/assets'),
		  '@routes': path.resolve(__dirname, './src/routes'),
		  '@shared': path.resolve(__dirname, './src/shared'),
			'@features': path.resolve(__dirname, './src/features'),
		}
  }
})
