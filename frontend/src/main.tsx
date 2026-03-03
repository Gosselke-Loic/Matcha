import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import './index.css';
import { queryClient } from './api/client'; 
import { routeTree } from './routeTree.gen';
import { useAuthStore } from '@features/auth/store/auth-store';

export const router = createRouter({
  routeTree,
  context: {
    queryClient: undefined!,
    authStore: undefined!
  }
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        context={{ queryClient: queryClient, authStore: useAuthStore }}
      />
    </QueryClientProvider>
  )
};

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render( 
    <StrictMode>
      <App />
    </StrictMode>,
  )
};
