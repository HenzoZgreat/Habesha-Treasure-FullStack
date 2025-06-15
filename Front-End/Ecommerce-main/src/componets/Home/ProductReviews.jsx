import React, { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import userProductService from '../../service/userProductService';
import { useSelector } from 'react-redux';

const ProductReviews = ({ productId }) => {
  const language = useSelector((state) => state.habesha.language);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const text = {
    EN: {
      writeReview: 'Write a Review',
      rating: 'Rating',
      comment: 'Comment',
      submit: 'Submit Review',
      required: 'Rating is required',
      success: 'Review submitted successfully!',
    },
    AMH: {
      writeReview: 'ግምገማ ይፃፉ',
      rating: 'ደረጃ',
      comment: 'አስተያየት',
      submit: 'ግምገማ አስገባ',
      required: 'ደረጃ መስጠት አስፈላጊ ነው',
      success: 'ግምገማ በተሳካ ሁኔታ ተገብቷል!',
    },
  };

  const currentText = text[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) {
      setError(currentText.required);
      return;
    }
    try {
      await userProductService.submitReview(productId, { rating, comment });
      setSuccess(currentText.success);
      setRating(0);
      setComment('');
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to submit review:', err);
      if (err.response && [401, 403].includes(err.response.status)) {
        localStorage.removeItem('token');
        window.location.href = '/SignIn';
      } else {
        setError(err.response?.data?.message || 'Failed to submit review.');
      }
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none"
        >
          {(hoverRating || rating) >= i ? (
            <StarIcon className="text-yellow-400 text-lg" />
          ) : (
            <StarBorderIcon className="text-gray-300 text-lg" />
          )}
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{currentText.writeReview}</h3>
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {currentText.rating}
          </label>
          <div className="flex gap-1">{renderStars()}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {currentText.comment}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 500))}
            maxLength={500}
            rows={4}
            className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:border-habesha_blue focus:ring-habesha_blue"
            placeholder={language === 'AMH' ? 'አስተያየትዎን ይፃፉ...' : 'Write your comment...'}
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {comment.length}/500
          </p>
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-habesha_blue text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
        >
          {currentText.submit}
        </button>
      </form>
    </div>
  );
};

export default ProductReviews;