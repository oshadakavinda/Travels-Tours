import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";

export default function DestinationDetails() {
  const { destSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [destination, setDestination] = useState(null);
  const [destinationNames, setDestinationNames] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [hotelError, setHotelError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/destination/get-dest/?slug=${destSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        setDestination(data.destinations[0]);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchDestinations();
  }, [destSlug]);

  useEffect(() => {
    const fetchDestinationNames = async () => {
      try {
        const res = await fetch(`/api/destination/get-dest`);
        const data = await res.json();
        if (res.ok) {
          const names = data.destinations.map((destination) => ({
            name: destination.destinationName,
            slug: destination.slug,
          }));
          setDestinationNames(names);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchDestinationNames();
  }, []);

  useEffect(() => {
    if (destination?.destinationName) {
      const fetchHotels = async () => {
        try {
          setHotelLoading(true);
          const res = await fetch(
            `/api/hotels/hotels?city=${destination.destinationName}`
          );
          const data = await res.json();
          if (!res.ok) {
            setHotelError(true);
            setHotelLoading(false);
            return;
          }
          setHotels(data);
          setHotelLoading(false);
        } catch (error) {
          setHotelError(true);
          setHotelLoading(false);
        }
      };
      fetchHotels();
    }
  }, [destination]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full">
        <div className="absolute inset-0">
          <img
            src={destination?.destImage}
            alt={destination?.destinationName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center items-center h-full pb-16">
            <h1 className="text-5xl font-bold text-white mb-4">
              {destination?.destinationName}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Description Section */}
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                About {destination?.destinationName}
              </h2>
              <div
                className="prose prose-lg max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: destination?.description }}
              />
              {destination?.activities?.length > 0 && (
                <>
                  <h2 className="text-3xl font-semibold text-gray-900 my-6">
                    Activities in {destination?.destinationName}
                  </h2>
                  <div
                    id="Activities"
                    className="prose prose-lg max-w-none text-gray-600"
                  >
                    <ul className="list-disc pl-5">
                      {destination.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Other Destinations Section */}
            <div className="lg:w-1/3">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Explore Other Destinations
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {destinationNames
                    .sort((a, b) => a.name.localeCompare(b.name)) // Sorting alphabetically
                    .map((dest, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(`/destinations/${dest.slug}`)}
                        className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-gray-900 text-left group flex items-center justify-between"
                      >
                        <span className="font-medium">{dest.name}</span>
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
