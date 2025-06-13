import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { deleteItem, resetCart, incrementQuantity, decrementQuantity } from '../redux/HabeshaSlice';
import emptyCart from '../assets/images/emptyCart.png';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.habesha.cartProducts);
  const language = useSelector((state) => state.habesha.language);
  const [totalPrice, setTotalPrice] = useState(0);

  console.log("Cart products in Cart:", products.length);

  const text = {
    EN: {
      shoppingCart: 'Shopping Cart',
      subtitle: 'Subtitle',
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
    },
    AMH: {
      shoppingCart: 'የግብይት ጋሪ',
      subtitle: 'ንዑስ ርዕስ',
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

  useEffect(() => {
    let Total = 0;
    products.forEach((item) => {
      Total += item.price * item.quantity;
    });
    setTotalPrice(getDisplayPrice(Total).toFixed(2));
  }, [products, language]); // No need to include getDisplayPrice since it's memoized

  return (
    <div className="w-full bg-gray-100 p-4">
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
                      <img className="w-full h-44 object-contain" src={item.image} alt="productImage" />
                    </div>
                    <div className="w-4/5">
                      <h2 className="font-semibold text-lg">{item.title}</h2>
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
                          onClick={() => dispatch(decrementQuantity(item.id))}
                          className="cursor-pointer bg-gray-200 px-1 rounded-md hover:bg-gray-400 duration-300"
                        >
                          -
                        </p>
                        <p>{item.quantity}</p>
                        <p
                          onClick={() => dispatch(incrementQuantity(item.id))}
                          className="cursor-pointer bg-gray-200 px-1 rounded-md hover:bg-gray-400 duration-300"
                        >
                          +
                        </p>
                      </div>
                      <div onClick={() => dispatch(deleteItem(item.id))} className="w-full py-2">
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

            <div onClick={() => dispatch(resetCart())} className="w-full py-2">
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
                </span>{' '}
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