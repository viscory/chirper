import { signIn } from 'next-auth/react'
import React from 'react'

import { BsTwitter } from 'react-icons/bs'

const Sidebar = () => {
  return (
    <div className='hidden sm:flex flex-col items-center xl:items-start xl-w-[340px] p-2 fixed h-full border-r border-gray-400 pr-0 xl:pr-8'>
      <div className='flex items-center justify-center w-14 h-14 hoverEffect p-0 xl:ml-24'>
        <BsTwitter className='text-white-[34px]'/>
      </div>
      <div className='space-y-2 mt-4 mb-2.5 xl:ml-24'>
        
      </div>
    </div>
  )
}

export default Sidebar
