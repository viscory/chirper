import React, { useContext, useEffect, useState } from 'react'
import { BsChat } from "react-icons/bs"
import { FaRetweet } from "react-icons/fa"
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from 'react-icons/ai'
import { RiDeleteBin5Line } from 'react-icons/ri'
import Moment from 'react-moment'

import { db } from "@/firebase"
import { useRouter } from 'next/router'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore'
import { useSession } from "next-auth/react"
import { AppContext } from '@/contexts/AppContext'


const Post = ({ id, post }) => {

  const [dislikes, setDislikes] = useState([])
  const [disliked, setDisliked] = useState(false)
  const [likes, setLikes] = useState([])
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState([])

  const { data: session } = useSession()
  const router = useRouter()
  console.log(post)
  const [appContext, setAppContext] = useContext(AppContext)

  useEffect(() => {
      if(window !== "undefined"){
        onSnapshot(
        query(
          collection(db, `users/${post.userId}/posts`, post.id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          setComments(snapshot.docs)
          onSnapshot(collection(db, `users/${post.userId}/posts`, post.id, "likes"), (snapshot) => {
                const data = snapshot.docs
                setLikes(data)
                setLiked(
                    data.findIndex((like) => like.id === post.userId) !== -1
                )
                onSnapshot(collection(db, `users/${post.userId}/posts`, post.id, "dislikes"), (snapshot) => {
                      const data = snapshot.docs
                      setDislikes(data)
                      setDisliked(
                          data.findIndex((dislike) => dislike.id === post.userId) !== -1
                      )
                  })
                })
            
        }
      )}}, 
    // [db, id]
    []
  )
  
  const likePost = async () => {
    if (liked) {
        setLiked(false);
        await deleteDoc(doc(db, `users/${post.userId}/posts`, post.id, "likes", post.userId));
    } 
    else {
        setLiked(true)
        await setDoc(doc(db, `users/${post.userId}/posts`, post.id, "likes", post.userId), {
            username: session.user.name,
        });
    }
    if (disliked) {
        setDisliked(false)
        await deleteDoc(doc(db, `users/${post.userId}/posts`, post.id, "dislikes", post.userId));
    }
  }
  const dislikePost = async () => {
    if (disliked) {
        setDisliked(false)
        await deleteDoc(doc(db, `users/${post.userId}/posts`, post.id, "dislikes", post.userId));
    } 
    else {
        setDisliked(true)
        await setDoc(doc(db, `users/${post.userId}/posts`, post.id, "dislikes", post.userId), {
            username: session.user.name,
        });
    }
    if (liked) {
        setLiked(false)
        await deleteDoc(doc(db, `users/${post.userId}/posts`, post.id, "likes", userId));
    }
  }

  const openModal = () => {
    setAppContext({
      ...appContext, 
      isModalOpen: true,
      post,
      postId: post.id
    })

  }

  return (
    <div className='post_container' onClick={() => router.push(`/users/${post.userId}/chirps/${post.id}`)}>
      <div className='post_margin'>
        <div>
          <img className='post_avatar' src={post?.userImg} alt="" />
        </div>
        <div>
          <div className='block sm:flex gap-1'>
            <h1 className='font-medium'>{post?.username}</h1>

            <div className='flex'>
              <p className='text-gray-500'>@{post?.tag} &nbsp;·&nbsp;</p>
              <p className='text-gray-500'>
                <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
              </p>
            </div>
          </div>
          <p className="my-2">{post?.text}</p>
          <img
            className='post_image'
            src={post?.image}
            alt="" />
          <div className='post_action_bar'>
            <div className='flex gap-1 items-center'>
            <div className='post_action_button'>
                <BsChat className='h-5 w-5' onClick={(e) => {
                    e.stopPropagation();
                    openModal()
                }} />
                {comments.length > 0 && (<span className='text-sm ml-2'>{comments.length}</span>)}
                </div>
            </div>
              
            <div className='flex gap-1 items-center'>
            {post.userId !== post?.userId ? (
                <div className='post_action_button'>
                    <FaRetweet className='w-5 h-5' />
                </div>
            ) : (
                <div className='post_action_button'>
                    <RiDeleteBin5Line className='w-5 h-5'
                        onClick={(e) => {
                        e.stopPropagation();
                        deleteDoc(doc(db, "posts", id));
                    }} />
                </div>
            )}
            </div>
            <div className='flex gap-1 items-center'
              onClick={(e) => {
                e.stopPropagation()
                likePost()
              }}>
                {
                    liked 
                    ? 
                    <div className='post_action_button'>
                        <AiFillLike className='hoverEffect w-7 h-7 p-1 text-green-700' />
                    </div>
                    : 
                    <div className='post_action_button'>
                        <AiOutlineLike className='hoverEffect w-7 h-7 p-1' />
                    </div>
                }
                {likes.length > 0 && (<span className={`${liked && "text-green-700"} text-sm`}>{likes.length}</span>)}
            </div>
            <div className='flex gap-1 items-center'
              onClick={(e) => {
                e.stopPropagation()
                dislikePost()
              }}>
                {
                    disliked 
                    ? 
                    <div className='post_action_button'>
                        <AiFillDislike className='hoverEffect w-7 h-7 p-1 text-red-700' />
                    </div>
                    : 
                    <div className='post_action_button'>
                        <AiOutlineDislike className='hoverEffect w-7 h-7 p-1' />
                    </div>
                }
              {dislikes.length > 0 && (<span className={`${disliked && "text-red-700"} text-sm`}>{dislikes.length}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post