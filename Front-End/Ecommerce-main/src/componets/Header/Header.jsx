"use client"

import { useState, useEffect } from "react"
import HeaderBottom from "./HeaderBottom"
import SearchIcon from "@mui/icons-material/Search"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import FavoriteIcon from "@mui/icons-material/Favorite"
import PersonIcon from "@mui/icons-material/Person"
import LogoutIcon from "@mui/icons-material/Logout"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import { allItems } from "../constant/headerItems"
import { useSelector, useDispatch } from "react-redux"
import { setLanguage, setCart } from "../../redux/HabeshaSlice"
import HabeshaLogo from "../../assets/images/HabeshaLogo.jpeg"
import { Link, useNavigate } from "react-router-dom"
import USA from "../../assets/images/USA.jpeg"
import Ethiopia from "../../assets/images/ET.jpeg"
import api from "../api/api"
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn"
import CartService from "../../service/CartService"

const Header = () => {
  const [showAll, setShowAll] = useState(false)
  const [searchItem, setSearchItem] = useState("")
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showAuthMessage, setShowAuthMessage] = useState(false)
  const [user, setUser] = useState(null)
  const products = useSelector((state) => state.habesha.cartProducts)
  const language = useSelector((state) => state.habesha.language)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      api
        .get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data)
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error)
          if (error.response && [401, 403].includes(error.response.status)) {
            localStorage.removeItem("token")
            setUser(null)
          }
        })

      CartService.getCart()
        .then((response) => {
          const cartItems = Array.isArray(response.data) ? response.data : [];
          dispatch(setCart(cartItems.map(item => ({
            id: item.productId,
            title: item.productName,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            description: '',
          }))))
        })
        .catch((error) => {
          console.error("Failed to fetch cart:", error)
        })
    }
  }, [dispatch])

  const handleSearch = () => {
    if (searchItem.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchItem.trim())}`)
      setShowAll(false)
      setShowMobileSearch(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("token")
    setUser(null)
    setShowAccountDropdown(false)
    setShowMobileMenu(false)
    navigate("/SignIn")
  }

  const handleFavoritesClick = (e) => {
    e.preventDefault()
    if (user) {
      navigate("/favorites")
    } else {
      setShowAuthMessage(true)
      setTimeout(() => setShowAuthMessage(false), 4000)
    }
    setShowMobileMenu(false)
  }

  const handleOrdersClick = (e) => {
    e.preventDefault()
    if (user) {
      navigate("/orders")
    } else {
      setShowAuthMessage(true)
      setTimeout(() => setShowAuthMessage(false), 4000)
    }
    setShowMobileMenu(false)
  }

  const text = {
    EN: {
      yourFavorites: "Your Favorites",
      signIn: "Hello, Sign In",
      accountList: "Account & List",
      returns: "Return",
      orders: "& Orders",
      cart: "Cart",
      all: "All",
      profile: "Profile",
      signOut: "Sign Out",
      authRequired: "Please sign in to view your favorites",
      signInNow: "Sign In Now",
      authRequiredOrders: "Please sign in to view your orders",
    },
    AMH: {
      yourFavorites: "የእርስዎ ተወዳጆች",
      signIn: "ሰላም፣ ግባ",
      accountList: "መለያ እና ዝርዝር",
      returns: "መመለስ",
      orders: "እና ትዕዛዞች",
      cart: "ጋሪ",
      all: "ሁሉም",
      profile: "መገለጫ",
      signOut: "ውጣ",
      authRequired: "ተወዳጆችዎን ለማየት እባክዎ ይግቡ",
      signInNow: "አሁን ግባ",
      authRequiredOrders: "ትዕዛዞችዎን ለማየት እባክዎ ይግቡ",
    },
  }

  const currentText = text[language]

  const languageOptions = [
    { code: "EN", flag: USA, label: "English" },
    { code: "AMH", flag: Ethiopia, label: "አማርኛ" },
  ]

  return (
    <div className="w-full sticky top-0 z-50">
      {showAuthMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] animate-in slide-in-from-top duration-300">
          <div className="bg-white border-l-4 border-habesha_yellow shadow-2xl rounded-lg p-4 max-w-sm mx-auto">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <FavoriteIcon className="text-habesha_yellow text-xl" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-habesha_blue mb-1">{currentText.authRequiredOrders}</p>
                <button
                  onClick={() => {
                    setShowAuthMessage(false)
                    navigate("/SignIn")
                  }}
                  className="text-xs font-semibold text-habesha_yellow hover:text-habesha_blue transition-colors"
                >
                  {currentText.signInNow} →
                </button>
              </div>
              <button
                onClick={() => setShowAuthMessage(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <CloseIcon className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full bg-habesha_blue text-white">
        <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <CloseIcon /> : <MenuIcon />}
          </button>

          <Link to="/" className="flex-shrink-0">
            <div className="headerHover">
              <img
                className="h-10 w-12 sm:h-12 sm:w-14 md:h-16 md:w-20 mx-auto rounded-md object-contain"
                src={HabeshaLogo || "/placeholder.svg"}
                alt="logo"
              />
            </div>
          </Link>

          <div className="h-8 sm:h-10 rounded-md hidden lg:flex flex-grow relative items-center max-w-2xl">
            <span
              onClick={() => setShowAll(!showAll)}
              className="h-full w-12 sm:w-14 bg-gray-200 hover:bg-gray-300 border-2 cursor-pointer duration-300 text-xs sm:text-sm text-habesha_blue font-titleFont flex items-center justify-center rounded-tl-md rounded-bl-md"
            >
              {currentText.all} <ArrowDropDownIcon className="text-sm" />
            </span>

            {showAll && (
              <div>
                <ul className="absolute h-50 w-56 top-8 sm:top-10 left-0 overflow-x-hidden bg-white border-[1px] border-habesha_blue text-black p-2 flex-col gap-1 z-50 rounded-md shadow-lg">
                  {allItems.map((item) => (
                    <li
                      onClick={() => {
                        setSearchItem(item.title[language])
                        setShowAll(false)
                      }}
                      key={item.id}
                      className="text-sm tracking-wide font-titleFont border-b-[1px] border-b-transparent hover:border-b-habesha_blue cursor-pointer duration-200 flex items-center gap-2 p-1"
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
              className="h-full text-sm sm:text-base text-habesha_blue flex-grow outline-none border-none px-2"
              placeholder="Search products..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch()
              }}
            />
            <span
              onClick={handleSearch}
              className="w-10 sm:w-12 h-full flex items-center justify-center bg-habesha_yellow hover:bg-[#f3a847] duration-300 text-habesha_blue cursor-pointer rounded-tr-md rounded-br-md"
            >
              <SearchIcon className="text-sm sm:text-base" />
            </span>
          </div>

          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-md transition-colors"
            aria-label="Search"
          >
            <SearchIcon />
          </button>

          <div className="flex items-center gap-1 sm:gap-3">
            <div className="relative flex items-center justify-center text-white text-xs sm:text-sm font-titleFont">
              <span
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-1 cursor-pointer p-1 sm:p-2 hover:bg-white/10 rounded-md transition-colors"
              >
                <img className="w-4 sm:w-6" src={language === "EN" ? USA : Ethiopia} alt={`${language} flag`} />
                <span className="hidden sm:inline">{language}</span>
                <ArrowDropDownIcon className="text-sm" />
              </span>

              {showLanguageDropdown && (
                <ul className="absolute top-8 sm:top-10 right-0 w-28 sm:w-32 bg-white border-[1px] border-habesha_blue text-black p-2 flex flex-col gap-1 z-50 rounded-md shadow-lg">
                  {languageOptions.map((lang) => (
                    <li
                      key={lang.code}
                      onClick={() => {
                        dispatch(setLanguage(lang.code))
                        setShowLanguageDropdown(false)
                      }}
                      className="text-xs sm:text-sm tracking-wide font-titleFont flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                    >
                      <img className="w-4 sm:w-6" src={lang.flag || "/placeholder.svg"} alt={`${lang.code} flag`} />
                      <span className="hidden sm:inline">{lang.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div onClick={handleFavoritesClick} className="hidden md:block cursor-pointer">
              <div className="headerHover flex items-center gap-1 p-2 hover:bg-white/10 rounded-md transition-colors">
                <FavoriteIcon className="text-sm sm:text-base" />
                <p className="text-xs sm:text-sm text-lightText font-light hidden lg:block">
                  {currentText.yourFavorites}
                </p>
              </div>
            </div>

            {user ? (
              <div
                className="relative flex flex-col items-start justify-center headerHover"
                onMouseEnter={() => setShowAccountDropdown(true)}
                onMouseLeave={() => setShowAccountDropdown(false)}
              >
                <div className="p-1 sm:p-2 hover:bg-white/10 rounded-md transition-colors cursor-pointer">
                  <p className="text-xs text-white font-light hidden lg:block">Hello, {user.firstName}</p>
                  <p className="text-xs sm:text-sm font-semibold -mt-1 text-whiteText flex items-center">
                    <PersonIcon className="lg:hidden" />
                    <span className="hidden lg:inline">{currentText.accountList}</span>
                    <ArrowDropDownIcon className="hidden lg:inline text-sm" />
                  </p>
                </div>
                {showAccountDropdown && (
                  <div
                    className="absolute top-12 sm:top-14 right-0 w-36 bg-habesha_blue text-white flex flex-col z-50 rounded-lg shadow-2xl transform transition-all duration-300 ease-in-out overflow-hidden"
                    style={{
                      transform: showAccountDropdown ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.95)",
                      opacity: showAccountDropdown ? 1 : 0,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <Link to="/profile">
                      <button className="w-full py-3 px-4 text-xs font-semibold bg-habesha_blue text-white hover:bg-habesha_yellow hover:text-habesha_blue flex items-center gap-2 transition-all duration-300 focus:outline-none group">
                        <PersonIcon className="text-current group-hover:scale-110 transition-transform duration-300 text-sm" />
                        <span className="font-medium">{currentText.profile}</span>
                      </button>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full py-3 px-4 text-xs font-semibold bg-habesha_blue text-white hover:bg-red-600 hover:text-white flex items-center gap-2 transition-all duration-300 focus:outline-none group"
                    >
                      <LogoutIcon className="text-current group-hover:scale-110 transition-transform duration-300 text-sm" />
                      <span className="font-medium">{currentText.signOut}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/SignIn">
                <div className="flex flex-col items-start justify-center headerHover p-1 sm:p-2 hover:bg-white/10 rounded-md transition-colors">
                  <p className="text-xs text-white font-light hidden lg:block">{currentText.signIn}</p>
                  <p className="text-xs sm:text-sm font-semibold -mt-1 text-whiteText flex items-center">
                    <PersonIcon className="lg:hidden" />
                    <span className="hidden lg:inline">{currentText.accountList}</span>
                    <ArrowDropDownIcon className="hidden lg:inline text-sm" />
                  </p>
                </div>
              </Link>
            )}

            <div
              onClick={handleOrdersClick}
              className="hidden xl:flex flex-col items-start justify-center headerHover p-2 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <AssignmentReturnIcon className="text-sm" />
                <div>
                  <p className="text-sm text-lightText font-light">{currentText.returns}</p>
                  <p className="text-sm font-semibold -mt-1 text-whiteText">{currentText.orders}</p>
                </div>
              </div>
            </div>

            <Link to="/cart" className="hidden lg:flex">
              <div className="flex items-center justify-center headerHover relative p-1 sm:p-2 hover:bg-white/10 rounded-md transition-colors">
                <ShoppingCartIcon className="text-lg sm:text-xl" />
                <p className="text-xs font-semibold ml-1 text-whiteText hidden sm:block">{currentText.cart}</p>
                <span className="absolute text-xs -top-1 -right-1 sm:top-0 sm:left-6 font-semibold px-1.5 py-0.5 h-5 w-5 bg-[#f3a847] text-habesha_blue rounded-full flex justify-center items-center">
                  {products.length > 0 ? products.length : 0}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {showMobileSearch && (
          <div className="lg:hidden px-3 pb-3">
            <div className="h-10 rounded-md flex relative items-center">
              <span
                onClick={() => setShowAll(!showAll)}
                className="h-full w-12 bg-gray-200 hover:bg-gray-300 cursor-pointer duration-300 text-xs text-habesha_blue font-titleFont flex items-center justify-center rounded-tl-md rounded-bl-md"
              >
                {currentText.all}
              </span>
              <input
                onChange={(e) => setSearchItem(e.target.value)}
                value={searchItem}
                type="text"
                className="h-full text-sm text-habesha_blue flex-grow outline-none border-none px-2"
                placeholder="Search products..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch()
                }}
                autoFocus
              />
              <span
                onClick={handleSearch}
                className="w-12 h-full flex items-center justify-center bg-habesha_yellow hover:bg-[#f3a847] duration-300 text-habesha_blue cursor-pointer rounded-tr-md rounded-br-md"
              >
                <SearchIcon />
              </span>
            </div>
          </div>
        )}

        {showMobileMenu && (
          <div className="lg:hidden bg-habesha_blue border-t border-white/10">
            <div className="px-3 py-4 space-y-3">
              <Link to="/cart" onClick={() => setShowMobileMenu(false)}>
                <div className="flex items-center justify-between p-3 hover:bg-white/10 rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    <ShoppingCartIcon />
                    <span className="text-sm font-medium">{currentText.cart}</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-[#f3a847] text-habesha_blue rounded-full">
                    {products.length > 0 ? products.length : 0}
                  </span>
                </div>
              </Link>

              <div onClick={handleFavoritesClick}>
                <div className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-md transition-colors cursor-pointer">
                  <FavoriteIcon />
                  <span className="text-sm font-medium">{currentText.yourFavorites}</span>
                </div>
              </div>

              <div onClick={handleOrdersClick}>
                <div className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-md transition-colors cursor-pointer">
                  <AssignmentReturnIcon />
                  <div>
                    <p className="text-sm font-medium">
                      {currentText.returns} {currentText.orders}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* <HeaderBottom /> */}
    </div>
  )
}

export default Header