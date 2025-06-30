import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import api from '../componets/api/api';
import { useSelector } from 'react-redux';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const language = useSelector((state) => state.habesha.language);
  const hasVerified = useRef(false);

  const token = searchParams.get('token');

  const text = {
    EN: {
      verifying: 'Verifying your email...',
      verificationSuccess: 'Email verified successfully! You can now sign in.',
      verificationFailed: 'Email verification failed. Please try again or request a new link.',
      returnToSignIn: 'Return to Sign In',
      returnToHome: 'Return to Home',
      footer: '2025, ReactBd, Inc. or its affiliates',
    },
    AMH: {
      verifying: 'የኢሜይልህን መመዝገብ እንደምንመረምር...',
      verificationSuccess: 'ኢሜይል በተሳክቷ መመዝገቢያ! አሁን መግባት ትችላለህ።',
      verificationFailed: 'የኢሜይል መመዝገብ አልተሳካም። እባክህ እንደገና ሞክር ወይም አዲስ አገናኝ ጠይቅ።',
      returnToSignIn: 'ወደ መግባት መመለስ',
      returnToHome: 'ወደ መነሻ ገፅ ተመለስ',
      footer: '2025, ReactBd, Inc. ወይም ተባባሪዎቹ',
    },
  };

  const currentText = text[language];

  useEffect(() => {
    if (!hasVerified.current && token) {
      hasVerified.current = true;
      const verifyEmail = async () => {
        setMessage(currentText.verifying);
        try {
          await api.get('/auth/verify-email', { params: { token } });
          setMessage(currentText.verificationSuccess);
          setIsSuccess(true);
          setTimeout(() => navigate('/SignIn'), 5000);
        } catch (error) {
          setMessage(currentText.verificationFailed);
          setIsSuccess(false);
          setTimeout(() => navigate('/SignIn'), 5000);
        }
      };
      verifyEmail();
    }
  }, [token, navigate, currentText]);

  return (
    <div lang={language === 'EN' ? 'en' : 'am'} className="w-full">
      <div className="w-full bg-gray-100 pb-10 flex items-center justify-center min-h-screen">
        <div className="w-[350px] mx-auto flex flex-col items-center">
          {/* Return to Home Icon */}
          <div className="w-full flex justify-start mb-4">
            <Link to="/" title={currentText.returnToHome}>
              <div className="group cursor-pointer flex items-center gap-1 text-gray-600 hover:text-habesha_blue">
                <HomeIcon className="text-2xl" />
                <span className="text-sm group-hover:underline">{currentText.returnToHome}</span>
              </div>
            </Link>
          </div>

          <div className="w-full border border-zinc-200 p-6 text-center">
            <h2 className="font-titleFont text-2xl mb-4 text-habesha_blue">{message}</h2>
            {message && (
              <div className={`mb-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                {isSuccess ? <CheckCircleIcon className="text-xl" /> : <span>⚠</span>}
              </div>
            )}
            <p className="text-sm text-gray-600 mb-4">
              {isSuccess ? (
                <Link to="/SignIn" className="text-blue-600 hover:text-orange-700 hover:underline">
                  {currentText.returnToSignIn}
                </Link>
              ) : null}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-gradient-to-t from-white via-white to-zinc-200 flex flex-col gap-4 justify-center items-center py-10">
        <p className="text-xs text-gray-600">{currentText.footer}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;