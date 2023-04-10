import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AppContextProvider } from '@/contexts/AppContext'
import { ThemeProvider } from 'next-themes'
import React from 'react';
import ThemeButton from '@/components/Common/ThemeButton';

export default function App({ Component, pageProps: {...pageProps} }: AppProps) {
  
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return (
    <ThemeProvider attribute="class">
      <AppContextProvider>
        <Component {...pageProps} className="bg-white dark:bg-slate-800" />
        <ThemeButton />
      </AppContextProvider>
    </ThemeProvider>
  )
}