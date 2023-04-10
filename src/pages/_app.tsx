import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { AppContextProvider } from '@/contexts/AppContext'

export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  
  if(typeof window === 'undefined') return null
  return (
    <SessionProvider session={session}>
      <AppContextProvider>
        <Component {...pageProps} className="bg-white dark:bg-slate-800" />
      </AppContextProvider>
    </SessionProvider>
  )
}

