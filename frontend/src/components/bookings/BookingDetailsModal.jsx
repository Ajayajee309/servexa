import React from 'react';
import { X, Calendar, MapPin, AlignLeft, User, Briefcase, Camera } from 'lucide-react';

const BookingDetailsModal = ({ booking, userRole, onClose }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900/75" onClick={onClose} />

        <div className="relative inline-block w-full max-w-2xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Booking #{booking.id} Details
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" /> Date & Time
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(booking.bookingDate).toLocaleString()}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                  {userRole === 'CUSTOMER' ? <Briefcase className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
                  {userRole === 'CUSTOMER' ? 'Provider' : 'Customer'}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {userRole === 'CUSTOMER' 
                    ? booking.provider?.user?.fullName 
                    : booking.customer?.fullName}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl md:col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" /> Service Address
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {booking.serviceAddress}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl md:col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                  <AlignLeft className="w-4 h-4 mr-2" /> Problem Description
                </p>
                <p className="font-medium text-gray-900 dark:text-white whitespace-pre-wrap">
                  {booking.problemDescription}
                </p>
              </div>

              {booking.finalPrice && (
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl md:col-span-2 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-400 mb-1 font-medium">
                    Final Bill Amount
                  </p>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                    ₹{booking.finalPrice}
                  </p>
                </div>
              )}
            </div>

            {/* Photos Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center">
                <Camera className="w-5 h-5 mr-2 text-blue-500" /> Booking Photos
              </h4>

              {/* Customer Photos */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Problem Photos (by Customer)
                </p>
                {booking.customerPhotos && booking.customerPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {booking.customerPhotos.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 hover:opacity-90 transition-opacity">
                        <img src={url} alt={`Customer upload ${i + 1}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    No photos were uploaded by the customer during booking.
                  </p>
                )}
              </div>

              {/* Provider Photos */}
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Completion Photos (by Provider)
                </p>
                {booking.providerPhotos && booking.providerPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {booking.providerPhotos.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 hover:opacity-90 transition-opacity">
                        <img src={url} alt={`Provider upload ${i + 1}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                    {booking.status === 'COMPLETED' 
                      ? 'No completion photos were provided.' 
                      : 'Service is not yet completed.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
