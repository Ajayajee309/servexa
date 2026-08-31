import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Calendar, MapPin, CheckCircle, XCircle, Clock3, Loader2, MessageSquare, Info } from 'lucide-react';
import Chat from '../../components/chat/Chat';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import BookingDetailsModal from '../../components/bookings/BookingDetailsModal';
import CompleteServiceModal from '../../components/bookings/CompleteServiceModal';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [activeDetails, setActiveDetails] = useState(null);
  const [activeComplete, setActiveComplete] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
  const [hiddenBookings, setHiddenBookings] = useState([]);
  
  // Availability state
  const [isAvailable, setIsAvailable] = useState(true);
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  
  // Location sharing state
  const [sharingLocationFor, setSharingLocationFor] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const watchIdRef = React.useRef(null);

  useEffect(() => {
    fetchBookings();
    fetchProfile();
    
    // Setup WebSocket connection for location sharing
    const socket = new SockJS('http://localhost:8088/ws');
    const client = Stomp.over(socket);
    client.debug = () => {};
    client.connect({}, () => {
      setStompClient(client);
    });

    return () => {
      if (client) client.disconnect();
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const toggleLocationSharing = (bookingId) => {
    if (sharingLocationFor === bookingId) {
      // Stop sharing
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        clearInterval(watchIdRef.current); // In case it's a simulated interval
        watchIdRef.current = null;
      }
      setSharingLocationFor(null);
    } else {
      // Start sharing
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        clearInterval(watchIdRef.current);
      }
      setSharingLocationFor(bookingId);
      
      if ("geolocation" in navigator) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            if (stompClient) {
              const locationData = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                timestamp: Date.now()
              };
              stompClient.send(`/topic/location/${bookingId}`, {}, JSON.stringify(locationData));
            }
          },
          (error) => {
            console.error("Error watching position, falling back to simulated location for demo: ", error);
            
            // SIMULATED LOCATION FOR DEMO PURPOSES
            // If GPS fails (e.g. on desktop without HTTPS or location blocked), we simulate a moving provider
            let currentLat = 13.0827; // Chennai 
            let currentLng = 80.2707;
            
            // Send initial location
            if (stompClient) {
               stompClient.send(`/topic/location/${bookingId}`, {}, JSON.stringify({ lat: currentLat, lng: currentLng, timestamp: Date.now() }));
            }
            
            // Create a setInterval to simulate movement
            const simInterval = setInterval(() => {
              currentLat += 0.0001; // move slightly north
              currentLng += 0.0001; // move slightly east
              if (stompClient) {
                stompClient.send(`/topic/location/${bookingId}`, {}, JSON.stringify({
                  lat: currentLat,
                  lng: currentLng,
                  timestamp: Date.now()
                }));
              }
            }, 2000);
            
            // Store the interval ID in watchIdRef so it can be cleared when stopping sharing
            watchIdRef.current = simInterval;
            
            // Alert user we are using simulation
            alert("Real GPS location failed. Using simulated live tracking for Demo purposes.");
          },
          { enableHighAccuracy: false, maximumAge: 10000, timeout: 10000 }
        );
      } else {
        alert("Geolocation is not supported by your browser");
      }
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/provider/profile/me');
      setIsAvailable(response.data.available);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    }
  };

  const handleToggleAvailability = async () => {
    setTogglingAvailability(true);
    try {
      const newStatus = !isAvailable;
      await api.put(`/provider/profile/availability?isAvailable=${newStatus}`);
      setIsAvailable(newStatus);
    } catch (error) {
      console.error('Failed to toggle availability', error);
      alert('Failed to update availability status');
    } finally {
      setTogglingAvailability(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
      // Mock data
      setBookings([
        {
          id: 1,
          customer: { fullName: 'Alex Johnson' },
          service: { name: 'Plumbing' },
          bookingDate: '2023-11-20T10:00:00',
          serviceAddress: '123 Main St, NY',
          problemDescription: 'Leaking pipe under the sink',
          status: 'PENDING',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      await api.put(`/bookings/${id}/status?status=${newStatus}`);
      fetchBookings();
    } catch (error) {
      console.error('Failed to update status', error);
      // Optimistic update for mock
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"><Clock3 className="w-3 h-3 mr-1" /> Pending Request</span>;
      case 'ACCEPTED':
      case 'ON_THE_WAY':
      case 'STARTED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">In Progress</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="w-3 h-3 mr-1" /> Completed</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"><XCircle className="w-3 h-3 mr-1" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
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
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Provider Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your incoming service requests and active jobs.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Availability Toggle */}
            <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 shadow-sm">
              <span className={`text-sm font-medium mr-3 ${isAvailable ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {isAvailable ? 'Online' : 'Offline'}
              </span>
              <button 
                onClick={handleToggleAvailability}
                disabled={togglingAvailability}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isAvailable ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'} ${togglingAvailability ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="sr-only">Toggle availability</span>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <button
              onClick={() => window.location.href = '/provider/profile'}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              Edit Profile
            </button>
          </div>
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
              Active Jobs
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-5 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'history' 
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Job History
            </button>
          </div>
          
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : displayBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No requests found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {activeTab === 'active' ? "You don't have any active service requests." : "Your job history is empty."}
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
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                          Customer: {booking.customer.fullName}
                        </h4>
                        {getStatusBadge(booking.status)}
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                          <div>
                            <span className="block font-medium text-gray-900 dark:text-white">Date & Time</span>
                            {formatDate(booking.bookingDate)}
                          </div>
                        </div>
                        <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                          <div>
                            <span className="block font-medium text-gray-900 dark:text-white">Service Address</span>
                            {booking.serviceAddress}
                          </div>
                        </div>
                        <div className="flex items-start text-sm text-gray-600 dark:text-gray-300 mt-4">
                          <button
                            onClick={() => setActiveDetails(booking)}
                            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-white transition-colors"
                          >
                            <Info className="h-4 w-4 mr-1" /> View Booking Details & Photos
                          </button>
                        </div>
                      </div>

                      {booking.problemDescription && (
                        <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Problem Description</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{booking.problemDescription}</p>
                        </div>
                      )}

                      {booking.status === 'COMPLETED' && (
                        <div className="mt-4 flex items-center">
                          {booking.paymentStatus === 'PAID' ? (
                            <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                              <CheckCircle className="w-4 h-4 mr-2" /> Payment Received (₹{booking.finalPrice})
                            </div>
                          ) : (
                            <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                              <Clock3 className="w-4 h-4 mr-2" /> Payment Pending (₹{booking.finalPrice})
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-row lg:flex-col gap-3 min-w-[140px]">
                      {(booking.status === 'ACCEPTED' || booking.status === 'ON_THE_WAY' || booking.status === 'STARTED') && (
                        <>
                          <button
                            onClick={() => setActiveChat({
                              bookingId: booking.id,
                              receiverId: booking.customer.id, 
                              receiverName: booking.customer.fullName
                            })}
                            className="flex-1 lg:w-full inline-flex justify-center items-center px-4 py-2 border border-blue-600 rounded-lg shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none transition-colors"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" /> Message
                          </button>
                          
                          <button
                            onClick={() => toggleLocationSharing(booking.id)}
                            className={`flex-1 lg:w-full inline-flex justify-center items-center px-4 py-2 border rounded-lg shadow-sm text-sm font-medium focus:outline-none transition-colors ${
                              sharingLocationFor === booking.id 
                                ? 'border-red-600 text-red-600 bg-white hover:bg-red-50' 
                                : 'border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50'
                            }`}
                          >
                            <MapPin className="h-4 w-4 mr-2" /> 
                            {sharingLocationFor === booking.id ? 'Stop Sharing' : 'Share Location'}
                          </button>
                        </>
                      )}
                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateStatus(booking.id, 'ACCEPTED')}
                            disabled={updating === booking.id}
                            className="flex-1 lg:w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors"
                          >
                            {updating === booking.id ? <Loader2 className="animate-spin h-4 w-4" /> : 'Accept Job'}
                          </button>
                          <button
                            onClick={() => updateStatus(booking.id, 'CANCELLED')}
                            disabled={updating === booking.id}
                            className="flex-1 lg:w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'ACCEPTED' && (
                        <button
                          onClick={() => setActiveComplete(booking)}
                          className="flex-1 lg:w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors"
                        >
                          Mark Completed
                        </button>
                      )}
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

      {activeDetails && (
        <BookingDetailsModal
          booking={activeDetails}
          userRole="PROVIDER"
          onClose={() => setActiveDetails(null)}
        />
      )}

      {activeComplete && (
        <CompleteServiceModal
          booking={activeComplete}
          onClose={() => setActiveComplete(null)}
          onSuccess={(id) => {
            setActiveComplete(null);
            if(sharingLocationFor === id) toggleLocationSharing(id);
            fetchBookings();
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default ProviderDashboard;
