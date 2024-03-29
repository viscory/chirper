import React, { useState, useContext } from 'react' // Import React library and useState and useContext hooks
import { BsImage } from 'react-icons/bs' // Import the BsImage icon from react-icons/bs package
import { AiOutlineClose, AiOutlineAlignLeft, AiOutlineMeh, AiOutlineCalendar, AiOutlineVerticalAlignBottom } from 'react-icons/ai' // Import several icons from react-icons/ai package
import { AppContext } from '@/contexts/AppContext' // Import the AppContext context
import data from '@emoji-mart/data' // Import emoji data from the emoji-mart package
import Picker from '@emoji-mart/react' // Import the Emoji Picker component from the emoji-mart package
import { addDoc, collection, doc, serverTimestamp, updateDoc, setDoc, arrayUnion } from 'firebase/firestore' // Import several functions from the Firebase Firestore library
import { db, storage } from '../../firebase' // Import the Firebase database and storage instances
import { getDownloadURL, ref, uploadString } from 'firebase/storage' // Import several functions from the Firebase storage library
import { AkismetClient } from 'akismet-api' // Import the AkismetClient class from the akismet-api package

// Define a React component called Input
const Input = ({ user }) => {
  const [loading, setLoading] = useState(false) // Initialize a state variable called loading
  const [input, setInput] = useState('') // Initialize a state variable called input
  const [selectedFile, setSelectedFile] = useState(null) // Initialize a state variable called selectedFile
  const [showEmojis, setShowEmojis] = useState(false) // Initialize a state variable called showEmojis
  const [appContext, setAppContext] = useContext(AppContext) // Retrieve the app context using the useContext hook
  const [get_ip, setIp] = useState() // Initialize a state variable called get_ip
  const [isNSFW, setIsNSFW] = useState(false) // Initialize a state variable called isNSFW
  const [isSPAM, setIsSPAM] = useState(false) // Initialize a state variable called isSPAM
  const userId = localStorage.getItem('userId') // Retrieve the user id from the local storage

  const addImageToPost = (e) => {
    const reader = new FileReader()
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result)
    }
  }

  const addEmoji = (e) => {
    const sym = e.unified.split('-')
    const codesArray = []
    sym.forEach((el) => codesArray.push('0x' + el))
    const emoji = String.fromCodePoint(...codesArray)
    setInput(input + emoji)
  }

  const key = '8ae38d485caa'
  const blog = 'https://zepto.page'
  const client = new AkismetClient({ key, blog })

  // Define an async function called getIp that retrieves the IP address of the user
  const getIp = async () => {
    // Connect ipapi.co with fetch()
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    // Set the IP address to the constant `ip`
    setIp(data.ip)
  }

  // Run `getIP` function above just once when the page is rendered
  React.useEffect(() => {
    getIp()
  }, [])

  const sendPost = async () => {
    if (loading) { return }
    setLoading(true)

    const comment = {
      ip: get_ip,
      content: input
    }

    try {
      const isSPAM = await client.checkSpam(comment)

      if (isSPAM) console.log('OMG Spam!')
      else console.log('Totally not spam')
    } catch (err) {
      console.error('Something went wrong:', err.message)
    }

    setIsSPAM(isSPAM)

    const docRef = await addDoc(collection(db, 'posts'), {
      username: user.username,
      userImg: user.userImg,
      tag: user.tag,
      userId: user.userId,
      text: input,
      likes: [],
      dislikes: [],
      timestamp: serverTimestamp(),
      views: 0,
      isSPAM,
      isNSFW
    })
    await updateDoc(doc(db, 'posts', docRef.id), {
      id: docRef.id
    })

    const imageRef = ref(storage, `posts/${docRef.id}/image`)
    if (selectedFile) {
      await uploadString(imageRef, selectedFile, 'data_url')
        .then(async () => {
          const downloadURL = await getDownloadURL(imageRef)
          await updateDoc(doc(db, 'posts', docRef.id), {
            image: downloadURL
          })
        })
    }
    setLoading(false)
    setInput('')
    setSelectedFile(null)
    setShowEmojis(false)

    setLoading(false)
    setInput('')
    setSelectedFile(null)
    setShowEmojis(false)
  }

  // Render the component's UI
  return (
    <div className={`flex mt-4 px-4 ${loading && 'opacity-60'}`}>
      <div className='grid grid-cols-[48px,1fr] gap-4'>
        <img src={localStorage.userImg} alt='' className='h-12 w-12 rounded-full object-contain'/>
      </div>
      <div className='w-[90%]'>
        <textarea
          className='post_textarea'
          placeholder="What's happening?"
          value={input}
          onChange={(e) => setInput(e.target.value)}/>
        {selectedFile && (
          <div className='relative mb-4'>
            <div className='absolute w-8 h-8 bg-[#15181c] hover:[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer' onClick={() => setSelectedFile(null)}>
              <AiOutlineClose className='text-white h-5'/>
            </div>

            <img
              src={selectedFile}
              alt=''
              className='rounded-2xl max-h-80 object-contain'/>
          </div>
        )}

        {!loading && (
          <div className='flex justify-between items-center'>
            <div className='flex gap-4 text-[20px] text-[#ab4f56 ]'>
              <label htmlFor="file">
                  <BsImage className='cursor-pointer' />
              </label>
              <input
                  id="file"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={addImageToPost}
              />
              <AiOutlineAlignLeft />
              <AiOutlineMeh className='cursor-pointer' onClick={() => setShowEmojis(!showEmojis)} />
              <AiOutlineCalendar />
              <AiOutlineVerticalAlignBottom />
              <button
                className={`${
                  isNSFW ? 'text-[#ab4f56]' : 'text-[#ab4f56 ]'
                } text-xs font-semibold dark:border--300 flex items-center justify-center`}
                onClick={() => setIsNSFW(!isNSFW)}
              >
                {
                  isNSFW ? 'NSFW' : 'SFW'
                }
              </button>

              </div>
              <button
                  className="bg-[#ab4f56] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#ab4f56] disabled:hover:bg-[#ab4f56] disabled:opacity-50 disabled:cursor-default"
                  disabled={!input.trim() && !selectedFile}
                  onClick={sendPost} >
                  Chirp!
              </button>
          </div>
        )}

      {showEmojis && (
          <div className='absolute mt-[10px] -ml-[40px] max-w-[320px] rounded-[20px] z-10'>
              <Picker
                  onEmojiSelect={addEmoji}
                  data={data}

                  theme="dark"
              />
          </div>
      )}
      </div>
    </div>
  )
}

// Export the Input component as the default export
export default Input
