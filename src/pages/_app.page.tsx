import { QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';
import { Footer } from '../layout/Footer';
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
        className="fixed top-10 right-10 z-20 transition-all hover:scale-105"
      >
        {isDarkMode ? (
          <BsFillMoonStarsFill size={30} className="fill-white" />
        ) : (
          <BsFillSunFill size={30} className="bg-transparent fill-yellow-500" />
        )}
      </div>
      <Footer />
    </QueryClientProvider>
  );
}
