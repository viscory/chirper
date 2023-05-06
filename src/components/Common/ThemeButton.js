import { useTheme } from 'next-themes'; // Import the useTheme hook from next-themes
import { HiOutlineSun, HiMoon } from 'react-icons/hi'; // Import the HiOutlineSun and HiMoon icons from react-icons/hi
import React from 'react';

// Define ThemeButton component
const ThemeButton = () => {
  const { theme, setTheme } = useTheme(); // Initialize the useTheme hook and get the current theme and the setTheme function
  const [hasMounted, setHasMounted] = React.useState(false); // Initialize a state variable to keep track of whether the component has mounted

  React.useEffect(() => {
    setHasMounted(true); // Set the hasMounted state variable to true when the component mounts
  }, []);

  // Return null if the component hasn't mounted yet
  if (!hasMounted) {
    return null;
  }

  // Render the ThemeButton component
  return (
    <div className="absolute right-4 lg:right-6 bottom-4 lg:bottom-6">
      {theme === 'light' // If the theme is light, render the HiOutlineSun icon and set the theme to dark when clicked
        ? (
          <HiOutlineSun className="text-yellow-400 h-8 w-8 cursor-pointer" onClick={() => setTheme('dark')} />
        )
        : ( // If the theme is dark, render the HiMoon icon and set the theme to light when clicked
          <HiMoon className="text-yellow-400 h-8 w-8 cursor-pointer" onClick={() => setTheme('light')} />
        )}
    </div>
  );
};

export default ThemeButton; // Export the ThemeButton component
