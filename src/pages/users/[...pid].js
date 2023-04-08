import React, { useContext } from 'react'
import { getSession, useSession } from 'next-auth/react'
import Login from '@/components/Login'
import Sidebar from '@/components/Common/Sidebar'
import Head from 'next/head'
import SinglePost from '@/components/Chirps/SinglePost'
import { AppContext } from '@/contexts/AppContext'
import Trending from '@/components/Common/Trending'

const PostPage = () => {

  const { data: session } = useSession()
  const [appContext] = useContext(AppContext)

  if (!session) return <Login />

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
              <SinglePost />
            </div>
            <Trending />
          </div>
        </main>
    </div>
  )
}

export default PostPage

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session
    },
  };
}