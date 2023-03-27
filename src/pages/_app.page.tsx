import { QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';
import { queryClient } from '../lib/queryClient';
import '../styles/main.css';

export default function App({ Component, pageProps }: AppProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    isDarkMode ? document.documentElement?.classList.add('dark') : document.documentElement?.classList.remove('dark');
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <div
        onClick={() => setIsDarkMode((state) => !state)}
        role="button"
        className="fixed top-10 right-10 z-20 hover:scale-105 transition-all"
      >
        {isDarkMode ? (
          <BsFillMoonStarsFill size={30} className="fill-white" />
        ) : (
          <BsFillSunFill size={30} className="fill-yellow-500 bg-transparent" />
        )}
      </div>
    </QueryClientProvider>
  );
}
