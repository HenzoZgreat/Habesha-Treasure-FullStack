import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import DeleteIcon from "@mui/icons-material/Delete"
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CloseIcon from "@mui/icons-material/Close"
import userProductService from "../../service/userProductService"
import CartService from "../../service/CartService"
import { addToCart } from "../../redux/HabeshaSlice"
import UserSettingsService from "../../service/UserSettingsService"

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [removingId, setRemovingId] = useState(null)
  const [notification, setNotification] = useState(null)
  const language = useSelector((state) => state.habesha.language)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [exchangeRate, setExchangeRate] = useState(150); // Default value

  const text = {
    EN: {
      title: "Your Favorites",
      subtitle: "Items you've saved for later",
      empty: "No favorites yet",
      emptyDesc: "Start adding items to your favorites to see them here",
      continueShopping: "Continue Shopping",
      addToCart: "Add to Cart",
      removeFromFavorites: "Remove from Favorites",
      outOfStock: "Out of Stock",
      reviews: "reviews",
      loading: "Loading your favorites...",
      error: "Failed to load favorites",
      retry: "Try Again",
      backToProducts: "Back to Products",
      notLoggedIn: "Please sign in to view your favorites",
      signIn: "Sign In",
      itemAdded: "Item added to cart!",
      addToCartFailed: "Failed to add item to cart",
      loginToAddToCart: "Please sign in to add this item to cart.",
    },
    AMH: {
      title: "የእርስዎ ተወዳጆች",
      subtitle: "ለኋላ የቀመጧቸው እቃዎች",
      empty: "ገና ተወዳጆች የሉም",
      emptyDesc: "እዚህ ለማየት ወደ ተወዳጆችዎ እቃዎችን መጨመር ይጀምሩ",
      continueShopping: "ግዢን ይቀጥሉ",
      addToCart: "ወደ ጋሪ ጨምር",
      removeFromFavorites: "ከተወዳጆች አስወግድ",
      outOfStock: "ከክምችት ውጭ",
      reviews: "ግምገማዎች",
      loading: "ተወዳጆችዎን በመጫን ላይ...",
      error: "ተወዳጆችን መጫን አልተሳካም",
      retry: "እንደገና ሞክር",
      backToProducts: "ወደ ምርቶች ተመለስ",
      notLoggedIn: "ተወዳጆችዎን ለማየት እባክዎ ይግቡ",
      signIn: "ይግቡ",
      itemAdded: "እቃ ወደ ጋሪ ታክሏል!",
      addToCartFailed: "እቃ ወደ ጋሪ መጨመር አልተሳካም",
      loginToAddToCart: "ይህን እቃ ወደ ጋሪ ለመጨመር እባክዎ ይግቡ።",
    },
  }

  const currentText = text[language]
  const USD_TO_ETB_RATE = 150

  const fetchFavorites = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) {
          setLoading(false)
          return
        }
        const response = await userProductService.getFavorites()
        setFavorites(Array.isArray(response.data) ? response.data : [])
        setLoading(false)
      } catch (error) {
        console.error("Error fetching favorites:", error)
        setError(error.response?.data?.message || currentText.error)
        setLoading(false)
      }
    }

  useEffect(() => {
    fetchFavorites();
    const fetchSettings = async () => {
      try {
        const response = await UserSettingsService.getSettings();
        setExchangeRate(response.data.storeInfo.exchangeRate || 150);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        setExchangeRate(150); // Fallback to default
      }
    };
    fetchSettings();
  }, [])

  const removeFromFavorites = async (productId) => {
    try {
      setRemovingId(productId)
      await userProductService.unfavorite(productId)
      setFavorites((prev) => prev.filter((item) => item.id !== productId))
      setRemovingId(null)
    } catch (error) {
      console.error("Error removing from favorites:", error)
      setError(error.response?.data?.message || "Failed to remove from favorites")
      setRemovingId(null)
      setTimeout(() => setError(null), 3000)
    }
  }

  const addToCartHandler = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({ message: currentText.loginToAddToCart, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const cartItem = {
      id: product.id,
      image: product.image,
      title: product.name,
      price: product.price,
      description: language === "AMH" ? product.descriptionAm : product.descriptionEn,
      category: product.category,
      quantity: 1,
    };

    try {
      await CartService.addToCart({ productId: product.id, quantity: 1 });
      dispatch(addToCart(cartItem));
      setNotification({ message: currentText.itemAdded, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setNotification({ message: currentText.addToCartFailed, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  }

  const formatPrice = (price) => {
    const value = language === "EN" ? price : price * exchangeRate
    return value.toLocaleString(language === "AMH" ? 'am-ET' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const renderStars = (rating) => {
    const stars = []
    const formattedRating = Math.round(rating * 10) / 10
    const fullStars = Math.floor(formattedRating)
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} className="text-yellow-400 text-xs sm:text-sm" />)
    }
    const emptyStars = 5 - fullStars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarBorderIcon key={`empty-${i}`} className="text-gray-300 text-xs sm:text-sm" />)
    }
    return { stars, formattedRating }
  }

  if (!localStorage.getItem("token")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-lg flex items-center justify-center">
            <FavoriteBorderIcon className="text-gray-400 text-2xl" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{currentText.notLoggedIn}</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            <button
              onClick={() => navigate("/SignIn")}
              className="bg-habesha_blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
            >
              {currentText.signIn}
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-habesha_yellow text-habesha_blue px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <ShoppingBagIcon className="text-sm" />
              {currentText.backToProducts}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-habesha_blue mx-auto mb-4"></div>
          <p className="text-habesha_blue font-medium text-sm sm:text-base">{currentText.loading}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <span className="text-red-600 text-lg">⚠</span>
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{error}</h2>
          <button
            onClick={() => {
              setError(null);
              fetchFavorites();
            }}
            className="bg-habesha_blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            {currentText.retry}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      {notification && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300 w-[90%] sm:w-auto">
          <div className={`bg-white border-l-4 ${notification.type === 'success' ? 'border-green-500' : 'border-red-500'} shadow-2xl rounded-lg p-3 sm:p-4 max-w-sm mx-auto`}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <CheckCircleIcon className="text-green-500 text-lg sm:text-xl" />
                ) : (
                  <span className="text-red-500 text-lg sm:text-xl">⚠</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-habesha_blue">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <CloseIcon className="text-xs sm:text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-habesha_blue hover:text-blue-700 transition-colors mb-2 sm:mb-4 text-sm sm:text-base"
          >
            <ArrowBackIcon className="text-xs sm:text-sm" />
            {currentText.backToProducts}
          </button>
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <FavoriteIcon className="text-habesha_yellow text-xl sm:text-2xl" />
            <h1 className="text-xl sm:text-2xl font-bold text-habesha_blue">{currentText.title}</h1>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm">{currentText.subtitle}</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-10 sm:py-16">
            <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-lg flex items-center justify-center">
              <FavoriteBorderIcon className="text-gray-400 text-2xl" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{currentText.empty}</h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 max-w-xs mx-auto">{currentText.emptyDesc}</p>
            <button
              onClick={() => navigate("/")}
              className="bg-habesha_blue text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 mx-auto text-sm sm:text-base"
            >
              <ShoppingBagIcon className="text-sm" />
              {currentText.continueShopping}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((product) => {
              const { stars, formattedRating } = renderStars(product.rate)
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex items-start w-full"
                >
                  <div className="relative w-28 sm:w-40 flex-shrink-0">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={language === "AMH" ? product.name : product.name}
                      className="w-full h-28 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    />
                    <button
                      onClick={() => removeFromFavorites(product.id)}
                      disabled={removingId === product.id}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 p-1.5 sm:p-2 rounded-full shadow-sm transition-all duration-200 hover:scale-110 disabled:opacity-50"
                    >
                      {removingId === product.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-red-500"></div>
                      ) : (
                        <DeleteIcon className="text-xs sm:text-sm" />
                      )}
                    </button>
                  </div>

                  <div className="p-3 sm:p-4 flex-grow">
                    <div className="mb-2">
                      <span className="text-xs text-habesha_blue bg-blue-50 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>

                    <h3
                      className="font-semibold text-sm sm:text-base text-gray-800 mb-2 line-clamp-2 hover:text-habesha_blue transition-colors cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {language === "AMH" ? product.name : product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-2 sm:mb-3">
                      <div className="flex">{stars}</div>
                      <span className="text-xs sm:text-sm text-gray-600">
                        {formattedRating} ({product.count} {currentText.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <span className="text-base sm:text-lg font-bold text-habesha_blue">
                        {language === "EN" ? "$" : "ETB "}{formatPrice(product.price)}
                      </span>
                    </div>

                    <div>
                      {product.stock > 0 ? (
                        <button
                          onClick={() => addToCartHandler(product)}
                          className="w-full bg-habesha_yellow hover:bg-yellow-500 text-habesha_blue font-semibold py-2 sm:py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          <ShoppingCartIcon className="text-xs sm:text-sm" />
                          {currentText.addToCart}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-200 text-gray-500 font-semibold py-2 sm:py-3 px-4 rounded-lg cursor-not-allowed text-sm sm:text-base"
                        >
                          {currentText.outOfStock}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoritesPage