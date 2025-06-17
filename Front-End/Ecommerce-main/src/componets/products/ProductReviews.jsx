import React, { useState, useEffect } from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import userProductService from '../../service/userProductService';



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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, reviewsResponse] = await Promise.all([
          userProductService.getCurrentUserId(),
          userProductService.getReviews(productId)
        ]);
        const userId = userResponse.data.userId;
        setCurrentUserId(userId);
        const reviewsData = Array.isArray(reviewsResponse.data) ? reviewsResponse.data : [];
        console.log('Reviews response:', reviewsResponse.data); // Debug log
        setReviews(reviewsData);
        setHasReviewed(reviewsData.some(review => review.userId === userId));
        setReviewsLoading(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        console.error('Error response:', err.response?.data); // Debug log
        if (err.response && [401, 403].includes(err.response.status)) {
          localStorage.removeItem('token');
          navigate('/SignIn');
        } else {
          setReviews([]);
          setError(err.response?.data?.message || 'Failed to load reviews. Please try again later.');
        }
        setReviewsLoading(false);
      }
    };
    fetchData();
  }, [productId, navigate]);

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
      const response = await userProductService.getReviews(productId);
      const reviewsData = Array.isArray(response.data) ? response.data : [];
      console.log('Refreshed reviews:', response.data); // Debug log
      setReviews(reviewsData);
      setHasReviewed(true);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to submit review:', err);
      if (err.response && [401, 403].includes(err.response.status)) {
        localStorage.removeItem('token');
        navigate('/SignIn');
      } else {
        setError(err.response?.data?.message || 'Failed to submit review.');
      }
    }
  };

  const handleDeleteReview = async () => {
    if (!window.confirm(language === 'AMH' ? 'ይህን ግምገማ መሰረዝ ይፈልጋሉ?' : 'Are you sure you want to delete this review?')) {
      return;
    }
    try {
      await userProductService.deleteReview(productId);
      const response = await userProductService.getReviews(productId);
      const reviewsData = Array.isArray(response.data) ? response.data : [];
      console.log('Refreshed reviews after delete:', response.data); // Debug log
      setReviews(reviewsData);
      setHasReviewed(false);
    } catch (err) {
      console.error('Failed to delete review:', err);
      if (err.response && [401, 403].includes(err.response.status)) {
        localStorage.removeItem('token');
        navigate('/SignIn');
      } else {
        alert(`Failed to delete review: ${err.response?.data?.message || 'Server error'}`);
      }
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
      {!hasReviewed && currentUserId && (
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
      )}

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