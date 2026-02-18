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
          '@lib': path.resolve(__dirname, './src/lib'),
          '@routes': path.resolve(__dirname, './src/routes'),
          '@features': path.resolve(__dirname, './src/features')
	 }
       }
})
