import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Hero = () => {
  const [service, setService] = useState('');
  const [customService, setCustomService] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [location, setLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // List of major cities for fast autocomplete
    const cities = [
      "Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu", "Madurai, Tamil Nadu", 
      "Tiruchirappalli, Tamil Nadu", "Salem, Tamil Nadu", "Tirunelveli, Tamil Nadu", 
      "Tiruppur, Tamil Nadu", "Vellore, Tamil Nadu", "Erode, Tamil Nadu", 
      "Thoothukudi, Tamil Nadu", "Dindigul, Tamil Nadu", "Thanjavur, Tamil Nadu",
      "Ranipet, Tamil Nadu", "Nagercoil, Tamil Nadu", "Kancheepuram, Tamil Nadu",
      "Karur, Tamil Nadu", "Ooty, Tamil Nadu", "Hosur, Tamil Nadu",
      "Kanyakumari, Tamil Nadu", "Rameswaram, Tamil Nadu", "Kodaikanal, Tamil Nadu"
    ];

    const delayDebounceFn = setTimeout(() => {
      if (location.length > 0) { // Changed to > 0 so it works immediately
        setLocationLoading(true);
        const query = location.toLowerCase();
        
        // Filter cities that contain the query
        const matches = cities.filter(city => 
          city.toLowerCase().includes(query)
        );
        
        // If the location exactly matches a city, don't show the dropdown
        if (matches.length === 1 && matches[0].toLowerCase() === query) {
           setLocationSuggestions([]);
           setShowLocationDropdown(false);
        } else {
           setLocationSuggestions(matches.slice(0, 5)); // Limit to 5
           setShowLocationDropdown(true);
        }
        
        setLocationLoading(false);
      } else {
        setLocationSuggestions([]);
        setShowLocationDropdown(false);
      }
    }, 200); // Reduced debounce time for faster feel

    return () => clearTimeout(delayDebounceFn);
  }, [location]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (service === 'Others') {
      if (!customService || !preferredDate || !preferredTime) {
        alert("Please fill all custom request fields including Date and Time.");
        return;
      }
      try {
        await api.post('/custom-requests', {
          requestedService: customService,
          location: location,
          preferredDate: preferredDate,
          preferredTime: preferredTime
        });
        alert("Your custom request has been submitted to the Admin. We will contact you soon!");
        setCustomService('');
        setPreferredDate('');
        setPreferredTime('');
        setLocation('');
        setService('');
      } catch (error) {
        console.error("Failed to submit custom request:", error);
        alert("Failed to submit request. Please make sure you are logged in as a Customer.");
      }
    } else {
      if (service || location) {
        navigate(`/providers?service=${encodeURIComponent(service)}&location=${encodeURIComponent(location)}`);
      }
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white dark:bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-10 sm:pt-16 lg:pt-20">
          
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Find Trusted Local </span>
                <span className="block text-blue-600 dark:text-blue-500 xl:inline">Professionals Near You</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Book reliable home services quickly, safely and conveniently. From plumbing to cleaning, we've got you covered.
              </p>
              
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                  <form onSubmit={handleSearch} className="flex flex-col gap-3">
                    {/* Top Row: Service Dropdown, Location, Submit Button */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Service Dropdown */}
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                          className="block w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors appearance-none cursor-pointer"
                        >
                          <option value="">What service do you need?</option>
                          <option value="Plumbing">Plumbing</option>
                          <option value="Electrical">Electrical</option>
                          <option value="Cleaning">Cleaning</option>
                          <option value="Carpentry">Carpentry</option>
                          <option value="Painting">Painting</option>
                          <option value="Appliance Repair">Appliance Repair</option>
                          <option value="Pest Control">Pest Control</option>
                          <option value="Home Shifting">Home Shifting</option>
                          <option value="Others">Others</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>

                      {/* Location Input */}
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          onFocus={() => {
                            if (locationSuggestions.length > 0) setShowLocationDropdown(true);
                          }}
                          onBlur={() => {
                            setTimeout(() => setShowLocationDropdown(false), 200);
                          }}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                          placeholder="Location"
                        />
                        {showLocationDropdown && (
                          <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 max-h-60 overflow-auto">
                            {locationLoading ? (
                              <div className="px-4 py-3 text-sm text-gray-500 flex justify-center items-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                  Loading...
                              </div>
                            ) : locationSuggestions.length > 0 ? (
                              locationSuggestions.map((suggestion, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 text-sm text-gray-700 dark:text-gray-200 flex items-center transition-colors border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setLocation(suggestion);
                                    setShowLocationDropdown(false);
                                  }}
                                >
                                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                  {suggestion}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500 text-center">No locations found</div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
                      >
                        {service === 'Others' ? 'Submit Request' : 'Search'}
                      </button>
                    </div>

                    {/* Bottom Row: Custom Service Fields (Only visible if Others) */}
                    {service === 'Others' && (
                      <div className="flex flex-col sm:flex-row gap-3 w-full mt-1 animate-fade-in-down">
                        <input
                          type="text"
                          value={customService}
                          onChange={(e) => setCustomService(e.target.value)}
                          className="block w-full sm:flex-grow px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                          placeholder="Type your custom service..."
                          required
                        />
                        <div className="flex gap-2 sm:w-1/2">
                          <input
                            type="date"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="block w-1/2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors"
                            required
                          />
                          <input
                            type="time"
                            value={preferredTime}
                            onChange={(e) => setPreferredTime(e.target.value)}
                            className="block w-1/2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm transition-colors"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50 dark:bg-gray-800">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full opacity-90 dark:opacity-75 mix-blend-multiply dark:mix-blend-overlay"
          src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
          alt="Professional working"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 lg:block hidden"></div>
      </div>
    </div>
  );
};

export default Hero;
