import React from 'react';
import { signOut } from 'next-auth/react'; // Import signOut function from next-auth/react module
import { GiEgyptianBird } from 'react-icons/gi'; // Import the GiEgyptianBird icon from react-icons/gi
import { BsThreeDots } from 'react-icons/bs'; // Import the BsThreeDots icon from react-icons/bs
import { AiFillHome, AiOutlineInbox, AiOutlineUser, AiOutlineSetting, AiOutlineYuque } from 'react-icons/ai'; // Import several icons from react-icons/ai
import { useRouter } from 'next/router'; // Import useRouter hook from next/router module
import SidebarLink from './SidebarLink'; // Import the SidebarLink component

// Define Sidebar component
const Sidebar = () => {
  const router = useRouter(); // Initialize useRouter hook
  const userTag = localStorage.getItem('tag'); // Get the user's tag from localStorage

  // Return null if running on server
  if (typeof window === 'undefined') {
    return null;
  }

  // Render the Sidebar component
  return (
    <div className='hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full border-r border-gray-400 pr-0 xl:pr-8 bg-white dark:bg-black text-black dark:text-white'>
      <div className='flex items-center justify-center w-14 h-14 hoverEffect p-0 xl:ml-24' onClick={() => router.push('/')}>
        <GiEgyptianBird className='text-white-400 dark:text-white text-[34px]'/> {/* Render the GiEgyptianBird icon */}
      </div>
      <div className='space-y-2 mt-4 mb-2.5 xl:ml-24'>
        <div onClick={() => router.push('/')}>
          <SidebarLink text='Feed' Icon={AiFillHome}/> {/* Render the SidebarLink component with the text 'Feed' and the AiFillHome icon */}
        </div>
        <SidebarLink text='Messages' Icon={AiOutlineInbox}/> {/* Render the SidebarLink component with the text 'Messages' and the AiOutlineInbox icon */}

        {/* If userTag exists, render the SidebarLink component with the text 'Profile' and the AiOutlineUser icon */}
        {userTag
          ? <div onClick={() => router.push(`/profile/${userTag}`)}>
            <SidebarLink text='Profile' Icon={AiOutlineUser}/>
          </div>
          : null
        }

        {/* If userTag exists, render the SidebarLink component with the text 'Settings' and the AiOutlineSetting icon */}
        {userTag
          ? <div onClick={() => router.push(`/settings/${userTag}/`) }>
          <SidebarLink text='Settings' Icon={AiOutlineSetting}/>
        </div>
          : null
        }

        {/* If userTag is 'admin', render the SidebarLink component with the text 'Admin' and the AiOutlineYuque icon */}
        {userTag === 'admin'
          ? <div  onClick={() => router.push('/admin/')}>
          <SidebarLink text='Admin' Icon={AiOutlineYuque} />
        </div>
          : null
        }
      </div>
      <div className='text-[#d9d9d9] flex items-center justify-center mt-auto hoverEffect xl:ml-auto xl:-mr-5 px-4 py-2' onClick={() => {
        localStorage.clear(); // Clear localStorage
        signOut({ callbackUrl: '/login' }); // Call the signOut function with the callbackUrl set to '/login'
      }}>
        <img src={localStorage.userImg} alt="" className='h-10 w-10 rounded-full xl:mr-2.5'/> {/* Render the user's profile image */}
        <div className='hidden xl:inline leading-5'>
          <h4 className='font-bold text-black dark:text-white'>{localStorage.getItem('username')}</h4> {/* Render the user's username */}
          <h4 className='text-[#6e767d]'>@{localStorage.getItem('tag')}</h4> {/* Render the user's tag */}
        </div>
        <BsThreeDots className='h-5 hidden xl:inline ml-10'/> {/* Render the BsThreeDots icon */}
      </div>
    </div>
  );
};

export default Sidebar; // Export the Sidebar component
