import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AppContextProvider } from '@/contexts/AppContext'

export default function App({ Component, pageProps: {...pageProps} }: AppProps) {
  
  if(typeof window === 'undefined') return null
  return (
      <AppContextProvider>
        <Component {...pageProps} className="bg-white dark:bg-slate-800" />
      </AppContextProvider>
  )
}

