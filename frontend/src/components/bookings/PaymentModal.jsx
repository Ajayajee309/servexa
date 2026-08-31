import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, CheckCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';

const PaymentModal = ({ booking, onClose, onSuccess }) => {
  const [method, setMethod] = useState('UPI'); // 'UPI' or 'CARD'
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  if (!booking) return null;

  const amountToPay = booking.finalPrice.toFixed(2);

  const handlePay = () => {
    setProcessing(true);
    
    // Simulate payment processing time
    setTimeout(async () => {
      try {
        await api.put(`/bookings/${booking.id}/payment?paymentStatus=PAID`);
        setProcessing(false);
        setSuccess(true);
        
        // Auto close after 2 seconds on success
        setTimeout(() => {
          onSuccess(booking.id);
        }, 2000);
      } catch (error) {
        console.error('Payment failed', error);
        setProcessing(false);
        alert('Payment failed. Please try again.');
      }
    }, 2500); // 2.5 seconds fake processing
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900/75" onClick={!processing && !success ? onClose : undefined} />

        <div className="relative inline-block w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          
          {success ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6 animate-bounce">
                <CheckCircle className="h-14 w-14 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
              <p className="text-gray-500 dark:text-gray-400">₹{amountToPay} paid successfully to {booking.provider.user.fullName}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5 border-b border-gray-100 dark:border-gray-700 pb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Complete Payment
                </h3>
                {!processing && (
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-500 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Final Bill Amount</p>
                {booking.discountPercentage > 0 ? (
                  <div className="flex flex-col items-center">
                    <p className="text-4xl font-bold text-green-600 dark:text-green-400">₹{amountToPay}</p>
                    <p className="text-xs text-green-600 mt-1 font-semibold">{booking.discountPercentage}% OFF promo applied during booking!</p>
                  </div>
                ) : (
                  <p className="text-4xl font-bold text-blue-800 dark:text-blue-300">₹{amountToPay}</p>
                )}
              </div>



              <div className="space-y-4 mb-8">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Payment Method</p>
                
                <div 
                  onClick={() => !processing && setMethod('UPI')}
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                    method === 'UPI' 
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-500' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-4 ${method === 'UPI' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${method === 'UPI' ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>UPI (GPay, PhonePe)</p>
                    <p className="text-xs text-gray-500">Pay directly from your bank account</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'UPI' ? 'border-blue-500' : 'border-gray-300'}`}>
                    {method === 'UPI' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                </div>

                <div 
                  onClick={() => !processing && setMethod('CARD')}
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                    method === 'CARD' 
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-500' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-4 ${method === 'CARD' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${method === 'CARD' ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>Credit / Debit Card</p>
                    <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'CARD' ? 'border-blue-500' : 'border-gray-300'}`}>
                    {method === 'CARD' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={processing}
                className="w-full inline-flex justify-center items-center px-4 py-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${amountToPay} securely`
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
