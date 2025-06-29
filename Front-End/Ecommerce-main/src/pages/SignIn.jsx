import React, { useState } from 'react';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import HomeIcon from '@mui/icons-material/Home';
import GoogleIcon from '@mui/icons-material/Google';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import HabeshaLogo from '../assets/images/HabeshaLogo.jpeg';
import api from '../componets/api/api';
import { useSelector } from 'react-redux';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errEmail, setErrEmail] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [errResetEmail, setErrResetEmail] = useState('');

  const navigate = useNavigate();
  const language = useSelector((state) => state.habesha.language);

  const text = {
    EN: {
      signIn: 'Sign In',
      email: 'Email',
      enterEmail: 'Enter Your Email',
      enterValidEmail: 'Enter valid email',
      password: 'Password',
      enterPassword: 'Enter your password',
      passwordLength: 'Password must be at least 6 characters',
      continue: 'Continue',
      continueWithGoogle: 'Continue with Google',
      agreement: "By continuing, you agree to Habesha's",
      conditionsOfUse: 'Conditions of Use',
      privacyNotice: 'Privacy Notice',
      needHelp: 'Need Help?',
      newToHabesha: 'New to Habesha?',
      createAccount: 'Create Your Account',
      help: 'Help',
      footer: '2025, ReactBd, Inc. or its affiliates',
      returnToHome: 'Return to Home',
      loginSuccess: 'Login successful!',
      loginFailed: 'Login failed',
      adminPrompt: 'Welcome, Admin! Where would you like to go?',
      adminDashboard: 'Admin Dashboard',
      userHome: 'User Home Page',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      resetEmailPrompt: 'Enter your email to receive a password reset link',
      resetSuccess: 'Password reset link sent! Check your email.',
      resetFailed: 'Failed to send reset link. Please try again.',
    },
    AMH: {
      signIn: 'ግባ',
      email: 'ኢሜይል',
      enterEmail: 'ኢሜይልህን አስገባ',
      enterValidEmail: 'ትክክለኛ ኢሜይል አስገባ',
      password: 'የይለፍ ቃል',
      enterPassword: 'የይለፍ ቃልህን አስገባ',
      passwordLength: 'የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት',
      continue: 'ቀጥል',
      continueWithGoogle: 'በጎግል ቀጥል',
      agreement: 'በመቀጠል፣ የሀበሻ የአጠቃቀም ሁኔታዎችን እና',
      conditionsOfUse: 'የአጠቃቀም ሁኔታዎች',
      privacyNotice: 'የግላዊነት ማስታወቂያ',
      needHelp: 'እገዛ ይፈልጋሉ?',
      newToHabesha: 'ለሀበሻ አዲስ ነዎት?',
      createAccount: 'መለያህን ፍጠር',
      help: 'እገዛ',
      footer: '2025, ReactBd, Inc. ወይም ተባባሪዎቹ',
      returnToHome: 'ወደ መነሻ ገፅ ተመለስ',
      loginSuccess: 'መግባት ተሳክቷል!',
      loginFailed: 'መግባት አልተሳካም',
      adminPrompt: 'እንኳን ደህና መጡ፣ አስተዳዳሪ! ወዴት መሄድ ይፈልጋሉ?',
      adminDashboard: 'የአስተዳዳሪ መቆጣጠሪያ ሰሌዳ',
      userHome: 'የተጠቃሚ መነሻ ገፅ',
      forgotPassword: 'የይለፍ ቃል ረሳኽው?',
      resetPassword: 'የይለፍ ቃል ዳግም አስጀምር',
      resetEmailPrompt: 'የይለፍ ቃል ዳግም ማስጀመሪያ አገናኝ ለመቀበል ኢሜይልህን አስገባ',
      resetSuccess: 'የይለፍ ቃል ዳግም ማስጀመሪያ አገናኝ ተልኳል! ኢሜይልህን ፈትሽ።',
      resetFailed: 'ዳግም ማስጀመሪያ አገናኝ መላክ አልተሳካም። እባክህ እንደገና ሞክር።',
    },
  };

  const currentText = text[language];

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail('');
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword('');
  };

  const handleResetEmail = (e) => {
    setResetEmail(e.target.value);
    setErrResetEmail('');
  };

  const emailValidation = (email) => {
    return String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (!email) {
      setErrEmail(currentText.enterEmail);
      isValid = false;
    } else if (!emailValidation(email)) {
      setErrEmail(currentText.enterValidEmail);
      isValid = false;
    }

    if (!password) {
      setErrPassword(currentText.enterPassword);
      isValid = false;
    } else if (password.length < 6) {
      setErrPassword(currentText.passwordLength);
      isValid = false;
    }

    if (!isValid) return;

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);

      setNotification({ message: currentText.loginSuccess, type: 'success' });
      setTimeout(() => setNotification(null), 3000);

      setEmail('');
      setPassword('');

      if (response.data.Role === 'ADMIN') {
        setShowAdminPrompt(true);
      } else {
        navigate('/');
      }
    } catch (error) {
      const msg = error.response?.data?.message || currentText.loginFailed;
      setNotification({ message: msg, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleGoogleSignIn = () => {
    setNotification({ message: 'Google Sign-In functionality will be implemented later.', type: 'info' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      setErrResetEmail(currentText.enterEmail);
      return;
    } else if (!emailValidation(resetEmail)) {
      setErrResetEmail(currentText.enterValidEmail);
      return;
    }

    try {
      await api.post('/auth/forgot-password', { email: resetEmail });
      setNotification({ message: currentText.resetSuccess, type: 'success' });
      setShowForgotPassword(false);
      setResetEmail('');
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      const msg = error.response?.data?.message || currentText.resetFailed;
      setNotification({ message: msg, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleAdminChoice = (destination) => {
    setShowAdminPrompt(false);
    navigate(destination);
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

      {/* Admin Prompt Modal */}
      {showAdminPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-habesha_blue">{currentText.adminPrompt}</h2>
              <button
                onClick={() => setShowAdminPrompt(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseIcon className="text-sm" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleAdminChoice('/admin')}
                className="w-full py-2 bg-habesha_blue text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                {currentText.adminDashboard}
              </button>
              <button
                onClick={() => handleAdminChoice('/')}
                className="w-full py-2 bg-habesha_yellow text-habesha_blue rounded-md hover:bg-yellow-500 transition-colors font-medium"
              >
                {currentText.userHome}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-habesha_blue">{currentText.resetPassword}</h2>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseIcon className="text-sm" />
              </button>
            </div>
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium pb-2">{currentText.resetEmailPrompt}</p>
                <input
                  onChange={handleResetEmail}
                  value={resetEmail}
                  className="w-full lowercase py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#e77600] focus-within:shadow-habeshaInput duration-100"
                  type="email"
                />
                {errResetEmail && (
                  <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                    <span className="italic font-titleFont font-semibold text-base">!</span>
                    {errResetEmail}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-1.5 text-sm font-normal rounded-sm bg-gradient-to-t from-[#f7dfa5] to-[#f0c14b] hover:bg-gradient-to-b border border-zinc-400 active:border-yellow-800 active:shadow-habeshaInput"
              >
                {currentText.continue}
              </button>
            </form>
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

          <img className="w-46 py-4 rounded-t-md" src={HabeshaLogo} alt="logo" />
          <div className="w-full border border-zinc-200 p-6">
            <h2 className="font-titleFont text-3xl mb-4">{currentText.signIn}</h2>
            <div className="flex flex-col gap-3">
              {/* Email */}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium pb-2">{currentText.email}</p>
                <input
                  onChange={handleEmail}
                  value={email}
                  className="w-full lowercase py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#e77600] focus-within:shadow-habeshaInput duration-100"
                  type="email"
                />
                {errEmail && (
                  <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                    <span className="italic font-titleFont font-semibold text-base">!</span>
                    {errEmail}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium pb-2">{currentText.password}</p>
                <input
                  onChange={handlePassword}
                  value={password}
                  className="w-full py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#e77600] focus-within:shadow-habeshaInput duration-100"
                  type="password"
                />
                {errPassword && (
                  <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                    <span className="italic font-titleFont font-semibold text-base">!</span>
                    {errPassword}
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-2 cursor-pointer group">
                  <ArrowRightIcon />
                  <span
                    onClick={() => setShowForgotPassword(true)}
                    className="text-blue-600 group-hover:text-orange-700 group-hover:underline underline-offset-1"
                  >
                    {currentText.forgotPassword}
                  </span>
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSignIn}
                className="w-full py-1.5 text-sm font-normal rounded-sm bg-gradient-to-t from-[#f7dfa5] to-[#f0c14b] hover:bg-gradient-to-b border border-zinc-400 active:border-yellow-800 active:shadow-habeshaInput"
              >
                {currentText.continue}
              </button>

              {/* Google Sign-In Button */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full py-1.5 text-sm font-normal rounded-sm bg-gradient-to-t from-[#f7dfa5] to-[#f0c14b] hover:bg-gradient-to-b border border-zinc-400 active:border-yellow-800 active:shadow-habeshaInput flex items-center justify-center gap-2"
              >
                <GoogleIcon className="text-base" />
                {currentText.continueWithGoogle}
              </button>
            </div>

            <p className="text-xs text-black leading-4 mt-4">
              {currentText.agreement}{' '}
              <span className="text-blue-600">{currentText.conditionsOfUse}</span>{' '}
              {language === 'EN' ? 'and' : 'እና'}{' '}
              <span className="text-blue-600">{currentText.privacyNotice}</span>.
            </p>
            <p className="text-xs text-gray-600 mt-4 cursor-pointer group">
              <ArrowRightIcon />
              <span className="text-blue-600 group-hover:text-orange-700 group-hover:underline underline-offset-1">
                {currentText.needHelp}
              </span>
            </p>
          </div>

          <p className="w-full text-xs text-gray-600 mt-4 flex items-center">
            <span className="w-1/3 h-[1px] bg-zinc-400 inline-flex"></span>
            <span className="w-1/3 text-center">{currentText.newToHabesha}</span>
            <span className="w-1/3 h-[1px] bg-zinc-400 inline-flex"></span>
          </p>

          <Link className="w-full" to="/Registration">
            <button className="w-full py-1.5 mt-4 text-sm font-normal rounded-sm bg-gradient-to-t from-slate-200 to-slate-100 hover:bg-gradient-to-b border border-zinc-400 active:border-yellow-800 active:shadow-habeshaInput">
              {currentText.createAccount}
            </button>
          </Link>
        </form>
      </div>

      <div className="w-full bg-gradient-to-t from-white via-white to-zinc-200 flex flex-col gap-4 justify-center items-center py-10">
        <div className="flex items-center gap-6">
          <p className="text-xs text-blue-600 hover:text-orange-600 hover:underline cursor-pointer">
            {currentText.conditionsOfUse}
          </p>
          <p className="text-xs text-blue-600 hover:text-orange-600 hover:underline cursor-pointer">
            {currentText.privacyNotice}
          </p>
          <p className="text-xs text-blue-600 hover:text-orange-600 hover:underline cursor-pointer">
            {currentText.help}
          </p>
        </div>
        <p className="text-xs text-gray-600">{currentText.footer}</p>
      </div>
    </div>
  );
};

export default SignIn;