"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import SecurityIcon from "@mui/icons-material/Security"
import { addToCart } from "../../redux/HabeshaSlice"
import { v4 as uuidv4 } from "uuid"
import userProductService from "../../service/userProductService"
import ProductReviews from "../../componets/Home/ProductReviews"

const ProductDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const language = useSelector((state) => state.habesha.language)
  const cartProducts = useSelector((state) => state.habesha.cartProducts)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await userProductService.getProductById(id)
        setProduct(response.data)
        setIsFavorite(response.data.favorites > 0)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch product:", err)
        if (err.response && [401, 403].includes(err.response.status)) {
          localStorage.removeItem('token')
          navigate('/SignIn')
        } else {
          setError("Failed to load product details.")
        }
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, navigate])

  const text = {
    EN: {
      backToProducts: "Back to Products",
      addToCart: "Add to Cart",
      buyNow: "Buy Now",
      quantity: "Quantity",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      category: "Category",
      description: "Description",
      features: "Features",
      shipping: "Free Shipping",
      shippingDesc: "Free shipping on orders over $50",
      secure: "Secure Payment",
      secureDesc: "100% secure payment processing",
      rating: "Rating",
      reviews: "Reviews",
      share: "Share",
      relatedProducts: "Related Products",
    },
    AMH: {
      backToProducts: "ወደ ምርቶች ተመለስ",
      addToCart: "ወደ ጋሪ ጨምር",
      buyNow: "አሁን ግዛ",
      quantity: "ብዛት",
      inStock: "በመጋዘን አለ",
      outOfStock: "በመጋዘን የለም",
      category: "ምድብ",
      description: "መግለጫ",
      features: "ባህሪያት",
      shipping: "ነፃ መላኪያ",
      shippingDesc: "ከ$50 በላይ በሆኑ ትዕዛዞች ላይ ነፃ መላኪያ",
      secure: "ደህንነቱ የተጠበቀ ክፍያ",
      secureDesc: "100% ደህንነቱ የተጠበቀ የክፍያ ሂደት",
      rating: "ደረጃ",
      reviews: "ግምገማዎች",
      share: "አጋራ",
      relatedProducts: "ተዛማጅ ምርቶች",
    },
  }

  const currentText = text[language]
  const USD_TO_ETB_RATE = 150

  const getDisplayPrice = (price) => {
    return language === "EN" ? price : price * USD_TO_ETB_RATE
  }

  const handleAddToCart = () => {
    if (!product) return

    const itemId = product.id ?? uuidv4()
    dispatch(
      addToCart({
        id: itemId,
        image: product.image,
        title: product.name,
        price: product.price,
        description: language === "AMH" ? product.descriptionAm : product.descriptionEn,
        category: product.category,
        quantity: quantity,
      }),
    )
  }

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await userProductService.decrementFavorites(product.id)
        setIsFavorite(false)
      } else {
        await userProductService.incrementFavorites(product.id)
        setIsFavorite(true)
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err)
      if (err.response && [401, 403].includes(err.response.status)) {
        localStorage.removeItem('token')
        navigate('/SignIn')
      } else {
        alert(`Failed to update favorite: ${err.response?.data?.message || "Server error"}`)
      }
    }
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <StarIcon key={i} className="text-yellow-400 text-sm" />
        ) : (
          <StarBorderIcon key={i} className="text-gray-300 text-sm" />
        ),
      )
    }
    return stars
  }

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 py-8 text-center">
        <p className="text-red-600 text-lg">{error || "Product not found"}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-habesha_blue text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {currentText.backToProducts}
        </button>
      </div>
    )
  }

  return (
    <div lang={language === "EN" ? "en" : "am"} className="max-w-screen-2xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-habesha_blue hover:text-blue-700 transition-colors"
        >
          <ArrowBackIcon className="text-sm" />
          {currentText.backToProducts}
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600">{product.category}</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full max-w-md h-96 object-contain"
            />
          </div>
          {/* Commented out for single image display; may re-enable for multiple images
          <div className="flex gap-2">
            {[product.image, product.image, product.image].map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 bg-gray-50 rounded-lg p-2 border-2 ${
                  selectedImage === index ? "border-habesha_blue" : "border-gray-200"
                } hover:border-habesha_blue transition-colors`}
              >
                <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
          */}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="inline-block px-3 py-1 bg-habesha_blue/10 text-habesha_blue text-sm font-medium rounded-full mb-3">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{renderStars(product.rate)}</div>
              <span className="text-sm text-gray-600">
                ({product.count} {currentText.reviews})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-habesha_blue">
                {language === "EN" ? "$" : "ETB "}
                {getDisplayPrice(product.price)}
              </span>
              {product.stock > 0 ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {currentText.inStock} ({product.stock})
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                  {currentText.outOfStock}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">{currentText.description}</h3>
            <p className="text-gray-700 leading-relaxed">
              {language === "AMH" ? product.descriptionAm : product.descriptionEn}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <label className="font-medium">{currentText.quantity}:</label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-tr from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 border border-yellow-500 hover:border-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium py-3 px-6 rounded-md transition-all duration-200"
            >
              <ShoppingCartIcon className="text-sm" />
              {currentText.addToCart}
            </button>

            <button
              onClick={() => {
                handleAddToCart()
                navigate("/cart")
              }}
              disabled={product.stock === 0}
              className="flex-1 bg-habesha_blue hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentText.buyNow}
            </button>

            <button
              onClick={handleToggleFavorite}
              className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {isFavorite ? (
                <FavoriteIcon className="text-red-500" />
              ) : (
                <FavoriteBorderIcon className="text-gray-600" />
              )}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <LocalShippingIcon className="text-habesha_blue" />
              <div>
                <p className="font-medium">{currentText.shipping}</p>
                <p className="text-sm text-gray-600">{currentText.shippingDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SecurityIcon className="text-habesha_blue" />
              <div>
                <p className="font-medium">{currentText.secure}</p>
                <p className="text-sm text-gray-600">{currentText.secureDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Product Details */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">{currentText.features}</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium">{currentText.category}:</span>
                <span>{product.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium">Stock:</span>
                <span>{product.stock} units</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium">Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    product.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">{currentText.rating}:</span>
                <div className="flex items-center gap-1">
                  {renderStars(product.rate)}
                  <span className="text-sm text-gray-600 ml-1">({product.rate}/5)</span>
                </div>
              </div>
            </div>
          </div>
          <ProductReviews productId={product.id} />
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold mb-3">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Have questions about this product? Our customer service team is here to help.
            </p>
            <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails