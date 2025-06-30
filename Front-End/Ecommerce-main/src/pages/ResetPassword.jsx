import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '../componets/api/api';
import { useSelector } from 'react-redux';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errNewPassword, setErrNewPassword] = useState('');
  const [errConfirmPassword, setErrConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const language = useSelector((state) => state.habesha.language);

  const token = searchParams.get('token');

  const text = {
    EN: {
      resetPassword: 'Reset Password',
      newPassword: 'New Password',
      enterNewPassword: 'Enter your new password',
      passwordLength: 'Password must be at least 6 characters',
      confirmPassword: 'Confirm Password',
      enterConfirmPassword: 'Confirm your new password',
      passwordsMismatch: 'Passwords do not match',
      submit: 'Submit',
      returnToHome: 'Return to Home',
      resetSuccess: 'Password reset successful! You can now sign in.',
      resetFailed: 'Failed to reset password. Please try again.',
      invalidToken: 'Invalid or missing reset token. Please request a new reset link.',
      footer: '2025, ReactBd, Inc. or its affiliates',
    },
    AMH: {
      resetPassword: 'የይለፍ ቃል ዳግም አስጀምር',
      newPassword: 'አዲስ የይለፍ ቃል',
      enterNewPassword: 'አዲስ የይለፍ ቃልህን አስገባ',
      passwordLength: 'የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት',
      confirmPassword: 'የይለፍ ቃልን አረጋግጥ',
      enterConfirmPassword: 'አዲስ የይለፍ ቃልህን አረጋግጥ',
      passwordsMismatch: 'የይለፍ ቃላት አይዛመዱም',
      submit: 'አስገባ',
      returnToHome: 'ወደ መነሻ ገፅ ተመለስ',
      resetSuccess: 'የይለፍ ቃል ዳግም ማስጀመር ተሳክቷል! አሁን መግባት ትችላለህ።',
      resetFailed: 'የይለፍ ቃል ዳግም ማስጀመር አልተሳካም። እባክህ እንደገና ሞክር።',
      invalidToken: 'የተሳሳተ ወይም የማይገኝ ዳግም ማስጀመሪያ ማስመሰያ። እባክህ አዲስ ዳግም ማስጀመሪያ አገናኝ ጠይቅ።',
      footer: '2025, ReactBd, Inc. ወይም ተባባሪዎቹ',
    },
  };

  const currentText = text[language];

  useEffect(() => {
    if (!token) {
      setNotification({ message: currentText.invalidToken, type: 'error' });
      setTimeout(() => navigate('/SignIn'), 3000);
    }
  }, [token, navigate, currentText.invalidToken]);

  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
    setErrNewPassword('');
    if (confirmPassword && e.target.value !== confirmPassword) {
      setErrConfirmPassword(currentText.passwordsMismatch);
    } else {
      setErrConfirmPassword('');
    }
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setErrConfirmPassword(e.target.value !== newPassword ? currentText.passwordsMismatch : '');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!token) {
      setNotification({ message: currentText.invalidToken, type: 'error' });
      setTimeout(() => navigate('/SignIn'), 3000);
      return;
    }

    if (!newPassword) {
      setErrNewPassword(currentText.enterNewPassword);
      return;
    } else if (newPassword.length < 6) {
      setErrNewPassword(currentText.passwordLength);
      return;
    }

    if (!confirmPassword) {
      setErrConfirmPassword(currentText.enterConfirmPassword);
      return;
    } else if (newPassword !== confirmPassword) {
      setErrConfirmPassword(currentText.passwordsMismatch);
      return;
    }

    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setNotification({ message: currentText.resetSuccess, type: 'success' });
      setTimeout(() => navigate('/SignIn'), 3000);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const msg = error.response?.data?.message || currentText.resetFailed;
      setNotification({ message: msg, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div lang={language === 'EN' ? 'en' : 'am'} className="w-full">
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className={`bg-white border-l-4 ${notification.type === 'success' ? 'border-green-500' : 'border-red-500'} shadow-2xl rounded-lg p-4 max-w-sm mx-auto`}>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <CheckCircleIcon className="text-green-500 text-xl" />
                ) : (
                  <span className="text-red-500 text-xl">⚠</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-habesha_blue">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <CloseIcon className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full bg-gray-100 pb-10">
        <form className="w-[350px] mx-auto flex flex-col items-center">
          {/* Return to Home Icon */}
          <div className="w-full flex justify-start mb-4">
            <Link to="/" title={currentText.returnToHome}>
              <div className="group cursor-pointer flex items-center gap-1 text-gray-600 hover:text-habesha_blue">
                <HomeIcon className="text-2xl" />
                <span className="text-sm group-hover:underline">{currentText.returnToHome}</span>
              </div>
            </Link>
          </div>

          <div className="w-full border border-zinc-200 p-6">
            <h2 className="font-titleFont text-3xl mb-4">{currentText.resetPassword}</h2>
            <div className="flex flex-col gap-3">
              {/* New Password */}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium pb-2">{currentText.newPassword}</p>
                <div className="relative">
                  <input
                    onChange={handleNewPassword}
                    value={newPassword}
                    className="w-full py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#e77600] focus-within:shadow-habeshaInput duration-100 pr-10"
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-habesha_blue"
                  >
                    {showPassword ? <VisibilityOff className="text-lg" /> : <Visibility className="text-lg" />}
                  </button>
                </div>
                {errNewPassword && (
                  <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                    <span className="italic font-titleFont font-semibold text-base">!</span>
                    {errNewPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium pb-2">{currentText.confirmPassword}</p>
                <input
                  onChange={handleConfirmPassword}
                  value={confirmPassword}
                  className="w-full py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#e77600] focus-within:shadow-habeshaInput duration-100"
                  type="password"
                />
                {errConfirmPassword && (
                  <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                    <span className="italic font-titleFont font-semibold text-base">!</span>
                    {errConfirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleResetPassword}
                className="w-full py-1.5 text-sm font-normal rounded-sm bg-gradient-to-t from-[#f7dfa5] to-[#f0c14b] hover:bg-gradient-to-b border border-zinc-400 active:border-yellow-800 active:shadow-habeshaInput"
              >
                {currentText.submit}
              </button>
            </div>

            <p className="text-xs text-black leading-4 mt-4">
              {language === 'EN' ? 'Return to' : 'ወደ'}{' '}
              <Link to="/SignIn" className="text-blue-600 hover:text-orange-700 hover:underline">
                {currentText.signIn}
              </Link>.
            </p>
          </div>
        </form>
      </div>

      <div className="w-full bg-gradient-to-t from-white via-white to-zinc-200 flex flex-col gap-4 justify-center items-center py-10">
        <p className="text-xs text-gray-600">{currentText.footer}</p>
      </div>
    </div>
  );
};

export default ResetPassword;