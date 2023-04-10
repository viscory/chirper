import React, {useEffect, useState} from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import { addDoc, collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
const EmailLogin = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [valid, setValid] = useState(false)
    useEffect(() => {
        if(email && password){
            setValid(true)
        }
        else{
            setValid(false)
        }
    }, [email, password])

    const loginUser = async () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(async (res) => {
            onSnapshot(
                query(
                  collection(db, `users`), where("email", "==", res.user.email)
                ),
                (snapshot: any) => {
                  localStorage.setItem('userId', res.user.uid)
                  localStorage.setItem('username', snapshot.docs[0].data().tag)
                  localStorage.setItem('tag', snapshot.docs[0].data().tag)
                }
              )
            router.push('/')
        })
        .catch((error) => {
            console.log(error);
            setError(error.message)
        })

    }

    const [hasMounted, setHasMounted] = React.useState(false);
    React.useEffect(() => {
      setHasMounted(true);
    }, []);
    if (!hasMounted) {
      return null;
    }
    return(
        <>
        <Head>
          <title>Chirper - Login</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="text-white min-h-screen">
            <h1 className="text-center text-4xl font-semibold mt-4">Login</h1>
            <div className="bg-gray-800 rounded-xl mx-auto my-auto p-8 items-center text-black w-4/5 lg:w-1/2 max-w-[800px] mt-10">
                <div className="w-full">
                    <div className="text-white text-lg my-2">Email</div>
                    <input type="email" className="w-full" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="w-full">
                    <div className="text-white text-lg my-2">Password</div>
                    <input type="password" className="w-full" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="flex">
                    <div className="my-auto text-white underline cursor-pointer" onClick={()=>router.push('/signup')}>Need to register for an account? Click here!</div>
                    {
                        valid
                        ?<div className="rounded-full px-4 py-2 bg-blue-400 mt-4 w-fit cursor-pointer ml-auto" onClick={()=>loginUser()}>Login</div>
                        :<div className="rounded-full px-4 py-2 bg-gray-400 mt-4 w-fit cursor-not-allowed ml-auto">Login</div>
                    }
                    

                </div>
            </div>
        </div>
        </>
    )
}
export default EmailLogin