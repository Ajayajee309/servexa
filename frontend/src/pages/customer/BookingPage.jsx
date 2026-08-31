import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Calendar, Clock, MapPin, AlignLeft, Info, Loader2 } from 'lucide-react';
import MultiImageUpload from '../../components/common/MultiImageUpload';

const BookingPage = () => {
  const { providerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    bookingDate: '',
    time: '',
    serviceAddress: user?.address || '',
    applianceType: '',
    problemDescription: '',
  });
  
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [customerPhotos, setCustomerPhotos] = useState([]);
  
  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(null); // { code, discount }

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProvider = async () => {
      try {
        const res = await api.get(`/public/providers/${providerId}`);
        setProvider(res.data);
      } catch (err) {
        console.error("Failed to fetch provider details");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setPromoError('');
    try {
      const res = await api.get(`/offers/validate?code=${promoCode}`);
      setPromoApplied(res.data);
      setPromoError('');
    } catch (err) {
      setPromoError('Invalid or expired promo code');
      setPromoApplied(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Create ISO string for datetime
      const dateTimeString = `${formData.bookingDate}T${formData.time}:00`;
      
      const finalDescription = provider.serviceCategory === 'Appliance Repair' && formData.applianceType
        ? `[Appliance: ${formData.applianceType}]\n\n${formData.problemDescription}`
        : formData.problemDescription;

      await api.post('/bookings', {
        providerId: parseInt(providerId),
        bookingDate: dateTimeString,
        serviceAddress: formData.serviceAddress,
        problemDescription: finalDescription,
        customerPhotos: customerPhotos,
        promoCode: promoApplied ? promoApplied.promoCode : null,
      });
      
      // Success, redirect to dashboard
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-blue-600 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold">Book Service</h1>
            <p className="mt-2 text-blue-100">
              You are booking <span className="font-semibold text-white">{provider.serviceCategory}</span> service with <span className="font-semibold text-white">{provider.user.fullName}</span>.
            </p>
          </div>
          
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-md">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="bookingDate"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.bookingDate}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-3"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="serviceAddress"
                    required
                    rows="2"
                    value={formData.serviceAddress}
                    onChange={handleChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-3"
                    placeholder="Where do you need the service?"
                  />
                </div>
              </div>

              {provider?.serviceCategory === 'Appliance Repair' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Appliance Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="applianceType"
                      required
                      value={formData.applianceType}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full px-4 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-3"
                      placeholder="E.g., AC, Fridge, Washing Machine, TV"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Specifying the appliance helps the provider bring the right tools.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Problem Description</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                    <AlignLeft className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="problemDescription"
                    required
                    rows="4"
                    value={formData.problemDescription}
                    onChange={handleChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-3"
                    placeholder="Please describe the issue in detail..."
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <MultiImageUpload 
                  label="Add Photos of the Problem (Optional)" 
                  value={customerPhotos}
                  onChange={setCustomerPhotos}
                  maxImages={3}
                />
              </div>

              {/* Promo Code Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Have a Promo Code?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g. PONGAL20)"
                    disabled={promoApplied || submitting}
                    className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 border focus:ring-blue-500 focus:border-blue-500 uppercase disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={promoApplied ? () => { setPromoApplied(null); setPromoCode(''); } : handleApplyPromo}
                    disabled={submitting || (!promoCode && !promoApplied)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      promoApplied 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    } disabled:opacity-50`}
                  >
                    {promoApplied ? 'Remove' : 'Apply'}
                  </button>
                </div>
                {promoApplied && <p className="text-xs text-green-600 mt-1 font-semibold">{promoApplied.discountPercentage}% OFF applied! The discount will be calculated on your final bill.</p>}
                {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Estimated Cost</h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                      <p>
                        The starting price for this service is <span className="font-bold">₹{provider.startingPrice || "450"}</span>. The final price will be determined after inspection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 py-3 px-6 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none mr-4 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 py-3 px-8 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center transition-colors"
                >
                  {submitting && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage;
