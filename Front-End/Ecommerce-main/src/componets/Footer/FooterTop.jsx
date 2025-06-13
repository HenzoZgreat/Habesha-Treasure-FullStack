import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FooterTop = () => {
  const language = useSelector((state) => state.habesha.language); // Access language state

  // Define bilingual text
  const text = {
    EN: {
      seeRecommendations: 'See personalized recommendations',
      signIn: 'Sign in',
      newCustomer: 'New Customer?',
      startHere: 'Start Here',
    },
    AMH: {
      seeRecommendations: 'ግላዊ ምክሮችን ተመልከት',
      signIn: 'ግባ',
      newCustomer: 'አዲስ ደንበኛ?',
      startHere: 'እዚህ ጀምር',
    },
  };

  const currentText = text[language];

  return (
    <div className="w-full bg-white py-6">
      <div className="w-full border-t-[1px] border-b-[1px] py-8">
        <div className="w-64 mx-auto text-center flex flex-col gap-1">
          <p className="text-sm">{currentText.seeRecommendations}</p>

          <Link
            to="/SignIn"
            className="w-full bg-yellow-400 rounded-md py-1 font-semibold cursor-pointer hover:bg-yellow-500 active:bg-yellow-700"
          >
            {currentText.signIn}
          </Link>
          <p className="text-sm mt-1">
            {currentText.newCustomer}{' '}
            <Link to="/Registration" className="text-blue-600 ml-1 cursor-pointer">
              {currentText.startHere}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FooterTop;