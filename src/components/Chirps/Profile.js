import React, { useEffect, useState, useContext } from 'react'
import { onSnapshot, collection, query, orderBy, where, addDoc, updateDoc, doc, arrayUnion,  documentId, or } from 'firebase/firestore'
import { HiOutlineSparkles } from 'react-icons/hi'
import { BsArrowLeft } from "react-icons/bs"
import Post from './Post'
import { db } from '@/firebase'
import Input from '../Common/Input'
import { useRouter } from 'next/router';

const Profile = () => {
  const [posts, setPosts] = useState([])
  const [profile_user, setProfileUser] = useState(null)
  const [dataFetched, setDataFetched] = useState(false);
  const [user, setUser] = useState(null)
  const profile_tag = window.location.pathname.split("/")[2];

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, `users`), where("tag", "==", profile_tag)
      ),
      (snapshot) => {
        if(snapshot.docs.length > 0) {
        const userWithProfileTag = snapshot.docs[0].data()
        setProfileUser(snapshot.docs[0].data())
          onSnapshot(
            query(
              collection(db, `posts`), where("userId", "==", userWithProfileTag.userId)
            ),
            (snapshot) => {
              setPosts(snapshot.docs.map((doc) => doc.data()).sort((a, b) => b.timestamp - a.timestamp))
            }
          )
        }
        setDataFetched(true);
      }
    )
  }, [])

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
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  React.useEffect(() => {
    console.log(posts);
  }, [posts]);
  if (!hasMounted) {
    return null;
  }
  return (
    <>
      {profile_user && (
        <>
          <div className='sticky top-0 bg-black flex items-center gap-4 z-10 font-medium text-[20px] px-4 py-2'>
            <BsArrowLeft className='cursor-pointer' onClick={() => router.push(`/`)} />
            Profile
          </div>
  
          <div className="profile-header">
            <img src={profile_user.userImg} alt={`${profile_user.username}'s profile`} className="profile-image" />
            <h2 className="profile-name">{profile_user.username}</h2>
            <p className="profile-tag">{profile_user.tag}</p>
          </div>
      
          {posts.map((post) => {
            return (
              <Post key={post.id} post={post} id={post.id} user={user} updatePost={updatePost} />
            )
          })}
        </>
      )}
  
  {!profile_user && dataFetched && (
      <div className="message-container">
        <h2 className="message-text">User doesn't exist</h2>
      </div>
    )}

    {!profile_user && !dataFetched && (
      <div className="message-container">
        <h2 className="message-text">Loading...</h2>
      </div>
    )}
    </>
  )
  
}

export default Profile
