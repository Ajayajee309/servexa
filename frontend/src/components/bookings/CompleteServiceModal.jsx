import React, { useState } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import MultiImageUpload from '../common/MultiImageUpload';
import api from '../../services/api';

const CompleteServiceModal = ({ booking, onClose, onSuccess }) => {
  const [photos, setPhotos] = useState([]);
  const [finalPrice, setFinalPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      let url = `/bookings/${booking.id}/complete-with-photos`;
      if (finalPrice && !isNaN(finalPrice)) {
        url += `?finalPrice=${finalPrice}`;
      }
      await api.post(url, photos);
      onSuccess(booking.id);
    } catch (err) {
      console.error('Failed to complete booking', err);
      setError('Failed to mark service as completed. Please try again.');
      setSubmitting(false);
    }
  };

  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900/75" onClick={onClose} />

        <div className="relative inline-block w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Complete Service
            </h3>
            <button
              onClick={onClose}
              disabled={submitting}
              className="p-2 text-gray-400 hover:text-gray-500 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You are marking the service for <strong>{booking.customer.fullName}</strong> as completed.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Final Bill Amount (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 font-medium">₹</span>
                <input
                  type="number"
                  required
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                This amount will be shown to the customer as the final payable amount.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
              <MultiImageUpload 
                label="Add Completion Photos (Optional)"
                value={photos}
                onChange={setPhotos}
                maxImages={5}
              />
              <p className="text-xs text-gray-500 mt-2">
                Uploading photos of your completed work builds trust and helps resolve any future disputes.
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !finalPrice}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Confirm Completion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteServiceModal;
