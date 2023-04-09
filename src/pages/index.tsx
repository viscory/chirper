import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Login from '../components/login'
import Feed from '../components/Chirps/Feed'
import { AppContext } from '@/contexts/AppContext'
import { useContext, useEffect } from 'react'
import Modal from '@/components/Common/Modal'
import Sidebar from '@/components/Common/Sidebar'
import Trending from '@/components/Common/Trending'

export default function Home() {
  const {data: session} = useSession()
  
  const [appContext] = useContext(AppContext)
  if(!session) {
    return <Login />
  }

  return (
    <div>
      <Head>
        <title>Chirper - Home</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
        <main className='relative max-w-[1400px] mx-auto'>
          <Sidebar/>
          <div className='flex gap-6'>
            <div className='sm:ml-20 xl:ml-[340px] w-[600px] min-h-screen border-r border-gray-400 text-white py-2'>
              <Feed />
            </div>
            <Trending />
          </div>
        </main>
    </div>
  )
}
