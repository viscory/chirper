import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { AppContextProvider } from '@/contexts/AppContext'
import Modal from '../components/Modal'
import Trending from '../components/Trending'
import Sidebar from '../components/Sidebar'

export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return (
    <SessionProvider session={session}>
      <AppContextProvider>
      <main className='relative max-w-[1400px] mx-auto'>
          <Sidebar/>
          <div className='flex gap-6'>
          <Component {...pageProps} className="bg-white dark:bg-slate-800" />
            <Trending />
          </div>
        </main>
        <Component {...pageProps} className="bg-white dark:bg-slate-800" />
      </AppContextProvider>
    </SessionProvider>
  )
}

