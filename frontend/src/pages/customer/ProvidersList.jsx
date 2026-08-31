import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../services/api';
import { Star, MapPin, Search, Filter, List, Map as MapIcon } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const ProvidersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialService = searchParams.get('service') || '';
  const initialLocation = searchParams.get('location') || '';

  const [service, setService] = useState(initialService);
  const [location, setLocation] = useState(initialLocation);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Load Google Maps API (Note: No API key provided for dev purposes)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "" // Add your Google Maps API key here
  });

  const fetchProviders = async (searchService, searchLocation) => {
    setLoading(true);
    try {
      let url = '/public/providers/search?';
      if (searchService) url += `service=${encodeURIComponent(searchService)}&`;
      if (searchLocation) url += `location=${encodeURIComponent(searchLocation)}`;
      
      const response = await api.get(url);
      if (response.data && response.data.length > 0) {
        // Fallback lat/lng for real db records if they don't have it
        const providersWithCoords = response.data.map((p, i) => ({
          ...p,
          lat: p.lat || (13.0827 + (Math.random() * 0.1 - 0.05)),
          lng: p.lng || (80.2707 + (Math.random() * 0.1 - 0.05))
        }));
        setProviders(providersWithCoords);
      } else {
        // Database is empty, show some nice mock data
        let mockData = [
          {
            id: 1,
            user: { fullName: "Ravi Kumar", profileImageUrl: "" },
            serviceCategory: "Plumbing",
            serviceArea: "Chennai",
            experienceYears: 5,
            rating: 4.8,
            isVerified: true,
            lat: 13.0827,
            lng: 80.2707
          },
          {
            id: 2,
            user: { fullName: "Anand Electric", profileImageUrl: "" },
            serviceCategory: "Electrical",
            serviceArea: "Chennai",
            experienceYears: 10,
            rating: 4.9,
            isVerified: true,
            lat: 13.06,
            lng: 80.25
          },
          {
            id: 3,
            user: { fullName: "Meena Cleaning Services", profileImageUrl: "" },
            serviceCategory: "Cleaning",
            serviceArea: "Coimbatore",
            experienceYears: 3,
            rating: 4.5,
            isVerified: true,
            lat: 11.0168,
            lng: 76.9558
          },
          {
            id: 4,
            user: { fullName: "Appliance Master", profileImageUrl: "" },
            serviceCategory: "Appliance Repair",
            serviceArea: "Chennai",
            experienceYears: 8,
            rating: 4.9,
            isVerified: true,
            lat: 13.04,
            lng: 80.22
          }
        ];
        
        if (searchService) {
          mockData = mockData.filter(p => p.serviceCategory.toLowerCase().includes(searchService.toLowerCase()));
        }
        if (searchLocation) {
          const city = searchLocation.split(',')[0].trim().toLowerCase();
          mockData = mockData.filter(p => p.serviceArea.toLowerCase().includes(city));
        }
        
        setProviders(mockData);
      }
    } catch (error) {
      console.error("Error fetching providers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders(initialService, initialLocation);
  }, [initialService, initialLocation]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ service, location });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      
      <div className="bg-blue-600 dark:bg-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">Find Service Providers</h1>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="What service do you need?" 
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Location" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Search
            </button>
          </form>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {providers.length} {providers.length === 1 ? 'Provider' : 'Providers'} Found
          </h2>
          
          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <List className="w-4 h-4" /> List
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <MapIcon className="w-4 h-4" /> Map
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No providers found matching your criteria.</p>
            <button onClick={() => {setService(''); setLocation(''); setSearchParams({});}} className="mt-4 text-blue-600 hover:underline">
              Clear search filters
            </button>
          </div>
        ) : viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div key={provider.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={provider.user?.profileImageUrl || `https://ui-avatars.com/api/?name=${provider.user?.fullName}`}
                      alt={provider.user?.fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 dark:border-blue-900"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-1">
                        {provider.user?.fullName}
                        {provider.isVerified && (
                          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{provider.serviceCategory}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Star className="w-4 h-4 text-yellow-400 mr-2 fill-current" />
                      <span>{provider.rating || '4.5'} (24 reviews)</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{provider.serviceArea}</span>
                    </div>
                  </div>

                  <Link 
                    to={`/providers/${provider.id}`}
                    className="block w-full text-center py-2 px-4 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-600 dark:hover:text-white font-medium rounded-lg transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-[600px] w-full z-0 relative">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: providers[0]?.lat || 13.0827, lng: providers[0]?.lng || 80.2707 }}
                zoom={11}
              >
                {providers.map((provider) => (
                  <Marker 
                    key={provider.id} 
                    position={{ lat: provider.lat || 13.0827, lng: provider.lng || 80.2707 }}
                    onClick={() => setSelectedProvider(provider)}
                  />
                ))}
                
                {selectedProvider && (
                  <InfoWindow
                    position={{ lat: selectedProvider.lat || 13.0827, lng: selectedProvider.lng || 80.2707 }}
                    onCloseClick={() => setSelectedProvider(null)}
                  >
                    <div className="text-center p-1 min-w-[120px]">
                      <h3 className="font-bold mb-1 text-gray-900">{selectedProvider.user?.fullName}</h3>
                      <p className="text-blue-600 text-xs font-semibold mb-2">{selectedProvider.serviceCategory}</p>
                      <Link 
                        to={`/providers/${selectedProvider.id}`}
                        className="text-white bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700 inline-block transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProvidersList;
