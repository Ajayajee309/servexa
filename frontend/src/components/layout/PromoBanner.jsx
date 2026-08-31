import React, { useState, useEffect } from 'react';
import { Gift, X } from 'lucide-react';
import api from '../../services/api';

const PromoBanner = () => {
  const [offer, setOffer] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchActiveOffers = async () => {
      try {
        const res = await api.get('/offers/active');
        if (res.data && res.data.length > 0) {
          setOffer(res.data[0]); // Just pick the first active offer
        }
      } catch (err) {
        console.error('Error fetching offers:', err);
      }
    };
    fetchActiveOffers();
  }, []);

  if (!offer || !isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
        <div className="absolute top-20 right-20 w-60 h-60 rounded-full bg-white blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="pr-16 sm:text-center sm:px-16">
          <p className="font-medium text-white flex items-center justify-center flex-wrap gap-2">
            <span className="flex p-2 rounded-lg bg-white/20">
              <Gift className="h-5 w-5 text-white animate-bounce" aria-hidden="true" />
            </span>
            <span className="hidden md:inline font-bold text-lg">{offer.title}:</span>
            <span className="block sm:ml-2 sm:inline-block">
              {offer.description}. Use code <span className="font-bold bg-white text-pink-600 px-2 py-0.5 rounded uppercase tracking-wider">{offer.promoCode}</span> for {offer.discountPercentage}% OFF!
            </span>
          </p>
        </div>
        <div className="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start">
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="flex p-2 rounded-md hover:bg-white/20 focus:outline-none transition-colors"
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-5 w-5 text-white" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
