import React, { useEffect, useState, useContext } from 'react'
import { onSnapshot, collection, query, orderBy, where, addDoc, updateDoc, doc, arrayUnion,  documentId } from 'firebase/firestore'
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
  const [user, setUser] = useState(null)
  useEffect(() => {
    if(session){
      onSnapshot(
        query(
          collection(db, `users`), where("tag", "==", session?.user?.tag)
        ),
        (snapshot) => {
          if(snapshot.docs.length == 0) {
            setAddNewUser(false);
          }
          else{
            setAddNewUser(true)
            setUser(snapshot.docs[0].data())
            const followingList = snapshot.docs[0].data().following
            onSnapshot(
              query(
                collection(db, `posts`), where("userId", "in", followingList)
              ),
              (snapshot) => {
                console.log(snapshot.docs.map((doc) => doc.data()))
                setPosts(snapshot.docs.map((doc) => doc.data()))
              }
            )
          }
        }
      )
    }
  }, [])


  const addUserToDB = async () => {
    const docRef = await addDoc(collection(db, `users`), {
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag
    })
    await updateDoc(doc(db, "users", docRef.id), {
      userId: docRef.id,
      following: [docRef.id]
    })
    setAppContext({
      ...appContext, 
      user: {
        userId: docRef.id,
        username: session.user.name,
        userImg: session.user.image,
        tag: session.user.tag
      }
    })
    setUser({
      userId: docRef.id,
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag
    })
    localStorage.setItem("userId", docRef.id)
    setAddNewUser(true);
  }

  const updatePost = (singlePost) => {
    const update = onSnapshot(
      query(
        collection(db, `users`), where("userId", "==", singlePost.userId)
      ),
      async (snapshot) => {
        const postOwner = snapshot.docs[0].data();
        const replaceIndex = postOwner.posts.findIndex((item) => item.id === singlePost.id)
        postOwner.posts[replaceIndex] = singlePost
        await updateDoc(doc(db, "users", singlePost.userId), {
          posts: postOwner.posts
        })
      }
    );
    update();
    
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
          <div className="px-3 py-1 bg-green-800 rounded-3xl w-fit mx-auto mt-2 cursor-pointer" onClick={()=>addUserToDB()}>Get Started</div>
          </div>
        )
        :(
          <>
          <Input className='' user={user} />
          {posts.map((post) => {
              return(
                <Post key={post.id} post={post} id={post.id} user={user} updatePost={updatePost} />
              )
            }
          )}
        </>
        )
      }
    </>
  )
}

export default Feed
