import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'

import { addDoc, collection } from '@firebase/firestore'

//account creation/signup, we store the details to firebase after validating/verifying them
// we also set all of these values in localstorage so the user is immediately logged in
const EmailSignup = () => {
  const [hasMounted, setHasMounted] = React.useState(false)
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [tag, setTag] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const [valid, setValid] = useState(false)
  useEffect(() => {
    if (window != undefined && localStorage.getItem('userId')) {
      router.push('/')
    }
  }, [])
  useEffect(() => {
    if (username && tag && email && password && password2 && password == password2) {
      setValid(true)
    } else {
      setValid(false)
    }
  }, [username, tag, email, password, password2])
  React.useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) {
    return null
  }
  const loginUser = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        localStorage.setItem('username', username)
        localStorage.setItem('tag', tag)
        addUserToDB(res.user.uid)
        router.push('/')
      })
      .catch((error) => {
        console.log(error)
        setError(error.message)
      })
  }

  const addUserToDB = async (id: string) => {
    const docRef = await addDoc(collection(db, 'users'), {
      username,
      userImg: 'https://www.sksales.com/wp-content/uploads/2016/12/Unknown-Placeholder-Portrait-20150724A.jpg',
      tag,
      userId: id,
      following: [id],
      email
    })
    localStorage.setItem('userId', id)
    localStorage.setItem('username', username)
    localStorage.setItem('tag', tag)
  }
  return (
        <>
        <Head>
          <title>Chirper - Sign Up</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="text-white min-h-screen bg-white dark:bg-slate-900">
            <h1 className="text-center text-4xl font-semibold pt-4 text-black dark:text-white">Sign Up</h1>
            <div className="bg-white-500 dark:bg-gray-800 rounded-xl mx-auto my-auto p-8 items-center text-black w-4/5 lg:w-1/2 max-w-[800px] mt-10">
                <div className="w-full">
                    <div className="text-white text-lg my-2">Username</div>
                    <input type="text" className="w-full dark:text-white" value={username} onChange={(e) => { setUsername(e.target.value) }}/>
                </div>
                <div className="w-full">
                    <div className="text-white text-lg my-2">Tag</div>
                    <input type="text" className="w-full dark:text-white" value={tag} onChange={(e) => { setTag(e.target.value) }}/>
                </div>
                <div className="w-full">
                    <div className="text-white text-lg my-2">Email</div>
                    <input type="email" className="w-full dark:text-white" value={email} onChange={(e) => { setEmail(e.target.value) }}/>
                </div>
                <div className="w-full">
                    <div className="text-white text-lg my-2">Password</div>
                    <input type="password" className="w-full dark:text-white" value={password} onChange={(e) => { setPassword(e.target.value) }}/>
                </div>
                <div className="w-full">
                    <div className="text-white text-lg my-2">Re-enter Password</div>
                    <input type="password" className="w-full dark:text-white" value={password2} onChange={(e) => { setPassword2(e.target.value) }}/>
                </div>
                <div className="flex">

                    <div className="my-auto text-white underline cursor-pointer" onClick={async () => await router.push('/login')}>Already have an account? Login here!</div>
                    {
                        valid
                          ? <div className="rounded-full px-4 py-2 bg-white-400 mt-4 w-fit cursor-pointer ml-auto" onClick={async () => { await loginUser() }}>Sign Up</div>
                          : <div className="rounded-full px-4 py-2 bg-gray-400 mt-4 w-fit cursor-not-allowed ml-auto">Sign Up</div>
                    }
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        </div>
        </>
  )
}
export default EmailSignup
