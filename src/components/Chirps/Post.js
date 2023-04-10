import React, { useContext, useEffect, useState } from 'react'
import { BsChat } from "react-icons/bs"
import { FaRetweet } from "react-icons/fa"
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from 'react-icons/ai'
import { RiDeleteBin5Line } from 'react-icons/ri'
import Moment from 'react-moment'
import Modal from '@/components/Common/Modal'
import { db } from "@/firebase"
import { useRouter } from 'next/router'
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, addDoc, where } from 'firebase/firestore'
import { useSession } from "next-auth/react"
import { AppContext } from '@/contexts/AppContext'


const Post = ({ post}) => {
  const {data: session} = useSession()
  const [dislikes, setDislikes] = useState([])
  const [disliked, setDisliked] = useState(false)
  const [likes, setLikes] = useState([])
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState([])
  const [commentModal, setCommentModal] = useState(false)
  const [retweetee, setRetweetee] = useState(null)
  const router = useRouter()
  const userId = typeof window !== "undefined" ? localStorage.getItem('userId'): ''

  useEffect(() => {
    setLiked(post.likes.includes(userId))
    setLikes(post.likes)
    setDisliked(post.dislikes.includes(userId))
    setDislikes(post.dislikes)
    console.log(post)
    if(post.id){
      onSnapshot(query(
        collection(db, "posts", post.id, "replies")),
        (snapshot) => {
          const replies = snapshot.docs.map((doc) => doc.data())
          setComments(replies)
          if(post.retweeteeId!=undefined){
            onSnapshot(query(
              collection(db, "users"), where("userId", "==", post.userId)),
              (snapshot) => {
                if(snapshot.docs && snapshot.docs.length > 0){
                  console.log("execute")
                  console.log(snapshot.docs[0].data())
                  setRetweetee(snapshot.docs[0].data())
                }
              }
            )
          }
        }
      )
    }
  }, [])

  
  const likePost = async () => {
    let updatedLikes = likes
    let updatedLiked = liked
    let updatedDislikes = dislikes
    let updatedDisliked = disliked
      if(liked == true){
        updatedLikes = likes.filter(id => id!== userId)
        updatedLiked = false;
      }
      else{
        updatedLiked = true;
        updatedLikes = [...likes, userId]
        updatedDisliked = false;
        updatedDislikes = dislikes.filter(id => id!== userId)
      }
    await updateDoc(doc(db, "posts", post.id), {
      likes: updatedLikes,
      dislikes: updatedDislikes
    })
    setLiked(updatedLiked)
    setLikes(updatedLikes)
    setDisliked(updatedDisliked)
    setDislikes(updatedDislikes)
  }
  const dislikePost = async () => {
    let updatedLikes = likes
    let updatedLiked = liked
    let updatedDislikes = dislikes
    let updatedDisliked = disliked
      if(disliked == true){
        updatedDislikes = dislikes.filter(id => id!== userId)
        updatedDisliked = false;
      }
      else{
        updatedLiked = false;
        updatedLikes = likes.filter(id => id!== userId)
        updatedDisliked = true;
        updatedDislikes = [...dislikes, userId]
      }
    await updateDoc(doc(db, "posts", post.id), {
      likes: updatedLikes,
      dislikes: updatedDislikes
    })
    setLiked(updatedLiked)
    setLikes(updatedLikes)
    setDisliked(updatedDisliked)
    setDislikes(updatedDislikes)
  }

  const openModal = (e) => {
    e.stopPropagation()
    setCommentModal(true)
  }

  const retweetPost = async () => {
    const docRef = await addDoc(collection(db, `posts`), {
      ...post,
      userId: userId,
      retweeteeId: post.userId,
    })
    await updateDoc(doc(db, "posts", docRef.id), {
        id: docRef.id
    })
  }

  return (
    <div className='post_container' onClick={() => router.push(`/chirps/${post.id}`)}>
      {
        retweetee?(
          <div className="ml-3 mb-2 text-xs text-gray-300 flex">
            <FaRetweet className='w-3 h-3 mr-2 my-auto' />
            {retweetee.username} retweeted this
          </div>
        )
        :null
      }
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
          <p className="my-2 text-lg">{post?.text}</p>
          <img
            className='post_image'
            src={post?.image}
            alt="" />
          <div className='post_action_bar'>
            <div className='flex gap-1 items-center'>
            <div className='post_action_button'>
                {
                  post.retweeteeId?null:<BsChat className='h-5 w-5' onClick={(openModal)} />
                }
                {comments.length > 0 && (<span className='text-sm ml-2'>{comments.length}</span>)}
                </div>
            </div>
              
            <div className='flex gap-1 items-center'>
            {post.userId !== userId ? (
                <div className='post_action_button' onClick={()=>retweetPost()}>
                    <FaRetweet className='w-5 h-5' />
                </div>
            ) : (
                <div className='post_action_button'>
                    <RiDeleteBin5Line className='w-5 h-5'
                        onClick={(e) => {
                        e.stopPropagation();
                        deleteDoc(doc(db, "posts", post.id));
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
      <Modal open={commentModal} setOpen={setCommentModal} post={post} userId={userId} />
    </div>
  )
}

export default Post