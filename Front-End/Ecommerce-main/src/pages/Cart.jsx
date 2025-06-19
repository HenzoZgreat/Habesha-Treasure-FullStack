import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { deleteItem, resetCart, incrementQuantity, decrementQuantity, setCart } from '../redux/HabeshaSlice';
import emptyCart from '../assets/images/emptyCart.png';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CartService from '../service/CartService';
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.habesha.cartProducts);
  const language = useSelector((state) => state.habesha.language);
  const [totalPrice, setTotalPrice] = useState(0);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      freeShipping: 'ትዕዛዝህ ለነጻ መላኪያ ተስማሚ ነው። ይህን አማራጭ በመክፈቻ ጊዜ ምረጥ። ዝርዝሮችን ተመልከት...',
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
  const USD_TO_ETB_RATE = 120;

  const getDisplayPrice = useCallback(
    (price) => {
      return language === 'EN' ? price : price * USD_TO_ETB_RATE;
    },
    [language]
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
  }, []);

  useEffect(() => {
    let Total = 0;
    products.forEach((item) => {
      Total += item.price * item.quantity;
    });
    setTotalPrice(getDisplayPrice(Total).toFixed(2));
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

  if (!localStorage.getItem('token')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-full p-6 w-24 h-24 mx-auto mb-6 shadow-lg flex items-center justify-center">
            <PersonIcon className="text-gray-400 text-4xl" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{currentText.notLoggedIn}</h2>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/SignIn')}
              className="bg-habesha_blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {currentText.signIn}
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-habesha_yellow text-habesha_blue px-8 py-3 rounded-lg hover:bg-yellow-500 transition-colors font-medium flex items-center gap-2"
            >
              <ShoppingBagIcon />
              {currentText.backToProducts}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            onClick={fetchCart}
            className="bg-habesha_blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentText.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 p-4 relative">
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
      {products.length > 0 ? (
        <div className="container mx-auto h-auto grid grid-cols-5 gap-8">
          <div className="w-full h-full px-4 bg-white col-span-4">
            <div className="font-titleFont flex items-center justify-between border-b-[1px] border-b-gray-400 py-3">
              <h2 className="text-3xl font-medium">{currentText.shoppingCart}</h2>
              <h4 className="text-xl font-normal">{currentText.subtitle}</h4>
            </div>
            <div>
              {products.map((item) => (
                <div key={item.id} className="w-full border-b-[1px] border-b-gray-300 p-4 flex items-center gap-6">
                  <div className="w-full flex items-center justify-between gap-6">
                    <div className="w-1/5">
                      <Link to={`/product/${item.id}`}>
                        <img className="w-full h-44 object-contain cursor-pointer" src={item.image} alt="productImage" />
                      </Link>
                    </div>
                    <div className="w-4/5">
                      <Link to={`/product/${item.id}`}>
                        <h2 className="font-semibold text-lg hover:text-habesha_blue cursor-pointer">{item.title}</h2>
                      </Link>
                      <p className="text-sm">{item.description.substring(0, 150)}</p>
                      <p className="text-base">
                        {currentText.unitPrice}{' '}
                        <span className="font-semibold">
                          {language === 'EN' ? '$' : 'ETB '}
                          {getDisplayPrice(item.price)}
                        </span>
                      </p>
                      <div className="bg-[#F0F2F2] flex justify-center items-center gap-1 w-24 py-1 text-center drop-shadow-lg rounded-md">
                        <p>{currentText.qty}</p>
                        <p
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="cursor-pointer bg-gray-200 px-1 rounded-md hover:bg-gray-400 duration-300"
                        >
                          -
                        </p>
                        <p>{item.quantity}</p>
                        <p
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="cursor-pointer bg-gray-200 px-1 rounded-md hover:bg-gray-400 duration-300"
                        >
                          +
                        </p>
                      </div>
                      <div onClick={() => handleDeleteItem(item.id)} className="w-full py-2">
                        <button className="bg-red-500 w-36 py-1 rounded-lg text-white mt-2 hover:bg-red-700 active:bg-red-900 duration-300">
                          {currentText.deleteItem}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-titleFont font-semibold">
                        {language === 'EN' ? '$' : 'ETB '}
                        {getDisplayPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div onClick={handleClearCart} className="w-full py-2">
              <button className="px-10 py-2 bg-red-500 hover:bg-red-600 active:bg-red-500 text-white rounded-lg font-titleFont font-semibold text-lg tracking-wide">
                {currentText.clearCart}
              </button>
            </div>
          </div>
          <div className="w-full h-52 bg-white col-span-1 flex-col justify-center items-center p-4">
            <div>
              <p className="flex gap-2 items-start text-sm">
                <span className="bg-white text-green-500 rounded-full">
                  <CheckCircleIcon />
                </span>
                {currentText.freeShipping}
              </p>
            </div>
            <div>
              <p className="font-semibold px-10 py-1 flex items-center justify-between gap-1">
                {currentText.total}:{' '}
                <span className="text-lg font-bold">
                  {language === 'EN' ? '$' : 'ETB '}
                  {totalPrice}
                </span>
              </p>
            </div>
            <button
              className="w-full font-titleFont font-medium text-base bg-gradient-to-tr from-yellow-400 to-yellow-200 border hover:from-yellow-300 hover:to-yellow-400 border-yellow-500 hover:border-yellow-700 active:bg-gradient-to-bl active:from-yellow-400 active:to-yellow-500 duration-200 py-1.5 rounded-md mt-3"
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
          className="flex justify-center items-center gap-4 py-10"
        >
          <div>
            <img className="w-80 rounded-lg p-4 mx-auto" src={emptyCart} alt="empty cart" />
          </div>
          <div className="w-96 p-4 bg-white flex flex-col items-center rounded-md">
            <h1 className="font-titleFont text-xl font-bold">{currentText.emptyCart}</h1>
            <p className="text-sm text-center">{currentText.emptyCartMessage}</p>
            <Link to="/">
              <button
                className="w-full font-titleFont font-medium text-base bg-gradient-to-tr from-yellow-400 to-yellow-200 border hover:from-yellow-300 hover:to-yellow-400 border-yellow-500 hover:border-yellow-700 active:bg-gradient-to-bl active:from-yellow-400 active:to-yellow-500 duration-200 py-1.5 rounded-md mt-3"
              >
                {currentText.continueShopping}
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;