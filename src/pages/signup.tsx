import {useEffect, useState} from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import React from 'react'

const EmailSignup = () => {
    const [hasMounted, setHasMounted] = React.useState(false);
    // const { data: session} = useSession()
    // const session  = getSession()
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [tag, setTag] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [error, setError] = useState('')
    const [valid, setValid] = useState(false)
    useEffect(() => {
        if(window != undefined && localStorage.getItem('userId')){
            router.push('/')
        }
    }, [])
    useEffect(() => {
        if(username && tag && email && password && password2 && password == password2){
            setValid(true)
        }
        else{
            setValid(false)
        }
    }, [username, tag, email, password, password2])
    React.useEffect(() => {
        setHasMounted(true);
    }, []);
    if (!hasMounted) {
        return null;
    }
    const loginUser = async () => {
        console.log(email, password, password2);
        createUserWithEmailAndPassword(auth, email, password)
        .then(async (res) => {
            const user = res.user;
            console.log(user);
            localStorage.setItem('username', username);
            localStorage.setItem('tag', tag);
            localStorage.setItem('userId', user.uid);
            router.push('/')
        })
        .catch((error) => {
            console.log(error);
            setError(error.message)
        })

    }
    return(
        <>
        <Head>
          <title>Chirper - Login</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="text-white min-h-screen">
            <h1 className="text-center text-4xl font-semibold mt-4">Sign Up</h1>
            <div className="bg-gray-800 rounded-xl mx-auto my-auto p-8 items-center text-black w-4/5 lg:w-1/2 max-w-[800px] mt-10">
                <div className="w-full">
                    <div className="text-white text-lg my-2">Username</div>
                    <input type="text" className="w-full" value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className="w-full">
                    <div className="text-white text-lg my-2">Tag</div>
                    <input type="text" className="w-full" value={tag} onChange={(e) => setTag(e.target.value)}/>
                </div>
                <div className="w-full">
                    <div className="text-white text-lg my-2">Email</div>
                    <input type="email" className="w-full" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="w-full">
                    <div className="text-white text-lg my-2">Password</div>
                    <input type="password" className="w-full" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="w-full">
                    <div className="text-white text-lg my-2">Re-enter Password</div>
                    <input type="password" className="w-full" value={password2} onChange={(e) => setPassword2(e.target.value)}/>
                </div>
                {
                    valid
                    ?<div className="rounded-full px-4 py-2 bg-blue-400 mt-4 w-fit cursor-pointer" onClick={()=>loginUser()}>Login</div>
                    :<div className="rounded-full px-4 py-2 bg-gray-400 mt-4 w-fit cursor-not-allowed">Login</div>
                }
                
                {error && <div className="alert alert-danger">{error}</div>}

            </div>
        </div>
        </>
    )
}
export default EmailSignup