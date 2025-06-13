import React, { useState, useRef, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SideNavContent from './SideNavContent';
import { motion } from 'framer-motion';
import choice from './sidenavitem';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HeaderBottom = () => {
  const [sidebar, setSidebar] = useState(false);
  const ref = useRef();
  const menuButtonRef = useRef(); // Add a ref for the menu button
  const language = useSelector((state) => state.habesha.language);

  // Define bilingual text
  const text = {
    EN: {
      all: 'All',
      signIn: 'Hello, Sign In',
    },
    AMH: {
      all: 'ሁሉም',
      signIn: 'ሰላም፣ ግባ',
    },
  };

  const currentText = text[language];

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Ensure the sidebar is open and the click is not on the menu button
      if (
        sidebar &&
        ref.current &&
        !ref.current.contains(e.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target)
      ) {
        setSidebar(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [sidebar, ref, menuButtonRef]); // Include sidebar in dependencies to ensure the listener updates

  const handleOpenSidebar = (e) => {
    e.stopPropagation(); // Prevent the click from immediately triggering the click-outside handler
    
    setSidebar(true);
  };

  return (
    <div lang={language === 'EN' ? 'en' : 'am'} className="w-full bg-habesha_light text-white h-[36px] px-4 py-3 flex items-center">
      <ul className="flex items-center gap-2 text-sm tracking-wide">
        <li
          ref={menuButtonRef}
          onClick={handleOpenSidebar}
          className="headerHover flex items-center gap-1 cursor-pointer"
        >
          <MenuIcon />
          {currentText.all}
        </li>
      </ul>

      {sidebar && (
        <div className="w-full h-screen text-black fixed top-0 left-0 bg-habesha_blue bg-opacity-50">
          <div className="w-full h-full relative">
            <motion.div
              ref={ref}
              initial={{ x: -500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-[80%] md:w-[350px] h-full bg-white border border-black overflow-y-auto"
            >
              <div className="w-full bg-habesha_light text-white py-2 px-6 flex items-center gap-4">
                <AccountCircleIcon />
                <NavLink
                  to="/SignIn"
                  className="font-titleFont font-bold text-lg tracking-wide"
                >
                  {currentText.signIn}
                </NavLink>
              </div>

              {choice.map((item) => (
                <SideNavContent key={item.id} title={item.title} items={item.items} />
              ))}

              <span>
                <CloseIcon
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the close click from bubbling up
                    setSidebar(false);
                  }}
                  className="cursor-pointer absolute top-0 left-[82%] md:left-[360px] w-10 h-10 text-black flex items-center justify-center border bg-gray-200 hover:bg-red-500 hover:text-white duration-300"
                />
              </span>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderBottom;