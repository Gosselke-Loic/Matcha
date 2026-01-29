import { StrictMode } from 'react';
import ReactDOM  from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './index.css';

const queryClient = new QueryClient();

const router = createRouter({
	context: {
		queryClient
	},
	defaultPreload: "intent",
	defaultPreloadStaleTime: 0,
	scrollRestoration: true
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
};

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</StrictMode>
	);
};
