import React, { useState } from 'react';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import HomeIcon from '@mui/icons-material/Home';
import GoogleIcon from '@mui/icons-material/Google';
import { Link, useNavigate } from 'react-router-dom';
import HabeshaLogo from '../assets/images/HabeshaLogo.jpeg';
import api from '../componets/api/api';
import { useSelector } from 'react-redux';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");

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

  const emailValidation = (email) => {
    return String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  // ...existing code...
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
    } else if (password.length < 3) {
      setErrPassword(currentText.passwordLength);
      isValid = false;
    }

    if (!isValid) return;

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // Store JWT token in localStorage
      localStorage.setItem('token', response.data.token);

      alert(response.data.message || 'Login successful');
      setEmail('');
      setPassword('');

      // Redirect based on role
      if (response.data.Role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      setErrEmail(msg);
    }
  };
// ...existing code...

  const handleGoogleSignIn = () => {
    alert('Google Sign-In functionality will be implemented later.');
  };

  return (
    <div lang={language === 'EN' ? 'en' : 'am'} className="w-full">
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
                className="w-full py-1.5 text-sm font-normal rounded-sm bg-gradient-to-t from-[#f7dfa5] to [#f0c14b] hover:bg-gradient-to-b border border-zinc-400 active:border-yellow-800 active:shadow-habeshaInput flex items-center justify-center gap-2"
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
            <p className="text-xm text-gray-600 mt-4 cursor-pointer group">
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