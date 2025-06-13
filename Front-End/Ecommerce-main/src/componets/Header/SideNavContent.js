import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useSelector } from 'react-redux';

const SideNavContent = ({ title, items }) => {
  const language = useSelector((state) => state.habesha.language);
  const [isOpen, setIsOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({});

  const isGrouped =
    Array.isArray(items) &&
    typeof items[0] === 'object' &&
    items[0] !== null &&
    items[0].hasOwnProperty('category');

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleGroup = (category) => {
    setOpenGroups((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div lang={language === 'EN' ? 'en' : 'am'} className="border-b-[1px] border-b-gray-300">
      {/* Main title */}
      <div
        className="flex items-center justify-between hover:bg-zinc-200 px-6 py-3 cursor-pointer"
        onClick={toggleOpen}
      >
        <h3 className="text-lg font-titleFont font-semibold">{title[language]}</h3>
        <span>{isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}</span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <ul className="text-sm bg-gray-50">
          {isGrouped ? (
            items.map((group, idx) => (
              <div key={idx}>
                <div
                  className="flex items-center justify-between px-6 pt-3 pb-1 font-medium text-gray-700 cursor-pointer hover:bg-zinc-200"
                  onClick={() => toggleGroup(group.category[language])} // Use translated category as key
                >
                  {group.category[language]}
                  <span>
                    {openGroups[group.category[language]] ? (
                      <KeyboardArrowDownIcon />
                    ) : (
                      <KeyboardArrowRightIcon />
                    )}
                  </span>
                </div>

                {openGroups[group.category[language]] &&
                  group.subItems.map((subItem, i) => (
                    <li key={i} className="hover:bg-zinc-200 px-10 py-2 cursor-pointer">
                      <Link
                        to={subItem.link}
                        className="flex items-center justify-between text-black w-full"
                      >
                        {subItem.label[language]}
                        <KeyboardArrowRightIcon fontSize="small" />
                      </Link>
                    </li>
                  ))}
              </div>
            ))
          ) : (
            items.map((item, index) => (
              <li key={index} className="hover:bg-zinc-200 px-6 py-2 cursor-pointer">
                <Link
                  to={item.link}
                  className="flex items-center justify-between text-black w-full"
                >
                  {item.label[language]}
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SideNavContent;