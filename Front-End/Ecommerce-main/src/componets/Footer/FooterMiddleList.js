import React from 'react';
import { useSelector } from 'react-redux';

const FooterMiddleList = ({ title, listItem }) => {
  const language = useSelector((state) => state.habesha.language);

  return (
    <div className="w-full">
      <h3 className="font-titleFont text-white text-base font-semibold mb-3">
        {title[language]} {/* Line 9: This is where the error occurs */}
      </h3>
      <ul className="flex flex-col gap-2 font-bodyFont">
        {listItem.map((item) =>
          item.listData.map((data, index) => (
            <li key={index} className="footerLink">
              {data[language]}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default FooterMiddleList;