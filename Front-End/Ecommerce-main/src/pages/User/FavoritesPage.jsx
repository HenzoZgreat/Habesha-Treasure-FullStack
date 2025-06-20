"use client"

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
import userProductService from "../../service/userProductService"
import { addToCart } from "../../redux/HabeshaSlice"

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [removingId, setRemovingId] = useState(null)
  const language = useSelector((state) => state.habesha.language)
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
      error: "ተወዳጆችን መጫን አልተቻለም",
      retry: "እንደገና ሞክር",
      backToProducts: "ወደ ምርቶች ተመለስ",
      notLoggedIn: "ተወዳጆችዎን ለማየት እባክዎ ይግቡ",
      signIn: "ይግቡ",
    },
  }

  const currentText = text[language]
  const USD_TO_ETB_RATE = 150

  useEffect(() => {
    fetchFavorites()
  }, [])

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

  const addToCartHandler = (product) => {
    dispatch(
      addToCart({
        id: product.id,
        image: product.image,
        title: product.name,
        price: product.price,
        description: language === "AMH" ? product.descriptionAm : product.descriptionEn,
        category: product.category,
        quantity: 1,
      })
    )
  }

  const formatPrice = (price) => {
    const value = language === "EN" ? price : price * USD_TO_ETB_RATE
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
      stars.push(<StarIcon key={i} className="text-yellow-400 text-sm" />)
    }
    const emptyStars = 5 - fullStars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarBorderIcon key={`empty-${i}`} className="text-gray-300 text-sm" />)
    }
    return { stars, formattedRating }
  }

  if (!localStorage.getItem("token")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-full p-6 w-24 h-24 mx-auto mb-6 shadow-lg flex items-center justify-center">
            <FavoriteBorderIcon className="text-gray-400 text-4xl" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{currentText.notLoggedIn}</h2>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/SignIn")}
              className="bg-habesha_blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {currentText.signIn}
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-habesha_yellow text-habesha_blue px-8 py-3 rounded-lg hover:bg-yellow-500 transition-colors font-medium flex items-center gap-2"
            >
              <ShoppingBagIcon />
              {currentText.backToProducts}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-habesha_blue mx-auto mb-4"></div>
          <p className="text-habesha_blue font-medium">{currentText.loading}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{error}</h2>
          <button
            onClick={fetchFavorites}
            className="bg-habesha_blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentText.retry}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-habesha_blue hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowBackIcon className="text-sm" />
            {currentText.backToProducts}
          </button>
          <div className="flex items-center gap-3 mb-2">
            <FavoriteIcon className="text-habesha_yellow text-3xl" />
            <h1 className="text-3xl font-bold text-habesha_blue">{currentText.title}</h1>
          </div>
          <p className="text-gray-600">{currentText.subtitle}</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-full p-6 w-24 h-24 mx-auto mb-6 shadow-lg flex items-center justify-center">
              <FavoriteBorderIcon className="text-gray-400 text-4xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{currentText.empty}</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{currentText.emptyDesc}</p>
            <button
              onClick={() => navigate("/")}
              className="bg-habesha_blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 mx-auto"
            >
              <ShoppingBagIcon />
              {currentText.continueShopping}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => {
              const { stars, formattedRating } = renderStars(product.rate)
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={language === "AMH" ? product.name : product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    />
                    <button
                      onClick={() => removeFromFavorites(product.id)}
                      disabled={removingId === product.id}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-500 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
                    >
                      {removingId === product.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                      ) : (
                        <DeleteIcon className="text-sm" />
                      )}
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-habesha_blue bg-blue-50 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>

                    <h3
                      className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-habesha_blue transition-colors cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {language === "AMH" ? product.name : product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">{stars}</div>
                      <span className="text-sm text-gray-600">
                        {formattedRating} ({product.count} {currentText.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-habesha_blue">
                        {language === "EN" ? "$" : "ETB "}{formatPrice(product.price)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {product.stock > 0 ? (
                        <button
                          onClick={() => addToCartHandler(product)}
                          className="w-full bg-habesha_yellow hover:bg-yellow-500 text-habesha_blue font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <ShoppingCartIcon className="text-sm" />
                          {currentText.addToCart}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-200 text-gray-500 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
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