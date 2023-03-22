import { QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { queryClient } from '../lib/queryClient';
import '../styles/main.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}