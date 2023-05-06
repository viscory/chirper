import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/Common/Sidebar'
import Trending from '@/components/Common/Trending'
import { onSnapshot, collection, query, where, doc, updateDoc, orderBy } from 'firebase/firestore'
import { db } from '@/firebase' 
import { useRouter } from 'next/router'

// Component for the user search page
export default function UserSearch () {
  const [result, setResult] = useState([])
  const [following, setFollowing] = useState([])
  const [userId, setUserId] = useState('')
  const [userObjectId, setUserObjectId] = useState('')
  const router = useRouter()
  const searchKeyWord = window.location.pathname.split('/')[2]

  // Search for users whose tags contain the search keyword
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('userId'))
    }
    if (userId) {
      onSnapshot(
        query(collection(db, 'users'), orderBy('tag')),
        (snapshot) => {
          const res = snapshot.docs.filter((doc) => {
            const tag = doc.data().tag.toLowerCase()
            return tag.includes(searchKeyWord.toLowerCase())
          }).map((doc) => doc.data())
          setResult(res)
        }
      )
    }
  }, [userId])

  // Get the following list of the current user and set the user object ID
  useEffect(() => {
    if (userId) {
      setUserId(localStorage.getItem('userId'))

      onSnapshot(
        query(collection(db, 'users'), where('userId', '==', userId)),
        (snapshot) => {
          const following = snapshot.docs[0].data().following
          console.log(following)
          setFollowing(following)
          setUserObjectId(snapshot.docs[0].id)
        }
      )
    }
  }, [result])

  // Follow a user by adding their ID to the following list
  const followUser = async (account) => {
    console.log(userObjectId)
    await updateDoc(doc(db, 'users', userObjectId), {
      following: [...following, account.userId]
    })
  }

  // Unfollow a user by removing their ID from the following list
  const unfollowUser = async (account) => {
    await updateDoc(doc(db, 'users', userObjectId), {
      following: following.filter((id) => id !== account.userId)
    })
  }

  // Set mount flag to true after component has mounted
  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  // If component has not yet mounted, return null
  if (!hasMounted) {
    return null
  }

  // Return the main content of the user search page
  return (
    <div className="bg-white dark:bg-black">
      <Head>
        <title>Chirper - Search</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className='relative max-w-[1400px] mx-auto'>
        <Sidebar/>
        <div className='flex gap-6 text-black dark:text-white'>
          <div className='sm:ml-20 xl:ml-[340px] w-[600px] min-h-screen border-r border-gray-800 dark:border-gray-400 p-2'>
            {/* If there are search results, display them */}
            {
              result.length > 0
                ? (
                    result.map((account) => {
                      return (
                        <div
                          className="border-b-2 border-gray-800 dark:border-gray-400 py-3 flex cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900"
                          onClick={() => router.push(`/profile/${account.tag}`)}
                        >
                          <img
                            src={account.userImg}
                            className="rounded-full w-7 h-7 mr-4 my-auto"
                          />
                          <div className="text-lg mr-4 my-auto">{account.username}</div>
                          <div className="text-lg my-auto">@{account.tag}</div>
                          {
                            account.userId === userId
                            ? (null)
                            : following.includes(account.userId)
                              ? (
                                <>
                                  <div className="action-button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      router.push(`/chat/${userId}/${account.userId}`)
                                    }}
                                  >
                                    Chat
                                  </div>
                                  <div className="action-button" onClick={(e) => {
                                    e.stopPropagation()
                                    unfollowUser(account)
                                  }}>Unfollow</div>
                                </>
                              )
                              : (
                                <>
                                  <div className="action-button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      router.push(`/chat/${userId}/${account.userId}`)
                                    }}
                                  >
                                    Chat
                                  </div>
                                  <div className="action-button" onClick={(e) => {
                                    e.stopPropagation()
                                    followUser(account)
                                  }}>Follow</div>
                                </>
                              )
                          }
                        </div>
                      )
                    })
                  )
                // If there are no search results, display a message
                : (
                  <div className="text-lg text-center py-4">
                    No accounts found.
                  </div>
                )
            }
          </div>
          <Trending />
        </div>
      </main>
    </div>
  )
}
