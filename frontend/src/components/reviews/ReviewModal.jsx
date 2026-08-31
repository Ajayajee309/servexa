import React, { useState } from 'react';
import { X, Star, Loader2 } from 'lucide-react';
import api from '../../services/api';

const ReviewModal = ({ bookingId, providerId, providerName, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post('/reviews', {
        bookingId,
        providerId,
        rating,
        comment
      });
      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to submit review:", err);
      setError(err.response?.data?.message || "Failed to submit review. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100 dark:border-gray-700">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Write a Review</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            How was your experience with <span className="font-semibold text-gray-900 dark:text-white">{providerName}</span>?
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Star Rating */}
            <div className="flex flex-col items-center space-y-2">
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`h-10 w-10 ${
                        star <= (hoverRating || rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300 dark:text-gray-600'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {rating === 0 ? "Select a rating" : 
                 rating === 1 ? "Terrible" : 
                 rating === 2 ? "Poor" : 
                 rating === 3 ? "Average" : 
                 rating === 4 ? "Very Good" : "Excellent!"}
              </span>
            </div>

            {/* Comment Box */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Share details of your experience <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="comment"
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="What went well? What could be improved?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || rating === 0}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
