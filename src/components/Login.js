import { signIn } from 'next-auth/react'
import React from 'react'

import { BsTwitter } from 'react-icons/bs'
import { FcGoogle } from 'react-icons/fc'

const Login = () => {
  return (
    <div className='grid grid-col-2'>
      <div className='bg-[#1d9bf0] h-screen grid place-items-center'>
        <BsTwitter className='text-white text-[200px]'/> 
      </div>

      <div className='grid place-items-center'>
        <div 
          className='flex gap-4 bg-white p-4 px-6 items-center rounded [6px] cursor-pointer'
          onClick={() => signIn('google')}
        >
          <FcGoogle className='text-[30px]'/>
          Sign In with Google
        </div>  
      </div>
    </div>
  )
}

export default Login
