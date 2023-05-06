import React, { useEffect, useState, useContext } from 'react' // Import React library and several hooks
import { onSnapshot, collection, query, orderBy, where, addDoc } from 'firebase/firestore' // Import several functions from the Firebase Firestore library
import { HiOutlineSparkles } from 'react-icons/hi' // Import HiOutlineSparkles icon from react-icons/hi package
import { db } from '@/firebase' // Import the Firebase database instance
import Input from '../Common/Input' // Import the Input component
import { AppContext } from '@/contexts/AppContext' // Import the AppContext context

// Define a React component called UserList
const UserList = () => {
  const [posts, setPosts] = useState([]) // Initialize a state variable called posts
  const { data: session } = useSession() // Retrieve the session data using the useSession hook
  const [appContext, setAppContext] = useContext(AppContext) // Retrieve the app context using the useContext hook
  const [addNewUser, setAddNewUser] = useState(true) // Initialize a state variable called addNewUser

  // Use the useEffect hook to fetch data from the Firestore database
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, 'users'), where('tag', '==', session?.user?.tag)
      ),
      (snapshot) => {
        if (snapshot.docs.length === 0) {
          setAddNewUser(false)
        } else {
          setAppContext({
            ...appContext,
            user: {
              ...appContext.user,
              userId: snapshot.docs[0].id
            }
          })
          onSnapshot(
            query(
              collection(db, `users${snapshot.docs[0].id}`)
            ),
            (snapshot) => {
              setAppContext({
                ...appContext,
                user: snapshot.docs[0]
              })
            }
          )
        }
      }
    )
  }, [])

  // Return a JSX template that defines the user list page's layout
  return (
    <>
      {/* Display a header with the Feed title and HiOutlineSparkles icon */}
      <div className='sticky top-0 bg-black flex justify-between font-medium text-xl px-4 py-2'>
        Feed
        <HiOutlineSparkles/>
      </div>

      {/* If there is no user, display a welcome message and a Start button */}
      {addNewUser == false ? (
        <div className="text-center text-xl">
          <div className="">Welcome to Chirper!</div>
          <div className="px-3 py-1 bg-green-800 rounded-3xl w-fit mx-auto mt-2" onClick={() => addUserToDB()}>Start</div>
        </div>
      ) : (
        // Otherwise, display an input component and a list of posts
        <>
          <Input className=''/>
          {posts.map((post) => {
            return (
              <div>hi</div>
            )
          })}
        </>
      )}
    </>
  )
}

export default UserList // Export the UserList component as the default export
