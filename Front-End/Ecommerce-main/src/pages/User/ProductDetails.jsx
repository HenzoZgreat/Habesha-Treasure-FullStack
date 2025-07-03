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
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CloseIcon from "@mui/icons-material/Close"
import { addToCart } from "../../redux/HabeshaSlice"
import { v4 as uuidv4 } from "uuid"
import userProductService from "../../service/userProductService"
import CartService from "../../service/CartService"
import UserSettingsService from "../../service/UserSettingsService"
import ProductReviews from "../../componets/products/ProductReviews"

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
  const [notification, setNotification] = useState(null)
  const [exchangeRate, setExchangeRate] = useState(150); // Default value

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productResponse, favoriteResponse] = await Promise.all([
          userProductService.getProductById(id),
          userProductService.isFavorited(id).catch(() => ({ data: { favorited: false } }))
        ]);
        setProduct(productResponse.data);
        setIsFavorite(favoriteResponse.data.favorited);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product details. Please try again later.");
        setLoading(false);
      }
    };
    fetchProduct();
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
  }, [id]);

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
      loginPrompt: "Please sign in to favorite this product.",
      loginToAddToCart: "Please sign in to add this item to cart.",
      itemAdded: "Item added to cart!",
      addToCartFailed: "Failed to add item to cart",
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
      secureDesc: "100% ደህነቱ የተጠበቀ የክፍያ ሂደት",
      rating: "ደረጃ",
      reviews: "ግምገማዎች",
      share: "አጋራ",
      relatedProducts: "ተዛማጅ ምርቶች",
      loginPrompt: "ይህን ምርት ለመውደድ እባክዎ ይግቡ።",
      loginToAddToCart: "ይህን እቃ ወደ ጋሪ ለመጨመር እባክዎ ይግቡ።",
      itemAdded: "እቃ ወደ ጋሪ ታክሏል!",
      addToCartFailed: "እቃ ወደ ጋሪ መጨመር አልተሳካም",
    },
  };

  const currentText = text[language];

  const formatPrice = (price) => {
    const value = language === "EN" ? price : price * exchangeRate;
    return value.toLocaleString(language === "AMH" ? 'am-ET' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatNumber = (number) => {
    return number.toLocaleString(language === "AMH" ? 'am-ET' : 'en-US');
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({ message: currentText.loginToAddToCart, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const itemId = product.id ?? uuidv4();
    const cartItem = {
      id: itemId,
      image: product.image,
      title: product.name,
      price: product.price,
      description: language === "AMH" ? product.descriptionAm : product.descriptionEn,
      category: product.category,
      quantity: quantity,
    };

    try {
      await CartService.addToCart({ productId: product.id, quantity: quantity });
      dispatch(addToCart(cartItem));
      setNotification({ message: currentText.itemAdded, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setNotification({ message: currentText.addToCartFailed, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleToggleFavorite = async () => {
    if (!localStorage.getItem('token')) {
      setNotification({ message: currentText.loginPrompt, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    try {
      if (isFavorite) {
        await userProductService.unfavorite(product.id);
        setIsFavorite(false);
      } else {
        await userProductService.favorite(product.id);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      setNotification({ message: `Failed to update favorite: ${err.response?.data?.message || "Server error"}`, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <StarIcon key={i} className="text-yellow-400 text-sm" />
        ) : (
          <StarBorderIcon key={i} className="text-gray-300 text-sm" />
        )
      );
    }
    return stars;
  };

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
    );
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
    );
  }

  return (
    <div lang={language === "EN" ? "en" : "am"} className="max-w-screen-2xl mx-auto px-4 py-8">
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
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full max-w-md h-96 object-contain"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="inline-block px-3 py-1 bg-habesha_blue/10 text-habesha_blue text-sm font-semibold rounded-full mb-3">{product.category}</label>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{renderStars(product.rate)}</div>
              <span className="text-sm text-gray-600">
                ({product.count} {currentText.reviews})
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-habesha_blue">
                {language === "EN" ? "$" : "ETB "}
                {formatPrice(product.price)}
              </span>
              {product.stock > 0 ? (
                <label className="px-3 py-1 bg-green-100 text-white text-sm font-semibold rounded-full">{currentText.inStock} ({formatNumber(product.stock)})</label>
              ) : (
                <label className="px-3 py-1 bg-red-100 text-white text-sm font-semibold rounded-full">{currentText.outOfStock}</label>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">{currentText.description}</h3>
            <p className="text-gray-700 leading-relaxed">
              {language === "AMH" ? product.descriptionAm : product.descriptionEn}
            </p>
          </div>

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
              <span className="px-4 py-2 border-x border-gray-300">{formatNumber(quantity)}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

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
                handleAddToCart();
                navigate("/cart");
              }}
              disabled={product.stock === 0}
              className="flex-1 bg-habesha_blue hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                <span>{formatNumber(product.stock)} units</span>
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
              Have questions about this product? Our customer support team is here to help.
            </p>
            <button
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;