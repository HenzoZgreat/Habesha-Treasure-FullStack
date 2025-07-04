import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { deleteItem, resetCart, incrementQuantity, decrementQuantity, setCart } from '../../redux/HabeshaSlice';
import emptyCart from '../../assets/images/emptyCart.png';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CartService from '../../service/CartService';
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import UserSettingsService from '../../service/UserSettingsService';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.habesha.cartProducts);
  const language = useSelector((state) => state.habesha.language);
  const [totalPrice, setTotalPrice] = useState(0);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(120); // Default value
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1000); // Default value

  const text = {
    EN: {
      shoppingCart: 'Shopping Cart',
      subtitle: 'Manage your selected items',
      unitPrice: 'Unit Price',
      qty: 'Qty',
      deleteItem: 'Delete Item',
      clearCart: 'Clear Cart',
      freeShipping: 'Your order qualifies for free shipping. Choose this option at checkout. See details...',
      total: 'Total',
      proceedToPay: 'Proceed to Pay',
      emptyCart: 'Your Cart is Empty',
      emptyCartMessage: 'Your shopping cart lives to serve. Give it purpose.',
      continueShopping: 'Continue Shopping',
      notLoggedIn: 'Please sign in to view your cart',
      signIn: 'Sign In',
      backToProducts: 'Back to Products',
      itemRemoved: 'Item removed from cart',
      error: 'Failed to load cart',
      retry: 'Try Again',
    },
    AMH: {
      shoppingCart: 'የግብይት ጋሪ',
      subtitle: 'የተመረጡ እቃዎችዎን ያስተዳድሩ',
      unitPrice: 'ነጠላ ዋጋ',
      qty: 'ብዛት',
      deleteItem: 'እቃ ሰርዝ',
      clearCart: 'ጋሪ አጽዳ',
      freeShipping: 'ትዕዛዝህ ለነፃ መላኪያ ተስማሚ ነው። ይህን አማራጭ በመክፈቻ ጊዜ ምረጥ። ዝርዝሮችን ተመልከት...',
      total: 'ጠቅላላ',
      proceedToPay: 'መክፈል ቀጥል',
      emptyCart: 'ጋሪህ ባዶ ነው',
      emptyCartMessage: 'የግብይት ጋሪህ ለማገልገል ነው። ዓላማ ስጠው።',
      continueShopping: 'ግብይት ቀጥል',
      notLoggedIn: 'ጋሪዎን ለማየት እባክዎ ይግቡ',
      signIn: 'ይግቡ',
      backToProducts: 'ወደ ምርቶች ተመለስ',
      itemRemoved: 'እቃ ከጋሪ ተወግዷል',
      error: 'ጋሪ መጫን አልተቻለም',
      retry: 'እንደገና ሞክር',
    },
  };

  const currentText = text[language];

  const getDisplayPrice = useCallback(
    (price) => {
      const value = language === 'EN' ? price : price * exchangeRate;
      return value.toLocaleString(language === 'AMH' ? 'am-ET' : 'en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    [language, exchangeRate]
  );

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await CartService.getCart();
      const cartItems = Array.isArray(response.data) ? response.data : [];
      dispatch(setCart(cartItems.map(item => ({
        id: item.productId,
        title: item.productName,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        description: '', // Backend doesn't provide description
      }))));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(error.response?.data?.message || currentText.error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchCart();
    } else {
      setLoading(false);
    }
    const fetchSettings = async () => {
      try {
        const response = await UserSettingsService.getSettings();
        setExchangeRate(response.data.storeInfo.exchangeRate || 120);
        setFreeShippingThreshold(response.data.shipping.freeShippingThreshold || 1000);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        setExchangeRate(120); // Fallback to default
        setFreeShippingThreshold(1000); // Fallback to default
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    let Total = 0;
    products.forEach((item) => {
      Total += item.price * item.quantity;
    });
    setTotalPrice(getDisplayPrice(Total));
  }, [products, getDisplayPrice]);

  const handleDeleteItem = async (productId) => {
    try {
      await CartService.removeFromCart({ productId });
      dispatch(deleteItem(productId));
      setNotification({ message: currentText.itemRemoved, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error removing item:', error);
      setNotification({ message: 'Failed to remove item', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleClearCart = async () => {
    try {
      await CartService.clearCart();
      dispatch(resetCart());
      setNotification({ message: currentText.itemRemoved, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setNotification({ message: 'Failed to clear cart', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await CartService.addToCart({ productId, quantity: newQuantity });
      dispatch(newQuantity > products.find(item => item.id === productId).quantity ? 
        incrementQuantity(productId) : decrementQuantity(productId));
    } catch (error) {
      console.error('Error updating quantity:', error);
      setNotification({ message: 'Failed to update quantity', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!localStorage.getItem('token')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 shadow-lg flex items-center justify-center">
            <PersonIcon className="text-gray-400 text-2xl" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{currentText.notLoggedIn}</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            <button
              onClick={() => navigate('/SignIn')}
              className="bg-habesha_blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
            >
              {currentText.signIn}
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-habesha_yellow text-habesha_blue px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <ShoppingBagIcon className="text-sm" />
              {currentText.backToProducts}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-habesha_blue mx-auto mb-4"></div>
          <p className="text-habesha_blue font-medium text-sm sm:text-base">{currentText.loading}</p>
        </div>
      </div>
    );
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
            onClick={fetchCart}
            className="bg-habesha_blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            {currentText.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 py-4 px-4 sm:px-6 lg:px-8 relative min-h-screen">
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
      {products.length > 0 ? (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="w-full bg-white rounded-lg shadow-sm p-4 sm:p-6 flex-grow">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-300 pb-3 mb-4">
              <h2 className="text-xl sm:text-2xl font-medium text-habesha_blue">{currentText.shoppingCart}</h2>
              <h4 className="text-sm sm:text-base font-normal text-gray-600 mt-2 sm:mt-0">{currentText.subtitle}</h4>
            </div>
            <div className="space-y-4">
              {products.map((item) => (
                <div key={item.id} className="border-b border-gray-300 pb-4 flex flex-col gap-4 rounded-lg bg-gray-50 p-3 sm:p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 sm:w-24 flex-shrink-0">
                      <Link to={`/product/${item.id}`}>
                        <img className="w-full h-20 sm:h-24 object-contain cursor-pointer" src={item.image} alt="productImage" />
                      </Link>
                    </div>
                    <div className="flex-grow">
                      <Link to={`/product/${item.id}`}>
                        <h2 className="font-semibold text-sm sm:text-base hover:text-habesha_blue cursor-pointer line-clamp-2">{item.title}</h2>
                      </Link>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">{item.description.substring(0, 80)}</p>
                      <p className="text-xs sm:text-sm mt-2">
                        {currentText.unitPrice}{' '}
                        <span className="font-semibold">
                          {language === 'EN' ? '$' : 'ETB '}
                          {getDisplayPrice(item.price)}
                        </span>
                      </p>
                      <p className="text-xs sm:text-sm font-semibold mt-1">
                        {currentText.total}{' '}
                        <span className="text-habesha_blue">
                          {language === 'EN' ? '$' : 'ETB '}
                          {getDisplayPrice(item.price * item.quantity)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="bg-gray-100 flex items-center gap-1 w-24 py-1 px-2 rounded-md">
                      <p className="text-xs">{currentText.qty}</p>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="bg-gray-200 px-2 py-1 rounded-md hover:bg-gray-300 text-xs"
                      >
                        -
                      </button>
                      <p className="text-xs">{item.quantity}</p>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="bg-gray-200 px-2 py-1 rounded-md hover:bg-gray-300 text-xs"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-xs"
                    >
                      {currentText.deleteItem}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button
                onClick={handleClearCart}
                className="w-full sm:w-auto px-6 sm:px-8 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm sm:text-base"
              >
                {currentText.clearCart}
              </button>
            </div>
          </div>
          <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm p-4 sm:p-6 flex-shrink-0 sticky bottom-0 lg:static">
            {totalPrice && parseFloat(totalPrice.replace(/[^0-9.-]+/g,"")) < freeShippingThreshold && (
              <p className="flex gap-2 items-start text-xs sm:text-sm text-gray-600 mb-4">
                <span className="text-red-500">⚠</span>
                Add {getDisplayPrice((freeShippingThreshold - parseFloat(totalPrice.replace(/[^0-9.-]+/g,"")))/exchangeRate)} more to qualify for free shipping.
              </p>
            )}
            {totalPrice && parseFloat(totalPrice.replace(/[^0-9.-]+/g,"")) >= freeShippingThreshold && (
              <p className="flex gap-2 items-start text-xs sm:text-sm text-gray-600 mb-4">
                <CheckCircleIcon className="text-green-500 text-base sm:text-lg" />
                {currentText.freeShipping}
              </p>
            )}
            <p className="flex items-center justify-between text-sm sm:text-base font-semibold mb-4">
              {currentText.total}
              <span className="text-base sm:text-lg font-bold">
                {language === 'EN' ? '$' : 'ETB '}
                {totalPrice}
              </span>
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-habesha_yellow hover:bg-yellow-500 text-habesha_blue font-semibold py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
            >
              {currentText.proceedToPay}
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col items-center gap-4 py-10 text-center px-4"
        >
          <img src={emptyCart} alt="Empty Cart" className="w-40 h-40 object-contain" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{currentText.emptyCart}</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-md">{currentText.emptyCartMessage}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-habesha_yellow hover:bg-yellow-500 text-habesha_blue font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            <ShoppingBagIcon />
            {currentText.continueShopping}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;