import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	server: {
		host: true,
		port: 5173,
		hmr: {
			clientPort: 5173
		}
	},
	resolve: {
    alias: {
		"@hooks": path.resolve(__dirname, "./src/hooks"),
		"@styles": path.resolve(__dirname, "./src/styles"),
		"@services": path.resolve(__dirname, "./src/services"),
		"@interfaces": path.resolve(__dirname, "./src/interfaces"),
		"@components": path.resolve(__dirname, "./src/components")
    }
  }
})
