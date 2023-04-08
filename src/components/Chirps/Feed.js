import React, { useEffect, useState, useContext } from 'react'
import { onSnapshot, collection, query, orderBy, where, addDoc } from 'firebase/firestore'
import { HiOutlineSparkles } from 'react-icons/hi'
import Post from './Post'
import { db } from '@/firebase'
import Input from '../Common/Input'
import { useSession } from "next-auth/react"
import { AppContext } from '@/contexts/AppContext'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const { data: session } = useSession()
  const [appContext, setAppContext] = useContext(AppContext)
  const [addNewUser, setAddNewUser] = useState(true)
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, `users`), where("tag", "==", session?.user?.tag)
      ),
      (snapshot) => {
        if(snapshot.docs.length == 0) {
          setAddNewUser(false);
        }
        else{
          const id = snapshot.docs[0].id
          setAppContext({
            userId: id,
            username: session.user.name,
            userImg: session.user.image,
            tag: session.user.tag
          })
        }
      }
    )
  }, [])


  const addUserToDB = async () => {
    const docRef = await addDoc(collection(db, `users`), {
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag
    })
    localStorage.setItem("userId", docRef.id)
    setAppContext({
      ...appContext, 
      user: {
        userId: docRef.id,
        username: session.user.name,
        userImg: session.user.image,
        tag: session.user.tag
      }
    })
    setAddNewUser(true);
  }

  return (
    <>
      
      <div className='sticky top-0 bg-black flex justify-between font-medium text-xl px-4 py-2'>
        Home
        <HiOutlineSparkles/>
      </div>
      {
        addNewUser == false
        ?(
          <div className="text-center text-xl">
          <div className="">Welcome to Chirper!</div>
          <div className="px-3 py-1 bg-green-800 rounded-3xl w-fit mx-auto mt-2" onClick={()=>addUserToDB()}>Start</div>
          </div>
        )
        :(
          <>
          <Input className=''/>
          {posts.map((post) => {
          return(
            <Post key={post.id} post={post.data()} id={post.id} />
          )
        })}
        </>
        )
      }
    </>
  )
}

export default Feed
