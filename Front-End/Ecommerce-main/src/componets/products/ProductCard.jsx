// eco/hab/src/componets/products/ProductCard.jsx
import React from 'react';
import ApiIcon from '@mui/icons-material/Api';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/HabeshaSlice'; // Correct path

const ProductCard = ({ productItem }) => { // Renamed prop to productItem for clarity
  const dispatch = useDispatch();

  if (!productItem) {
    return null; // Or some placeholder if a productItem is missing
  }

  return (
    <div key={productItem.id} className='bg-white h-auto border-[1px] border-gray-200 py-8 z-30 hover:border-transparent shadow-none hover:shadow-textShadow duration-200 flex flex-col gap-4 relative'>
      <span className='text-xs capitalize font-titleFont font-semibold text-habesha_blue px-2 py-1 rounded-md absolute top-4 right-4'>
        {productItem.category}
      </span>
      <div className='w-full h-auto flex items-center justify-center relative group'>
        <img className='w-52 h-64 object-contain' src={productItem.image} alt={productItem.title} /> {/* Use productItem.title for alt */}
        <ul className='w-full h-36 bg-gray-100 absolute bottom-[-165px] flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-1 border-r group-hover:bottom-0 duration-700'>
          <li className='productLi'>
            Compare{""}
            <span><ApiIcon /></span>
          </li>
          <li onClick={() => dispatch(addToCart({
            id: productItem.id,
            image: productItem.image,
            title: productItem.title,
            price: productItem.price,
            description: productItem.description,
            category: productItem.category,
            quantity: 1
          }))}
            className='productLi'>
            Add to cart{""}
            <span><ShoppingCartIcon /></span>
          </li>
          <li className='productLi'>
            View Details{""}
            <span><ArrowCircleRightIcon /></span>
          </li>
          <li className='productLi'>
            Favorite{""}
            <span><FavoriteIcon /></span>
          </li>
        </ul>
      </div>
      <div className='px-4 z-10 bg-white'>
        <div className='flex items-center justify-between'>
          <h2 className='font-titleFont tracking-wide text-lg text-habesha_blue font-bold'>{productItem.title.substring(0, 20)}</h2>
          <p className='text-sm text-gray-600 font-semibold'> ${productItem.price}</p>
        </div>
        <div>
          <p className='text-sm'>{productItem.description.substring(0, 100)}...</p>
        </div>
        <button onClick={() => dispatch(addToCart({
          id: productItem.id,
          image: productItem.image,
          title: productItem.title,
          price: productItem.price,
          description: productItem.description,
          category: productItem.category,
          quantity: 1
        }))} className='w-full mt-10 font-titleFont font-medium text-base bg-gradient-to-tr from-yellow-300 border hover:from-yellow-300 hover:to-yellow-300 border-yellow-500 hover:border-yellow-700 active:bg-gradient-to-bl active:from-yellow-400 active:to-yellow-500 duration-200 py-1.5 rounded-md'>
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;