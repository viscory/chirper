import React, { useEffect, useState } from 'react'
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore'
import { HiOutlineSparkles } from 'react-icons/hi'

import { db } from '../firebase'
import Input from './Input'

const Feed = () => {
  const [posts, setPosts] = useState([])
  useEffect(
    () => onSnapshot(
      query(collection(db, 'posts'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        setPosts(snapshot.docs)
      }, [db]
    )
  )

  console.log('testing feed object')

  return (
    <div className='sm:ml-[80px] xl:ml-[340px] w-[600px] min-h-screen border-r border-gray-400 text-white py-2'>
      <div className='sticky top-0 bg-black flex justify-between font-medium text-[20px] px-4 py-2'>
        Home
        <HiOutlineSparkles/>
      </div>
      <Input className=''/>
    </div>
  )
}

export default Feed
