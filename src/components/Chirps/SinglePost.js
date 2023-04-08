import React, { useEffect, useState } from 'react'
import { BsArrowLeft } from "react-icons/bs"
import Input from '../Common/Input'
import Post from './Post'
import { onSnapshot, collection, query, orderBy, doc, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from 'next/router';
import Comment from './Comment';

const SinglePost = () => {

    const [post, setPost] = useState(null)
    const router = useRouter()
    const [comments, setComments] = useState([])

    useEffect(
        () =>{
            if(window !== "undefined"){
                onSnapshot(query(collection(db, `users`), where("userId", "==", window.location.pathname.split('/')[2])), 
                    (snapshot) => {
                        setPost(snapshot.docs[0].data().posts.filter(post => post.id === window.location.pathname.split('/')[4])[0])
                        setComments(snapshot.docs[0].data().comments)
                    }
                )  
            }
        []}
    , [])

    useEffect(() => {
        console.log(comments)
        console.log(post)
    }, [comments, post])
    return (
        <section className='w-[600px] min-h-screen border-r border-gray-400 text-white py-2'>
            <div className='sticky top-0 bg-black flex items-center gap-4 font-medium text-[20px] px-4 py-2'>
                <BsArrowLeft className='cursor-pointer' onClick={() => router.push(`/`)} />
                Twitter
            </div>
            {
                post?<Post post={post} />:null

            }
            

            <div className='border-t border-gray-700'>
                {comments && comments.length > 0 && (
                    <div className="pb-72">
                        {comments.map((comment) => (
                            <Comment
                                key={comment.id}
                                id={comment.id}
                                comment={comment.data()}
                            />
                        ))}
                    </div>
                )}
            </div>


        </section>
    )
}

export default SinglePost