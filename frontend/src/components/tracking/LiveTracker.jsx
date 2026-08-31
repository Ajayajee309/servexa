import React, { useState, useEffect } from 'react';
import { X, Navigation } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Custom car icon for provider
const customMarker = {
  path: "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-12.506L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z",
  fillColor: "#2563eb",
  fillOpacity: 1,
  strokeWeight: 0,
  rotation: 0,
  scale: 1,
  anchor: { x: 11.5, y: 23 } // center of car
};

const LiveTracker = ({ bookingId, providerName, onClose }) => {
  // Default to a central location if no live data is received yet
  const [providerLocation, setProviderLocation] = useState({ lat: 13.0827, lng: 80.2707 });
  const [stompClient, setStompClient] = useState(null);
  const [isReceiving, setIsReceiving] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "" // Add your Google Maps API key here
  });

  useEffect(() => {
    // Connect to WebSocket
    const socket = new SockJS('http://localhost:8088/ws');
    const client = Stomp.over(socket);
    client.debug = () => {}; // Disable debug logging
    
    client.connect({}, () => {
      setStompClient(client);
      
      // Subscribe to provider's live location channel
      client.subscribe(`/topic/location/${bookingId}`, (message) => {
        const receivedLocation = JSON.parse(message.body);
        if (receivedLocation && receivedLocation.lat && receivedLocation.lng) {
          setProviderLocation({
            lat: parseFloat(receivedLocation.lat),
            lng: parseFloat(receivedLocation.lng)
          });
          setIsReceiving(true);
        }
      });
    });

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, [bookingId]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Navigation className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Live Tracking: {providerName}</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isReceiving ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></span>
                {isReceiving ? 'Provider is on the way (Live)' : 'Waiting for provider location...'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors focus:outline-none">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 w-full bg-gray-100 relative">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={providerLocation}
              zoom={15}
            >
              {isReceiving && (
                <Marker 
                  position={providerLocation}
                  icon={customMarker}
                />
              )}
            </GoogleMap>
          ) : (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTracker;
