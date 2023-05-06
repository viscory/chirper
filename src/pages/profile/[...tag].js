import React, { useContext, useState } from 'react'
import Login from '@/components/Login'
import Sidebar from '@/components/Common/Sidebar'
import Head from 'next/head'
import Profile from '@/components/Chirps/Profile'
import { AppContext } from '@/contexts/AppContext'
import Trending from '@/components/Common/Trending'

const ProfilePage = () => {

  // Get the current app context
  const [appContext] = useContext(AppContext)

  // Set mount flag to true after component has mounted
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  // If component has not yet mounted, return null
  if (!hasMounted) {
    return null;
  }

  // Return the main content of the profile page
  return (
    <div>
      <Head>
        <title>Chirper - Post</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='relative max-w-[1400px] mx-auto'>
        <Sidebar/>
        <div className='flex gap-6'>
          <div className='sm:ml-20 xl:ml-[340px] w-[600px] min-h-screen border-r border-gray-400 text-white py-2'>
            <Profile />
          </div>
          <Trending />
        </div>
      </main>
    </div>
  )
}

export default ProfilePage
