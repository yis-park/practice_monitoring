// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import './styles/reset.css';
import './styles/style.css';
import App from './App.tsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import materialTheme from './theme.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={materialTheme}>
    <CssBaseline />
    <QueryClientProvider client={queryClient}>
      <App />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </ThemeProvider>
);
