// Import necessary modules and components
import React, { useState, Fragment } from 'react';
import { BsImage, BsEmojiSmile } from 'react-icons/bs';
import { AiFillCloseCircle } from 'react-icons/ai';
import { RiBarChart2Line } from 'react-icons/ri';
import { IoCalendarNumberOutline } from 'react-icons/io5';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';

import { Dialog, Transition } from '@headlessui/react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

// Define functional component called Modal that renders a reply modal
const Modal = ({ open, setOpen, post }) => {
  // Define state variables using the useState hook
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);

  // Function to add image to post
  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  // Function to add emoji to input field
  const addEmoji = (e) => {
    const sym = e.unified.split('-');
    const codesArray = [];
    sym.forEach((el) => codesArray.push('0x' + el));
    const emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  };

  // Function to send reply to Firestore database
  const sendReply = async () => {
    const docRef = await addDoc(collection(db, 'posts', post.id, 'replies'), {
      username: localStorage.getItem('username'),
      userImg: 'https://www.sksales.com/wp-content/uploads/2016/12/Unknown-Placeholder-Portrait-20150724A.jpg',
      tag: localStorage.getItem('tag'),
      text: input,
      time: serverTimestamp()
    });
    await updateDoc(doc(db, 'posts', post.id, 'replies', docRef.id), {
      id: docRef.id
    });
    setInput('');
    setOpen(false);
  };

  // Render the reply modal
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-visible"
        onClose={() => setOpen(false)}
      >
        <div
          className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block
          sm:p-0"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-300 dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-50 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className="inline-block align-bottom bg-gray-100 dark:bg-gray-800
              text-left
              overflow-visible shadow-xl
              transform transition-all
              sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"
            >
              {/* Modal header */}
              <div className="bg-gray-100 dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-2 sm:text-left">
                    <Dialog.Title as="div" className="text-lg leading-6 font-medium text-black dark:text-white">
                      Replying to @{post.tag}'s chirp
                    </Dialog.Title>
                  </div>
                </div>
              </div>

              {/* Modal body */}
              <div className='flex flex-col px-8'>
                <div className="mt-2">
                  <textarea
                    className='post_textarea h-auto text-white'
                    placeholder="Type you reply here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows="6"
                  />
                  {selectedFile && (
                    <div className="relative w-fit">
                      <img
                        src={selectedFile}
                        alt=''
                        className='rounded-2xl h-20 w-20 object-contain my-4'
                      />
                      <div className="absolute -right-2 -top-2 cursor-pointer" onClick={() => setSelectedFile(null)}>
                        <AiFillCloseCircle className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>

                <div className='flex gap-4 text-[20px] text-[#ab4f56]'>
                  {/* Button to add image */}
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

                  {/* Button to add chart */}
                  <RiBarChart2Line className='rotate-90' />

                  {/* Button to show emojis */}
                  <BsEmojiSmile className='cursor-pointer' onClick={() => setShowEmojis(!showEmojis)} />

                  {/* Button to add calendar */}
                  <IoCalendarNumberOutline />

                  {/* Button to add location */}
                  <HiOutlineLocationMarker />
                </div>
              </div>

              {/* Emoji picker component */}
              {showEmojis && (
                <div className='absolute max-w-[320px] rounded-[20px] z-50'>
                  <Picker
                    onEmojiSelect={addEmoji}
                    data={data}
                    theme="dark"
                  />
                </div>
              )}

              {/* Modal footer */}
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 sm:px-6 flex">
                <div className="ml-auto">
                  {/* Cancel button */}
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center
                    rounded-md border border-gray-300 shadow-sm px-4 py-2
                    bg-white text-base font-medium text-gray-700
                      hover:bg-gray-50 focus:outline-none focus:ring-2
                      focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0
                      sm:ml-3 sm:w-auto sm:text-sm ml-auto"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>

                  {/* Reply button */}
                  <button
                    className="bg-[#ab4f56] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#ab4f56] disabled:opacity-50 disabled:cursor-default ml-4"
                    disabled={!input.trim() && !selectedFile}
                    onClick={sendReply}
                  >
                    Chirp
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

// Export the Modal component as the default export of this module
export default Modal;
