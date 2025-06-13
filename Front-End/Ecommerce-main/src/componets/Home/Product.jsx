import React from 'react';
import { useLoaderData } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/HabeshaSlice';
import { v4 as uuidv4 } from 'uuid';

const Product = () => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.habesha.language);
  const cartProducts = useSelector((state) => state.habesha.cartProducts);

  const data = useLoaderData();
  const productData = data.data;

  console.log("Product Data:", productData);

  const text = {
    EN: {
      compare: 'Compare',
      addToCart: 'Add to Cart',
      viewDetails: 'View Details',
      favorite: 'Favorite',
    },
    AMH: {
      compare: 'አወዳድር',
      addToCart: 'ወደ ጋሪ ጨምር',
      viewDetails: 'ዝርዝር ይመልከቱ',
      favorite: 'የምወደው',
    },
  };

  const currentText = text[language];

  const USD_TO_ETB_RATE = 150;

  const getDisplayPrice = (price) => {
    return language === 'EN' ? price : price * USD_TO_ETB_RATE;
  };

  const handleAddToCart = (item) => {
    const itemId = item.id ?? uuidv4();
    console.log("Dispatching addToCart for item:", { ...item, id: itemId });
    dispatch(
      addToCart({
        id: itemId,
        image: item.image,
        title: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        quantity: 1,
      })
    );
    console.log("Cart after dispatch (may not be updated yet):", cartProducts);
  };

  return (
    <div lang={language === 'EN' ? 'en' : 'am'} className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-10 px-4 top-0">
      {productData.map((item) => (
        <div
          key={item.id}
          className="bg-white h-auto border-[1px] border-e-gray-200 py-8 z-30 hover:border-transparent shadow-none hover:shadow-textShadow duration-200 flex flex-col gap-4 relative"
        >
          <span className="text-xs capitalize font-titleFont font-semibold text-habesha_blue px-2 py-1 rounded-md absolute top-4 right-4">
            {item.category}
          </span>
          <div className="w-full h-auto flex items-center justify-center relative group">
            <img className="w-52 h-64 object-contain" src={item.image} alt="productImage" />
            <ul className="w-full h-36 bg-gray-100 absolute bottom-[-165px] flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-1 border-r group-hover:bottom-0 duration-700">
              <li onClick={() => handleAddToCart(item)} className="productLi">
                {currentText.addToCart} <ShoppingCartIcon />
              </li>
              <li className="productLi">
                {currentText.viewDetails} <ArrowCircleRightIcon />
              </li>
              <li className="productLi">
                {currentText.favorite} <FavoriteIcon />
              </li>
            </ul>
          </div>
          <div className="px-4 z-10 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="font-titleFont tracking-wide text-lg text-habesha_blue font-bold">
                {item.title.substring(0, 20)}
              </h2>
              <p className="text-sm text-gray-600 font-semibold">
                {language === 'EN' ? '$' : 'ETB '}
                {getDisplayPrice(item.price)}
              </p>
            </div>
            <div>
              <p className="text-sm">{item.description.substring(0, 100)}...</p>
            </div>
            <button
              onClick={() => handleAddToCart(item)}
              className="w-full mt-10 font-titleFont font-medium text-base bg-gradient-to-tr from-yellow-300 border hover:from-yellow-300 hover:to-yellow-300 border-yellow-500 hover:border-yellow-700 active:bg-gradient-to-bl active:from-yellow-400 active:to-yellow-500 duration-200 py-1.5 rounded-md"
            >
              {currentText.addToCart}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Product;