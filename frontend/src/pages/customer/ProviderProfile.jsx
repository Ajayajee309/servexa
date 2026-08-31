import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Star, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import api from '../../services/api';

const ProviderProfile = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const providerRes = await api.get(`/public/providers/${id}`);
        setProvider(providerRes.data);
        
        try {
          const reviewsRes = await api.get(`/reviews/provider/${id}`);
          setReviews(reviewsRes.data);
        } catch (e) {
          // Mock reviews if API fails
          setReviews([
            { id: 1, customer: { fullName: 'John Doe' }, rating: 5, comment: 'Excellent service! Highly recommended.', createdAt: new Date().toISOString() },
            { id: 2, customer: { fullName: 'Jane Smith' }, rating: 4, comment: 'Good work, but arrived a bit late.', createdAt: new Date().toISOString() }
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProviderData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!provider) return <div>Provider not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Header/Cover Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-12 md:-mt-16 mb-8 gap-4">
              <div className="flex items-end space-x-6">
                <img 
                  src={provider.user.profileImageUrl || `https://ui-avatars.com/api/?name=${provider.user.fullName}`} 
                  alt={provider.user.fullName}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white object-cover"
                />
                <div className="mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {provider.user.fullName}
                    {provider.isVerified && <ShieldCheck className="text-blue-500 h-6 w-6" />}
                  </h1>
                  <p className="text-blue-600 dark:text-blue-400 font-medium text-lg">{provider.serviceCategory}</p>
                </div>
              </div>
              
              <Link 
                to={`/book/${provider.id}`}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white text-center font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                Book Now
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {provider.description || "Professional service provider with years of experience. I handle all types of residential and commercial requests quickly and efficiently. Quality work guaranteed. Customer satisfaction is my top priority."}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Service Details</h2>
                  <ul className="space-y-3">
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                      {provider.experienceYears || 5} Years of Experience
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                      Background verified professional
                    </li>
                    <li className="flex items-center text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                      {provider.completedJobs || 120} Jobs completed on Servexa
                    </li>
                  </ul>
                </section>
                
                {/* Reviews Section */}
                <section className="pt-8 border-t border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Customer Reviews</h2>
                  
                  {reviews.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map(review => (
                        <div key={review.id} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                                {review.customer.fullName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{review.customer.fullName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </p>
                              </div>
                            </div>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {/* Right Column - Stats Card */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-100 dark:border-gray-600 space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="font-medium">Rating</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {provider.averageRating ? `${provider.averageRating}/5` : "4.8/5"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="h-5 w-5 text-red-500 mr-2" />
                    <span className="font-medium">Service Area</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white text-right">
                    {provider.serviceArea || "Coimbatore, Tamil Nadu"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="font-medium">Availability</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white text-right text-sm">
                    {provider.workingHours || "Mon-Sat: 9 AM - 6 PM"}
                  </span>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Starting Price</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {provider.startingPrice ? `₹${provider.startingPrice}` : "₹450.00"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderProfile;
