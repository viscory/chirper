import React from 'react';

// Define SidebarLink component
const SidebarLink = ({ text, Icon }) => {
  // Render the SidebarLink component
  return (
    <div className='text-black dark:text-[#d9d9d9] flex items-center justify-center xl:justify-start text-xl space-x-3 cursor-pointer px-4 py-2'>
      <Icon /> {/* Render the icon passed to the component */}
      <span className='hidden xl:inline'>{text}</span> {/* Render the text passed to the component */}
    </div>
  );
};

export default SidebarLink; // Export the SidebarLink component
