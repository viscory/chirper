import React, { useContext, useEffect, useState } from 'react'
import { BsChat } from "react-icons/bs"
import { FaRetweet } from "react-icons/fa"
import { AiOutlineHeart, AiOutlineRetweet, AiFillHeart, AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from 'react-icons/ai'
import { RiDeleteBin5Line } from 'react-icons/ri'
import Moment from 'react-moment'

import { db } from "../firebase"
import { useRouter } from 'next/router'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore'
import { useSession } from "next-auth/react"
import { AppContext } from '../contexts/AppContext'


const Post = ({ id, post }) => {

  const [dislikes, setDislikes] = useState([])
  const [disliked, setDisliked] = useState(false)
  const [likes, setLikes] = useState([])
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState([])

  const { data: session } = useSession()
  const router = useRouter()

  const [appContext, setAppContext] = useContext(AppContext)

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  )

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
      
      onSnapshot(collection(db, "posts", id, "dislikes"), (snapshot) =>
        setDislikes(snapshot.docs)
      ),
    [db, id]
  )

  useEffect(() =>
    setLiked(
      likes.findIndex((like) => like.id === session?.user?.uid) !== -1
    ), [likes]
  )
  useEffect(() =>
    setDisliked(
      dislikes.findIndex((dislike) => dislike.id === session?.user?.uid) !== -1
    ), [dislikes]
  )

  const likePost = async () => {
    if (liked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.name,
      });
    }
    if (disliked) {
        await deleteDoc(doc(db, "posts", id, "dislikes", session.user.uid));
    }
  }
  const dislikePost = async () => {
    if (disliked) {
      await deleteDoc(doc(db, "posts", id, "dislikes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "dislikes", session.user.uid), {
        username: session.user.name,
      });
    }
    if (liked) {
        await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    }
  }

  const openModal = () => {
    setAppContext({
      ...appContext, 
      isModalOpen: true,
      post,
      postId: id
    })

    console.log('opening model ', appContext.post);
  }
    console.log(post)

  return (
    <div className='post_container' onClick={() => router.push(`/post/${id}`)}>
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
                {comments.length > 0 && (<span className='text-sm'>{comments.length}</span>)}
                </div>
            </div>
              
            {session.user.uid !== post?.id ? (
              <FaRetweet className='hoverEffect w-7 h-7 p-1' />
            ) : (
              <RiDeleteBin5Line className='hoverEffect w-7 h-7 p-1'
                onClick={(e) => {
                  e.stopPropagation();
                  deleteDoc(doc(db, "posts", id));
                }} />
            )}
            <div className='flex gap-1 items-center'
              onClick={(e) => {
                e.stopPropagation()
                likePost()
              }}>
              {liked ? <AiFillLike className='hoverEffect w-7 h-7 p-1 text-green-700' />
                : <AiOutlineLike className='hoverEffect w-7 h-7 p-1' />}

              {likes.length > 0 && (<span className={`${liked && "text-green-700"} text-sm`}>{likes.length}</span>)}
            </div>
            <div className='flex gap-1 items-center'
              onClick={(e) => {
                e.stopPropagation()
                dislikePost()
              }}>
              {disliked ? <AiFillDislike className='hoverEffect w-7 h-7 p-1 text-red-700' />
                : <AiOutlineDislike className='hoverEffect w-7 h-7 p-1' />}

              {dislikes.length > 0 && (<span className={`${disliked && "text-red-700"} text-sm`}>{dislikes.length}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post