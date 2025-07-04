import React, { useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import HomeIcon from '@mui/icons-material/Home';
import GoogleIcon from '@mui/icons-material/Google';
import { Link, useNavigate } from 'react-router-dom';
import HabeshaLogo from '../assets/images/HabeshaLogo.jpeg';
import api from '../componets/api/api';
import { useSelector } from 'react-redux';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const Registration = () => {
  const [errFirstName, setErrFirstName] = useState("");
  const [errLastName, setErrLastName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPhoneNumber, setErrPhoneNumber] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errCPassword, setErrCPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const language = useSelector((state) => state.habesha.language);
  const navigate = useNavigate();

  const text = {
    EN: {
      createAccount: 'Create Account',
      firstName: 'First Name',
      enterFirstName: 'Enter your first name',
      lastName: 'Last Name',
      enterLastName: 'Enter your last name',
      emailOrPhone: 'Email',
      enterYourEmail: 'Enter your email',
      enterValidEmail: 'Enter valid email',
      phoneNumber: 'Phone Number',
      enterPhoneNumber: 'Enter your phone number',
      enterValidPhoneNumber: 'Enter valid phone number (e.g., 1234567890)',
      password: 'Password',
      enterPassword: 'Enter your password',
      passwordLength: 'Password must be at least 6 characters',
      reEnterPassword: 'Re-enter Password',
      confirmPassword: 'Confirm your password',
      passwordsDontMatch: "Passwords don't match",
      passwordHint: 'Password must be at least 6 characters',
      continue: 'Continue',
      continueWithGoogle: 'Continue with Google',
      agreement: "By Creating, you agree to Habesha's",
      conditionsOfUse: 'Conditions of Use',
      privacyNotice: 'Privacy Notice',
      alreadyHaveAccount: 'Already have an account?',
      signIn: 'Sign in',
      help: 'Help',
      footer: '2025, ReactBd, Inc. or its affiliates',
      returnToHome: 'Return to Home',
      registrationSuccess: 'Registration successful! Please check your email to verify your account.',
      registrationFailed: 'Registration failed. Please try again.',
    },
    AMH: {
      createAccount: 'መለያ ፍጠር',
      firstName: 'የመጀመሪያ ስም',
      enterFirstName: 'የመጀመሪያ ስምህን አስገባ',
      lastName: 'የአባት ስም',
      enterLastName: 'የአባት ስምህን አስገባ',
      emailOrPhone: 'ኢሜይል',
      enterYourEmail: 'ኢሜይልህን አስገባ',
      enterValidEmail: 'ትክክለኛ ኢሜይል አስገባ',
      phoneNumber: 'የስልክ ቁጥር',
      enterPhoneNumber: 'የስልክ ቁጥርህን አስገባ',
      enterValidPhoneNumber: 'ትክክለኛ የስልክ ቁጥር አስገባ (ለምሳሌ፣ 1234567890)',
      password: 'የይለፍ ቃል',
      enterPassword: 'የይለፍ ቃልህን አስገባ',
      passwordLength: 'የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት',
      reEnterPassword: 'የይለፍ ቃል እንደገና አስገባ',
      confirmPassword: 'የይለፍ ቃልህን አረጋግጥ',
      passwordsDontMatch: 'የይለፍ ቃሎች አይዛመዱም',
      passwordHint: 'የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት',
      continue: 'ቀጥል',
      continueWithGoogle: 'በጎግል ቀጥል',
      agreement: 'በመፍጠር፣ የሀበሻ የአጠቃቀም ሁኔታዎችን እና',
      conditionsOfUse: 'የአጠቃቀም ሁኔታዎች',
      privacyNotice: 'የግላዊነት ማስታወቂያ',
      alreadyHaveAccount: 'መለያ አለህ?',
      signIn: 'ግባ',
      help: 'እገዛ',
      footer: '2025, ReactBd, Inc. ወይም ተባባሪዎቹ',
      returnToHome: 'ወደ መነሻ ገፅ ተመለስ',
      registrationSuccess: 'Registration successful! Please check your email to verify your account.',
      registrationFailed: 'Registration failed. Please try again.',
    },
  };

  const currentText = text[language];

  const handleFirstName = (e) => {
    setFirstName(e.target.value);
    setErrFirstName('');
  };

  const handleLastName = (e) => {
    setLastName(e.target.value);
    setErrLastName('');
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail('');
  };

  const handlePhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
    setErrPhoneNumber('');
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword('');
  };

  const handleCPassword = (e) => {
    setCPassword(e.target.value);
    setErrCPassword('');
  };

  const emailValidation = (email) => {
    return String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const phoneValidation = (phone) => {
    return String(phone).match(/^\d{10}$/);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (!firstName) setErrFirstName(currentText.enterFirstName);
    if (!lastName) setErrLastName(currentText.enterLastName);
    if (!email) setErrEmail(currentText.enterYourEmail);
    else if (!emailValidation(email)) setErrEmail(currentText.enterValidEmail);
    if (!phoneNumber) setErrPhoneNumber(currentText.enterPhoneNumber);
    else if (!phoneValidation(phoneNumber)) setErrPhoneNumber(currentText.enterValidPhoneNumber);
    if (!password) setErrPassword(currentText.enterPassword);
    else if (password.length < 6) setErrPassword(currentText.passwordLength);
    if (!cPassword) setErrCPassword(currentText.confirmPassword);
    else if (password !== cPassword) setErrCPassword(currentText.passwordsDontMatch);

    const isValid =
      firstName &&
      lastName &&
      emailValidation(email) &&
      phoneValidation(phoneNumber) &&
      password.length >= 6 &&
      password === cPassword;

    if (!isValid) return;

    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        role: 'USER',
        usersInfo: {
          firstName,
          lastName,
          phoneNumber,
          isAccountNonExpired: true,
          isAccountNonLocked: true,
          isCredentialsNonExpired: true,
          isEnabled: true,
        },
      });

      setMessage({ text: response.data.message || currentText.registrationSuccess, type: 'success' });
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setCPassword('');
    } catch (error) {
      const msg = error.response?.data?.message || currentText.registrationFailed;
      setMessage({ text: msg, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    alert('Google Sign-In functionality will be implemented later.');
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  return (
    <div lang={language === 'EN' ? 'en' : 'am'} className="w-full">
      {/* Notification */}
      {message && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className={`bg-white border-l-4 ${message.type === 'success' ? 'border-green-500' : 'border-red-500'} shadow-2xl rounded-lg p-4 max-w-sm mx-auto`}>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {message.type === 'success' ? (
                  <CheckCircleIcon className="text-green-500 text-xl" />
                ) : (
                  <span className="text-red-500 text-xl">⚠</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-habesha_blue">{message.text}</p>
              </div>
              <button
                onClick={handleCloseMessage}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <CloseIcon className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Loader */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
            <span className="animate-spin h-6 w-6 border-4 border-t-transparent border-habesha_blue rounded-full"></span>
            <p className="text-lg text-habesha_blue">Processing...</p>
          </div>
        </div>
      )}

      <div className="w-full bg-gray-100 pb-10">
        <form className="w-[370px] mx-auto flex flex-col items-center">
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
            <h2 className="font-titleFont text-3xl font-medium mb-4">{currentText.createAccount}</h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">{currentText.firstName}</p>
                <input
                  value={firstName}
                  onChange={handleFirstName}
                  className="w-full py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#e77600] focus-within:shadow-habeshaInput duration-100"
                  type="text"
                />
                {errFirstName && (
                  <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                    <span className="italic font-titleFont font-semibold text-base">!</span>
                    {errFirstName}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">{currentText.lastName}</p>
                <input
                  value={lastName}
                  onChange={handleLastName}
                  className="w-full py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#e77600] focus-within:shadow-habeshaInput duration-100"
                  type="text"
                />
                {errLastName && (
                  <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                    <span className="italic font-titleFont font-semibold text-base">!</span>
                    {errLastName}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">{currentText.emailOrPhone}</p>
                <input
                  value={email}
                  onChange={handleEmail}
                  className="w-full py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#e77600] focus-within:shadow-habeshaInput duration-100"
                  type="email"
                />
                {errEmail && (
                  <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                    <span className="italic font-titleFont font-semibold text-base">!</span>
                    {errEmail}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">{currentText.phoneNumber}</p>
                <input
                  value={phoneNumber}
                  onChange={handlePhoneNumber}
                  className="w-full py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#e77600] focus-within:shadow-habeshaInput duration-100"
                  type="tel"
                />
                {errPhoneNumber && (
                  <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                    <span className="italic font-titleFont font-semibold text-base">!</span>
                    {errPhoneNumber}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">{currentText.password}</p>
                <div className="relative">
                  <input
                    value={password}
                    onChange={handlePassword}
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
                {errPassword && (
                  <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                    <span className="italic font-titleFont font-semibold text-base">!</span>
                    {errPassword}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">{currentText.reEnterPassword}</p>
                <input
                  value={cPassword}
                  onChange={handleCPassword}
                  className="w-full py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#e77600] focus-within:shadow-habeshaInput duration-100"
                  type="password"
                />
                {errCPassword && (
                  <p className="text-red-600 text-xs font-semibold tracking-wide flex items-center gap-2 -mt-1.5">
                    <span className="italic font-titleFont font-semibold text-base">!</span>
                    {errCPassword}
                  </p>
                )}
                {errEmail ? (
                  <></>
                ) : (
                  <p className="text-xs text-gray-600">{currentText.passwordHint}</p>
                )}
              </div>
              <button
                onClick={handleRegistration}
                className="w-full py-1.5 text-sm font-normal rounded-sm bg-gradient-to-t from-[#f7dfa5] to-[#f0c14b] hover:bg-gradient-to-b border border-zinc-400 active:border-yellow-800 active:shadow-habeshaInput"
                disabled={isLoading}
              >
                {currentText.continue}
              </button>
              {/* <button
                onClick={handleGoogleSignIn}
                className="w-full py-1.5 text-sm font-normal rounded-sm bg-gradient-to-t from-[#f7dfa5] to-[#f0c14b] hover:bg-gradient-to-b border border-zinc-400 active:border-yellow-800 active:shadow-habeshaInput flex items-center justify-center gap-2"
              >
                <GoogleIcon className="text-base" />
                {currentText.continueWithGoogle}
              </button> */}
            </div>
            <p className="text-xs text-black leading-4 mt-4">
              {currentText.agreement}{' '}
              <span className="text-blue-600">{currentText.conditionsOfUse}</span>{' '}
              {language === 'EN' ? 'and' : 'እና'}{' '}
              <span className="text-blue-600">{currentText.privacyNotice}</span>.
            </p>
            <div className="text-xs text-black">
              <p className="mt-1">
                {currentText.alreadyHaveAccount}{' '}
                <Link to="/SignIn">
                  <span className="text-xs text-blue-600 hover:text-orange-600 hover:underline underline-offset-1 cursor-pointer duration-100">
                    {currentText.signIn} <ArrowRightIcon />
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
      <div className="w-full bg-gradient-to-t from-white via-white to-zinc-200 flex flex-col gap-4 justify-center items-center py-10">
        <div className="flex items-center gap-6">
          <p className="text-xs text-blue-600 hover:text-orange-600 hover:underline cursor-pointer duration-100">
            {currentText.conditionsOfUse}
          </p>
          <p className="text-xs text-blue-600 hover:text-orange-600 hover:underline cursor-pointer duration-100">
            {currentText.privacyNotice}
          </p>
          <p className="text-xs text-blue-600 hover:text-orange-600 hover:underline cursor-pointer duration-100">
            {currentText.help}
          </p>
        </div>
        <p className="text-xs text-gray-600">{currentText.footer}</p>
      </div>
    </div>
  );
};

export default Registration;