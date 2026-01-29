import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		tanstackRouter({ target: "react", autoCodeSplitting: true }),
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
		"@routes": path.resolve(__dirname, "./src/routes"),
		"@components": path.resolve(__dirname, "./src/components")
    }
  }
})
