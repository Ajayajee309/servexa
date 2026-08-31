import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Clock3, MessageSquare, Navigation, Star, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import Chat from '../../components/chat/Chat';
import LiveTracker from '../../components/tracking/LiveTracker';
import ReviewModal from '../../components/reviews/ReviewModal';
import BookingDetailsModal from '../../components/bookings/BookingDetailsModal';
import PaymentModal from '../../components/bookings/PaymentModal';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null); // { bookingId, receiverId, receiverName }
  const [activeTracking, setActiveTracking] = useState(null); // { bookingId, providerName }
  const [activeReview, setActiveReview] = useState(null); // { bookingId, providerId, providerName }
  const [activePayment, setActivePayment] = useState(null); // booking object
  const [activeDetails, setActiveDetails] = useState(null); // booking object
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
  const [hiddenBookings, setHiddenBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/my');
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
        // Fallback mock data if API fails
        setBookings([
          {
            id: 1,
            provider: { user: { fullName: 'Ravi Kumar' } },
            service: { name: 'Plumbing' },
            bookingDate: '2023-11-20T10:00:00',
            status: 'PENDING',
            estimatedCost: 45.0
          },
          {
            id: 2,
            provider: { user: { fullName: 'Anita Sharma' } },
            service: { name: 'Cleaning' },
            bookingDate: '2023-11-15T14:30:00',
            status: 'COMPLETED',
            estimatedCost: 60.0
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await api.put(`/bookings/${id}/status?status=CANCELLED`);
        // Refresh bookings
        const response = await api.get('/bookings/my');
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to cancel booking', error);
        alert('Failed to cancel booking. Please try again later.');
        // Optimistic update for UI if backend fails during dev
        setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"><Clock3 className="w-3 h-3 mr-1" /> Pending</span>;
      case 'ACCEPTED':
      case 'ON_THE_WAY':
      case 'STARTED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">In Progress</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="w-3 h-3 mr-1" /> Completed</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"><XCircle className="w-3 h-3 mr-1" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const hideBooking = (id) => {
    setHiddenBookings([...hiddenBookings, id]);
  };

  const visibleBookings = bookings.filter(b => !hiddenBookings.includes(b.id));
  const activeBookings = visibleBookings.filter(b => ['PENDING', 'ACCEPTED', 'ON_THE_WAY', 'STARTED'].includes(b.status));
  const historyBookings = visibleBookings.filter(b => ['COMPLETED', 'CANCELLED'].includes(b.status));
  const displayBookings = activeTab === 'active' ? activeBookings : historyBookings;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your service bookings.</p>
          </div>
          <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            Book New Service
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-0 border-b border-gray-100 dark:border-gray-700 flex space-x-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-5 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'active' 
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Active Bookings
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-5 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'history' 
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Booking History
            </button>
          </div>
          
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : displayBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No bookings found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {activeTab === 'active' ? "You don't have any active bookings." : "You don't have any past bookings."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {displayBookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors relative">
                  {booking.status === 'CANCELLED' && (
                    <button 
                      onClick={() => hideBooking(booking.id)}
                      className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Dismiss from dashboard"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-8">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 truncate">
                          {booking.service?.name || booking.provider.serviceCategory} Service
                        </p>
                        {getStatusBadge(booking.status)}
                      </div>
                      
                      <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6 gap-y-2">
                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium text-gray-900 dark:text-gray-200 mr-2">Provider:</span>
                          {booking.provider.user.fullName}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {formatDate(booking.bookingDate)}
                        </div>
                          {booking.status === 'COMPLETED' && booking.finalPrice ? (
                            <span className="text-green-600 dark:text-green-400 font-bold ml-4">
                              Final Bill: ₹{booking.finalPrice}
                            </span>
                          ) : booking.estimatedCost ? (
                            <span className="text-gray-900 dark:text-white font-medium ml-4">
                              Est. ₹{booking.estimatedCost}
                            </span>
                          ) : null}
                        <div className="mt-2">
                          <button
                            onClick={() => setActiveDetails(booking)}
                            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                          >
                            <Info className="h-4 w-4 mr-1" /> View Details
                          </button>
                        </div>

                        {booking.status === 'PENDING' && (
                          <div className="mt-2 flex items-center gap-4">
                            <button
                              onClick={() => cancelBooking(booking.id)}
                              className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Cancel Booking
                            </button>
                          </div>
                        )}

                        {booking.status === 'ACCEPTED' || booking.status === 'ON_THE_WAY' || booking.status === 'STARTED' ? (
                          <div className="mt-2 flex items-center gap-4">
                            <button
                              onClick={() => setActiveChat({
                                bookingId: booking.id,
                                receiverId: booking.provider.user.id,
                                receiverName: booking.provider.user.fullName
                              })}
                              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <MessageSquare className="h-4 w-4 mr-1" /> Message Provider
                            </button>
                            <button
                              onClick={() => setActiveTracking({
                                bookingId: booking.id,
                                providerName: booking.provider.user.fullName
                              })}
                              className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <Navigation className="h-4 w-4 mr-1" /> Track Provider
                            </button>
                          </div>
                        ) : booking.status === 'COMPLETED' ? (
                          <div className="mt-2 flex items-center gap-4">
                            {booking.paymentStatus === 'PAID' ? (
                              <>
                                <span className="flex items-center text-sm font-bold text-green-600 dark:text-green-400">
                                  <CheckCircle className="h-4 w-4 mr-1" /> Paid
                                </span>
                                <button
                                  onClick={() => setActiveReview({
                                    bookingId: booking.id,
                                    providerId: booking.provider.id,
                                    providerName: booking.provider.user.fullName
                                  })}
                                  className="flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                                >
                                  <Star className="h-4 w-4 mr-1" /> Write Review
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setActivePayment(booking)}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-colors"
                              >
                                Pay Now (₹{booking.finalPrice})
                              </button>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {activeChat && (
        <Chat
          bookingId={activeChat.bookingId}
          receiverId={activeChat.receiverId}
          receiverName={activeChat.receiverName}
          onClose={() => setActiveChat(null)}
        />
      )}

      {activeTracking && (
        <LiveTracker
          bookingId={activeTracking.bookingId}
          providerName={activeTracking.providerName}
          onClose={() => setActiveTracking(null)}
        />
      )}

      {activeReview && (
        <ReviewModal
          bookingId={activeReview.bookingId}
          providerId={activeReview.providerId}
          providerName={activeReview.providerName}
          onClose={() => setActiveReview(null)}
          onSuccess={() => alert("Thank you for your review!")}
        />
      )}

      {activeDetails && (
        <BookingDetailsModal
          booking={activeDetails}
          userRole="CUSTOMER"
          onClose={() => setActiveDetails(null)}
        />
      )}

      {activePayment && (
        <PaymentModal
          booking={activePayment}
          onClose={() => setActivePayment(null)}
          onSuccess={() => {
            setActivePayment(null);
            const fetchBookings = async () => {
              try {
                const response = await api.get('/bookings/my');
                setBookings(response.data);
              } catch (error) {
                console.error(error);
              }
            };
            fetchBookings();
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default CustomerDashboard;
