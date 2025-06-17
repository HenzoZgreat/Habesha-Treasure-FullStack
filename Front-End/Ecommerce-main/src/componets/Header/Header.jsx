import React, { useState, useEffect } from 'react';
import HeaderBottom from './HeaderBottom';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { allItems } from '../constant/headerItems';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../../redux/HabeshaSlice';
import HabeshaLogo from '../../assets/images/HabeshaLogo.jpeg';
import { Link, useNavigate } from 'react-router-dom';
import USA from '../../assets/images/USA.jpeg';
import Ethiopia from '../../assets/images/ET.jpeg';
import api from '../api/api';

const Header = () => {
  const [showAll, setShowAll] = useState(false);
  const [searchItem, setSearchItem] = useState('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const products = useSelector((state) => state.habesha.cartProducts);
  const language = useSelector((state) => state.habesha.language);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Failed to fetch user:', error);
          if (error.response && [401, 403].includes(error.response.status)) {
            localStorage.removeItem('token');
            setUser(null);
          }
        });
    }
  }, []);

  const handleSearch = () => {
    if (searchItem.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchItem.trim())}`);
      setShowAll(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShowAccountDropdown(false);
    navigate('/SignIn');
  };

  const text = {
    EN: {
      yourFavorites: 'Your Favorites',
      signIn: 'Hello, Sign In',
      accountList: 'Account & List',
      returns: 'Return',
      orders: '& Orders',
      cart: 'Cart',
      all: 'All',
      profile: 'Profile',
      signOut: 'Sign Out',
    },
    AMH: {
      yourFavorites: 'የእርስዎ ተወዳጆች',
      signIn: 'ሰላም፣ ግባ',
      accountList: 'መለያ እና ዝርዝር',
      returns: 'መመለስ',
      orders: 'እና ትዕዛዞች',
      cart: 'ጋሪ',
      all: 'ሁሉም',
      profile: 'መገለጫ',
      signOut: 'ውጣ',
    },
  };

  const currentText = text[language];

  const languageOptions = [
    { code: 'EN', flag: USA, label: 'English' },
    { code: 'AMH', flag: Ethiopia, label: 'አማርኛ' },
  ];

  return (
    <div className="w-full sticky top-0 z-50">
      <div className="w-full bg-habesha_blue text-white px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/">
          <div className="headerHover">
            <h1 className="w-44 text-center">
              <img className="h-16 w-20 mx-auto rounded-md" src={HabeshaLogo} alt="logo" />
            </h1>
          </div>
        </Link>

        <Link to="/favorites">
          <div className="headerHover hidden md1:inline-flex items-center gap-1">
            <FavoriteIcon />
            <p className="text-sm text-lightText font-light flex flex-col">
              {currentText.yourFavorites}
            </p>
          </div>
        </Link>

        <div className="h-10 rounded-md hidden lg1:flex flex-grow relative items-center">
          <span
            onClick={() => setShowAll(!showAll)}
            className="h-full w-14 bg-gray-200 hover:bg-gray-300 border-2 cursor-pointer duration-300 text-sm text-habesha_blue font-titleFont flex items-center justify-center rounded-tl-md rounded-bl-md"
          >
            {currentText.all} <ArrowDropDownIcon />
          </span>

          {showAll && (
            <div>
              <ul className="absolute h-50 w-56 top-10 left-0 overflow-x-hidden bg-white border-[1px] border-habesha_blue text-black p-2 flex-col gap-1 z-50">
                {allItems.map((item) => (
                  <li
                    onClick={() => {
                      setSearchItem(item.title[language]);
                      setShowAll(false);
                    }}
                    key={item.id}
                    className="text-sm tracking-wide font-titleFont border-b-[1px] border-b-transparent hover:border-b-habesha_blue cursor-pointer duration-200 flex items-center gap-2"
                  >
                    {item.title[language]}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <input
            onChange={(e) => setSearchItem(e.target.value)}
            value={searchItem}
            type="text"
            className="h-full text-base text-habesha_blue flex-grow outline-none border-none px-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <span
            onClick={handleSearch}
            className="w-12 h-full flex items-center justify-center bg-habesha_yellow hover:bg-[#f3a847] duration-300 text-habesha_blue cursor-pointer rounded-tr-md rounded-br-md"
          >
            <SearchIcon />
          </span>
        </div>

        <div className="relative flex items-center justify-center text-white text-sm font-titleFont">
          <span
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-1 cursor-pointer"
          >
            <img className="w-6" src={language === 'EN' ? USA : Ethiopia} alt={`${language} flag`} />
            <span>{language}</span>
            <ArrowDropDownIcon />
          </span>

          {showLanguageDropdown && (
            <ul className="absolute top-8 w-32 bg-white border-[1px] border-habesha_blue text-black p-2 flex flex-col gap-1 z-50">
              {languageOptions.map((lang) => (
                <li
                  key={lang.code}
                  onClick={() => {
                    dispatch(setLanguage(lang.code));
                    setShowLanguageDropdown(false);
                  }}
                  className="text-sm tracking-wide font-titleFont flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1"
                >
                  <img className="w-6" src={lang.flag} alt={`${lang.code} flag`} />
                  {lang.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {user ? (
          <div
            className="relative flex flex-col items-start justify-center headerHover"
            onMouseEnter={() => setShowAccountDropdown(true)}
            onMouseLeave={() => setShowAccountDropdown(false)}
          >
            <p className="text-sm md1:text-xs text-white md1:text-lightText font-light">
              Hello, {user.firstName}
            </p>
            <p className="text-sm font-semibold -mt-1 text-whiteText hidden md1:inline-flex">
              {currentText.accountList} <ArrowDropDownIcon />
            </p>
            {showAccountDropdown && (
              <div className="absolute top-8 right-0 w-48 bg-white border-[1px] border-habesha_blue text-habesha_blue p-4 flex flex-col gap-3 z-50 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out sm:w-[calc(100vw-2rem)] sm:right-[-2rem] sm:max-w-xs"
                style={{ transform: showAccountDropdown ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)', opacity: showAccountDropdown ? 1 : 0 }}
              >
                <div className="flex justify-center mb-2">
                  <img className="h-10 w-10 rounded-full border-2 border-habesha_yellow" src={HabeshaLogo} alt="logo" />
                </div>
                <Link to="/profile">
                  <button className="w-full py-3 px-4 text-sm font-medium rounded-md bg-white hover:bg-habesha_yellow hover:text-habesha_blue border border-habesha_blue flex items-center gap-2 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-habesha_yellow">
                    <PersonIcon className="text-habesha_blue" />
                    {currentText.profile}
                  </button>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full py-3 px-4 text-sm font-medium rounded-md bg-white hover:bg-habesha_yellow hover:text-habesha_blue border border-habesha_blue flex items-center gap-2 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-habesha_yellow"
                >
                  <LogoutIcon className="text-habesha_blue" />
                  {currentText.signOut}
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/SignIn">
            <div className="flex flex-col items-start justify-center headerHover">
              <p className="text-sm md1:text-xs text-white md1:text-lightText font-light">{currentText.signIn}</p>
              <p className="text-sm font-semibold -mt-1 text-whiteText hidden md1:inline-flex">
                {currentText.accountList} <ArrowDropDownIcon />
              </p>
            </div>
          </Link>
        )}

        <div className="hidden lg1:flex flex-col items-start justify-center headerHover">
          <p className="text-sm text-lightText font-light">{currentText.returns}</p>
          <p className="text-sm font-semibold -mt-1 text-whiteText">{currentText.orders}</p>
        </div>

        <Link to="/cart">
          <div className="flex items-start justify-center headerHover relative">
            <ShoppingCartIcon />
            <p className="text-xs font-semibold mt-3 text-whiteText">
              {currentText.cart}{' '}
              <span className="absolute text-xs -top-1 left-6 font-semibold p-1 h-4 bg-[#f3a847] text-habesha_blue rounded-full flex justify-center items-center">
                {products.length > 0 ? products.length : 0}
              </span>
            </p>
          </div>
        </Link>
      </div>

      <HeaderBottom />
    </div>
  );
};

export default Header;