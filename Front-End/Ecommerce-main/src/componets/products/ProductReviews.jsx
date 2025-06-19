import React, { useState, useEffect } from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import userProductService from '../../service/userProductService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProductReviews = ({ productId }) => {
  const language = useSelector((state) => state.habesha.language);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const fetchData = async () => {
    try {
      setReviewsLoading(true);
      const reviewsResponse = await userProductService.getReviews(productId);
      const reviewsData = Array.isArray(reviewsResponse.data) ? reviewsResponse.data : [];
      setReviews(reviewsData);
      setReviewsLoading(false);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setError(err.response?.data?.message || currentText.failedToLoadReviews);
      setReviews([]);
      setReviewsLoading(false);
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userResponse = await userProductService.getCurrentUserId();
        const userId = userResponse.data.userId;
        setCurrentUserId(userId);
        setHasReviewed(reviews.some(review => review.userId === userId));
      } catch (err) {
        console.error('Failed to fetch user ID:', err);
        if (err.response && [401, 403].includes(err.response.status)) {
          localStorage.removeItem('token');
          setCurrentUserId(null);
          setError(currentText.loginPrompt);
          setTimeout(() => setError(null), 3000);
          navigate('/SignIn');
        }
      }
    }
    setUserLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  const text = {
    EN: {
      writeReview: 'Write a Review',
      rating: 'Rating',
      comment: 'Comment',
      submit: 'Submit Review',
      required: 'Rating is required',
      success: 'Review submitted successfully!',
      noReviews: 'No reviews yet. Be the first to review!',
      postedOn: 'Posted on',
      delete: 'Delete',
      loginPrompt: 'Please sign in to submit a review.',
      failedToLoadReviews: 'Failed to load reviews.',
      loading: 'Loading...',
    },
    AMH: {
      writeReview: 'ግምገማ ይፃፉ',
      rating: 'ደረጃ',
      comment: 'አስተያየት',
      submit: 'ግምገማ አስገባ',
      required: 'ደረጃ መስጠት አስፈላጊ ነው',
      success: 'ግምገማ በተሳካ ሁኔታ ተገብቷል!',
      noReviews: 'ገና ግምገማ የለም። የመጀመሪያው ግምገማ ይሁኑ!',
      postedOn: 'ተለጠፈ በ',
      delete: 'ሰርዝ',
      loginPrompt: 'ግምገማ ለማስገባት እባክዎ ይግቡ።',
      failedToLoadReviews: 'ግምገማዎችን መጫን አልተሳካም።',
      loading: 'በመጫን ላይ...',
    },
  };

  const currentText = text[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      setError(currentText.loginPrompt);
      setTimeout(() => setError(null), 3000);
      navigate('/SignIn');
      return;
    }
    if (rating < 1) {
      setError(currentText.required);
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      await userProductService.submitReview(productId, { rating, comment });
      setSuccess(currentText.success);
      setRating(0);
      setComment('');
      setError(null);
      await fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setError(err.response?.data?.message || 'Failed to submit review.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteReview = async () => {
    if (!currentUserId) {
      setError(currentText.loginPrompt);
      setTimeout(() => setError(null), 3000);
      navigate('/SignIn');
      return;
    }
    if (!window.confirm(language === 'AMH' ? 'ይህን ግምገማ መሰረዝ ይፈልጋሉ?' : 'Are you sure you want to delete this review?')) {
      return;
    }
    try {
      await userProductService.deleteReview(productId);
      setSuccess('Review deleted successfully!');
      await fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to delete review:', err);
      setError(err.response?.data?.message || 'Failed to delete review.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const renderStars = (rating, isForm = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (isForm) {
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
      } else {
        stars.push(
          i <= rating ? (
            <StarIcon key={i} className="text-yellow-400 text-sm" />
          ) : (
            <StarBorderIcon key={i} className="text-gray-300 text-sm" />
          )
        );
      }
    }
    return stars;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(language === 'AMH' ? 'am-ET' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (userLoading || reviewsLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 mt-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-habesha_blue mx-auto mb-2"></div>
        <p className="text-gray-600 text-sm">{currentText.loading}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-8 relative">
      {(success || error) && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className={`bg-white border-l-4 ${success ? 'border-green-500' : 'border-red-500'} shadow-2xl rounded-lg p-4 max-w-sm mx-auto`}>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {success ? (
                  <CheckCircleIcon className="text-green-500 text-xl" />
                ) : (
                  <span className="text-red-500 text-xl">⚠</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-habesha_blue">{success || error}</p>
              </div>
              <button
                onClick={() => success ? setSuccess(null) : setError(null)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <CloseIcon className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{currentText.writeReview}</h3>
      {!hasReviewed && currentUserId ? (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {currentText.rating}
            </label>
            <div className="flex gap-1">{renderStars(rating, true)}</div>
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
      ) : !currentUserId ? (
        <p className="text-sm text-gray-600 mb-4">
          {currentText.loginPrompt}{' '}
          <button
            onClick={() => navigate('/SignIn')}
            className="text-habesha_blue hover:underline"
          >
            {language === 'AMH' ? 'አሁን ይግቡ' : 'Sign in now'}
          </button>
        </p>
      ) : null}

      <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h4>
      {reviewsLoading ? (
        <p className="text-gray-600 text-sm">{language === 'AMH' ? 'ግምገማዎች በመጫን ላይ...' : 'Loading reviews...'}</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-600 text-sm">{currentText.noReviews}</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="text-sm font-medium text-gray-900">
                    {review.reviewer}
                  </span>
                </div>
                {review.userId === currentUserId && (
                  <button
                    onClick={handleDeleteReview}
                    className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                  >
                    <DeleteIcon className="text-sm" />
                    {currentText.delete}
                  </button>
                )}
              </div>
              {review.comment && (
                <p className="text-sm text-gray-700">{review.comment}</p>
              )}
              <p className="text-xs text-gray-500">
                {currentText.postedOn} {formatDate(review.reviewedAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;