import Head from 'next/head'
import { AppContext } from '@/contexts/AppContext'
import React,{ useContext, useEffect, useState } from 'react'
import Modal from '@/components/Common/Modal'
import Sidebar from '@/components/Common/Sidebar'
import Trending from '@/components/Common/Trending'
import { onSnapshot, collection, query, orderBy, where, addDoc ,documentId, deleteDoc, setDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db, firebase } from '@/firebase'

export default function UserSearch() {
    const [result, setResult] = useState([])
    const [following, setFollowing] = useState([])
    const [appContext] = useContext(AppContext)
    const [userId, setUserId] = useState("")
    useEffect(() => {
        if (typeof window !== "undefined") {

          setUserId(localStorage.getItem("userId"))
        
        }
        if(userId){
          onSnapshot(
              query(collection(db, `users`), where("tag", "==", window.location.pathname.split("/")[2])),
              (snapshot) => {
                  let res = snapshot.docs.map((data) => data.data())
                  setResult(res)
                  onSnapshot(
                      query(collection(db, `users`), where(documentId(), "==", userId)),
                      (snapshot) => {
                          let following = snapshot.docs[0].data().following
                          console.log(following)
                          setFollowing(following)
                      }
                  )
              }
          )

        }
    }, [userId])
    

    useEffect(() => {
      console.log(result)
    }, [result, following])

    const followUser = async (account) => {
      console.log(account)
      await updateDoc(doc(db, "users", userId), {
        following: [...following, account.userId]
      })
      setFollowing([...following, account.userId])
    }

    const unfollowUser = async (account) => {
      await updateDoc(doc(db, "users", userId), {
        following: following.filter((id) => id!== account.userId)
      })
      setFollowing(following.filter((id) => id!== account.userId))
    }
 
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return (
    <div>
      <Head>
        <title>Chirper - Search</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head><main className='relative max-w-[1400px] mx-auto'>
          <Sidebar/>
          <div className='flex gap-6'>
            <div className='sm:ml-20 xl:ml-[340px] w-[600px] min-h-screen border-r border-gray-400 text-white p-2'>
              {
                result.map(((account) => {
                    return(
                        <div className="border-b-2 border-white py-3 flex">
                            <img src={account.userImg} className="rounded-full w-7 h-7 mr-4 my-auto" />
                            <div className="text-lg mr-4 my-auto">{account.username}</div>
                            <div className="text-lg my-auto">@{account.tag}</div>
                            {
                                account.userId === userId
                                ?(null)
                                :following.includes(account.userId)
                                ?(<div className="ml-auto px-3 py-2 rounded-lg bg-blue-400 cursor-pointer" onClick={()=>unfollowUser(account)}>Unfollow</div>)
                                :(<div className="ml-auto px-3 py-2 rounded-lg bg-blue-400 cursor-pointer" onClick={()=>followUser(account)}>Follow</div>)
                            }
                            
                        </div>
                    )
                }))
              }
            </div>
            <Trending />
          </div>
        </main>
    </div>
  )
}
