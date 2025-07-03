import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/HabeshaSlice';
import { v4 as uuidv4 } from 'uuid';
import userProductService from '../../service/userProductService';
import CartService from '../../service/CartService';
import UserSettingsService from '../../service/UserSettingsService';
import { motion } from 'framer-motion';

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = useSelector((state) => state.habesha.language);
  const cartProducts = useSelector((state) => state.habesha.cartProducts);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [notification, setNotification] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(150); // Default value

  const text = {
    EN: {
      addToCart: 'Add to Cart',
      viewDetails: 'View Details',
      favorite: 'Favorite',
      itemAdded: 'success',
      addToCartFailed: 'Failed to add item to cart',
      failedToLoad: 'Failed to load products',
      retry: 'Retry',
      loading: 'Loading products...',
      loginToFavorite: 'Please sign in to favorite this item.',
      loginToAddToCart: 'Please sign in to add this item to cart.',
    },
    AMH: {
      addToCart: 'ወደ ጋሪ ጨምር',
      viewDetails: 'ዝርዝር ተመልከቱ',
      favorite: 'የምወደው',
      itemAdded: 'እቃ ወደ ጋሪ ታክሏል!',
      addToCartFailed: 'እቃ ወደ ጋሪ መጨመር አልተሳካም',
      failedToLoad: 'ምርቶችን መጫን አልተሳካም',
      retry: 'እንደገና ሞክር',
      loading: 'ምርቶች በመጫን ላይ...',
      loginToFavorite: 'ይህን እቃ ለመውደድ እባክዎ ይግቡ።',
      loginToAddToCart: 'ይህን እቃ ወደ ጋሪ ለመጨመር እባክዎ ይግቡ።',
    },
  };

  const currentText = text[language];

  const formatPrice = (price) => {
    const value = language === 'EN' ? price : price * exchangeRate;
    return value.toLocaleString(language === 'AMH' ? 'am-ET' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userProductService.getProducts();
      setProducts(response.data);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const favoritePromises = response.data.map((item) =>
            userProductService.isFavorited(item.id).then((res) => ({
              id: item.id,
              favorited: res.data.favorited,
            }))
          );
          const favoriteResults = await Promise.all(favoritePromises);
          const favoritesMap = favoriteResults.reduce(
            (acc, { id, favorited }) => ({ ...acc, [id]: favorited }),
            {}
          );
          setFavorites(favoritesMap);
        } catch (err) {
          if (err.response && [401, 403].includes(err.response.status)) {
            localStorage.removeItem('token');
            setFavorites({});
          } else {
            console.error('Failed to fetch favorites:', err);
            setFavorites({});
          }
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(currentText.failedToLoad);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
  }, []);

  const handleAddToCart = async (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({ message: currentText.loginToAddToCart, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    const itemId = item.id ?? uuidv4();
    const cartItem = {
      id: itemId,
      image: item.image,
      title: item.name,
      price: item.price,
      description: language === 'AMH' ? item.descriptionAm : item.descriptionEn,
      category: item.category,
      quantity: 1,
    };

    try {
      await CartService.addToCart({ productId: item.id, quantity: 1 });
      dispatch(addToCart(cartItem));
      setNotification({ message: currentText.itemAdded, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setNotification({ message: currentText.addToCartFailed, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleToggleFavorite = async (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({ message: currentText.loginToFavorite, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    try {
      if (favorites[item.id]) {
        await userProductService.unfavorite(item.id);
        setFavorites((prev) => ({ ...prev, [item.id]: false }));
      } else {
        await userProductService.favorite(item.id);
        setFavorites((prev) => ({ ...prev, [item.id]: true }));
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      if (err.response && [401, 403].includes(err.response.status)) {
        localStorage.removeItem('token');
        navigate('/SignIn');
      } else {
        setNotification({ message: `Failed to update favorite: ${err.response?.data?.message || 'Server error'}`, type: 'error' });
        setTimeout(() => setNotification(null), 3000);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-habesha_blue mx-auto mb-4"></div>
          <p className="text-habesha_blue font-medium">{currentText.loading}</p>
        </div>
      </div>
    );
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
            onClick={fetchProducts}
            className="bg-habesha_blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentText.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      lang={language === 'EN' ? 'en' : 'am'}
      className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-10 px-4 relative"
    >
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
      {products.map((item) => (
        <motion.div
          key={item.id}
          className="bg-white h-auto border-[1px] border-gray-200 py-8 z-30 hover:border-transparent shadow-none hover:shadow-textShadow duration-200 flex flex-col gap-4 relative"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-xs capitalize font-titleFont font-semibold text-habesha_blue px-2 py-1 rounded-md absolute top-4 right-4">
            {item.category}
          </span>
          <div className="w-full h-auto flex items-center justify-center relative group">
            <img className="w-52 h-64 object-contain" src={item.image} alt={item.name} />
            <ul className="w-full h-36 bg-gray-100 absolute bottom-[-165px] flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-1 border-r group-hover:bottom-0 duration-700">
              <li onClick={() => handleAddToCart(item)} className="productLi">
                {currentText.addToCart} <ShoppingCartIcon />
              </li>
              <li onClick={() => navigate(`/product/${item.id}`)} className="productLi">
                {currentText.viewDetails} <ArrowCircleRightIcon />
              </li>
              <li onClick={() => handleToggleFavorite(item)} className="productLi">
                {currentText.favorite}{' '}
                <FavoriteIcon style={{ color: favorites[item.id] ? 'red' : 'inherit' }} />
              </li>
            </ul>
          </div>
          <div className="px-4 z-10 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="font-titleFont tracking-wide text-lg text-habesha_blue font-bold">
                {item.name.substring(0, 20)}
              </h2>
              <p className="text-sm text-gray-600 font-semibold">
                {language === 'EN' ? '$' : 'ETB '}
                {formatPrice(item.price)}
              </p>
            </div>
            <div>
              <p className="text-sm">
                {(language === 'AMH' ? item.descriptionAm : item.descriptionEn).substring(0, 100)}...
              </p>
            </div>
            <button
              onClick={() => handleAddToCart(item)}
              className="w-full mt-10 font-titleFont font-medium text-base bg-gradient-to-tr from-yellow-300 border hover:from-yellow-300 hover:to-yellow-300 border-yellow-500 hover:border-yellow-700 active:bg-gradient-to-bl active:from-yellow-400 active:to-yellow-500 duration-200 py-1.5 rounded-md"
            >
              {currentText.addToCart}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Product;