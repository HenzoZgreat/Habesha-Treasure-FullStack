import React from 'react';
import { footerBottomItem } from '../constant/allItems'; // Fixed the space in the import path
import { useSelector } from 'react-redux';

const FooterBottom = () => {
  const language = useSelector((state) => state.habesha.language);

  return (
    <div lang={language === 'EN' ? 'en' : 'am'} className="w-full bg-fotterBottom py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="w-full grid grid-cols-3 md:grid-cols-5 md1:grid-cols-6 lg1:grid-cols-7 gap-3 place-content-center text-gray-400">
          {footerBottomItem.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <h3 className="fotterBottomTitle">{item.title[language]}</h3>
              <p className="fotterBottomText">{item.description[language]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;