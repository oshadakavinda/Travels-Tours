import "../index.css";
import { useEffect, useState } from "react";
import { Datepicker, TextInput, Button, Modal, Spinner } from "flowbite-react";
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";
import SearchableDropdown from "../components/customizePage/SearchableDropdown";
import { useNavigate } from "react-router-dom";
import { color } from "framer-motion";

export default function CustomizeForm() {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();
  const [selectedStar, setSelectedStar] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedComType, setSelectedComType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [zoom, setZoom] = useState(7.9);
  const position = { lat: 7.87, lng: 80.77 };
  const [mapHeight, setMapHeight] = useState("80vh");
  const [destinations, setDestinations] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedDestinationDetails, setSelectedDestinationDetails] = useState({
    description: "",
    activities: [],
  });
  const [activeDestination, setActiveDestination] = useState(null);
  const commonStyles = {
    gridContainer: "grid grid-cols-1 md:grid-cols-3 gap-4 px-4",
    gridItem: "grid grid-rows-2",
    label: "text-gray-700 font-semibold sm:ml-2 md:ml-4 mt-auto",
    datepickerClass:
      "w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  };
  // Add this with other state declarations
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = async () => {
    // Remove e parameter
    setLoading(true);
    setError(null);

    try {
      const form = document.querySelector("form");
      const formData = {
        userName: form.userName.value,
        // General Information
        arrivalDate: form.arrivalDate.value,
        departureDate: form.departureDate.value,
        arrivalTime: form.arrivalTime.value,
        numberOfPeople: parseInt(form.numberOfPeople.value),
        numberOfAdults: parseInt(form.numberOfAdults.value),
        numberOfChildren: parseInt(form.numberOfChildren.value),
        dateComments: form.dateComments.value,

        // Location Information
        selectedDestinations,
        additionalLocations: form.additionalLocations.value,

        // Accommodation
        accommodationType: form.accommodationType.value,
        mealPlan: form.mealPlan.value,
        accommodationPreference: form.accommodationPreference.value,

        // Transport
        vehicleType: form.vehicleType.value,
        numberOfVehicles: parseInt(form.numberOfVehicles.value),
        transportPreference: form.transportPreference.value,

        //contact Information
        mobileNumber: form.mobileNumber.value,
        comType: form.whatsappNumberType.value,
        whatsappNumber: form.whatsappNumber.value,
        email: form.email.value,
      };

      const res = await fetch("/api/trip-plan/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      form.reset();
      setSelectedDestinations([]);
      setLoading(false);
      setShowSuccessModal(true);
    } catch (error) {
      setShowErrorModal(true);
      console.log("Error submitting form:", error.message);

      let errorMessage = "Please fill in the following required fields:\n";

      if (error.message.includes("validation failed")) {
        const matches = [...error.message.matchAll(/`([^`]*)` is required/g)];
        const fieldNames = matches.map((match) => match[1]);

        // Convert field names to a readable format
        const formattedFields = fieldNames.map((field) => {
          return field
            .replace(/([A-Z])/g, " $1") // Add spaces before uppercase letters
            .replace(/\b([a-z])/, (char) => char.toUpperCase()); // Capitalize first letter
        });

        errorMessage += formattedFields.join(", ");
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);

      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicles/getvehicles");
        const data = await response.json();
        setVehicles(data.vehicles || []);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`/api/destination/get-dest-names`);
        const data = await response.json();
        setDestinations(data.destinations || []);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  // Handle adding a destination to the selected list
  const handleSelectDestination = (destinationName) => {
    if (!selectedDestinations.includes(destinationName)) {
      setSelectedDestinations((prev) => [...prev, destinationName]);
      handleTileClick(destinationName);
    }
  };

  // Fetch details (description and activities) of the selected destination
  const fetchDestinationDetails = async (destinationName) => {
    const response = await fetch(
      `/api/destination/get-dest?searchTerm=${destinationName}`
    );
    const data = await response.json();
    console.log("Fetched destination data:", data); // Add this line for debugging

    if (data.destinations && data.destinations.length > 0) {
      const destination = data.destinations[0];
      setSelectedDestinationDetails({
        description: destination.description,
        activities: destination.activities,
      });
    }
  };

  // Handle tile click to fetch details
  const handleTileClick = (destinationName) => {
    setActiveDestination(destinationName);
    fetchDestinationDetails(destinationName);
  };

  const handleRemoveDestination = (destinationName) => {
    setSelectedDestinations((prev) =>
      prev.filter((item) => item !== destinationName)
    );
    // Clear active destination if it was the one removed
    if (activeDestination === destinationName) {
      setActiveDestination(null);
      setSelectedDestinationDetails({
        description: "",
        activities: [],
      });
    }
  };

  useEffect(() => {
    const updateHeight = () => {
      const screenHeight = window.innerHeight;

      if (screenHeight < 600) {
        setMapHeight("150vh"); // Smaller height for small screens
      } else if (screenHeight < 800) {
        setMapHeight("110vh");
      } else {
        setMapHeight("80vh"); // Larger height for bigger screens
      }
    };

    // Update height on component mount and window resize
    updateHeight();
    window.addEventListener("resize", updateHeight);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <Spinner size="xl" />
        </div>
      )}
      <div className="py-8 basic-struture shadow-xl">
        <h3 className="py-2 yellow-bg text-xl text-white text-center">
          Location Information
        </h3>
        <div className="py-2">
          <p className="text-gray-700 font-semibold text-center">
            Select the locations you are interest to visit:
          </p>
        </div>

        {/* ***************************************************cards*************************************************** */}

        <div className="py-2 grid grid-cols-1 sm:grid-rows-2 md:grid-rows-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* ***************************************************cards01*************************************************** */}
          <div className="py-2 border-2 rounded-lg shadow-lg">
            <div className="py-2">
              <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
                Locations:
              </p>
            </div>
            <div className="grid grid-cols-1  px-4">
              <SearchableDropdown
                destinations={destinations}
                handleSelectDestination={handleSelectDestination}
              />
            </div>
            {/* **********tiles********** */}
            <div className="mt-4 px-4 flex flex-wrap gap-2">
              {selectedDestinations.map((destination, index) => (
                <div
                  key={index}
                  className={`flex items-center px-4 py-2 rounded-md border-2 text-sm text-yellow-400 cursor-pointer
          ${
            activeDestination === destination
              ? "border-blue-500"
              : "border-gray-200"
          }`}
                  onClick={() => handleTileClick(destination)}
                >
                  <span>{destination}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent tile click when removing
                      handleRemoveDestination(destination);
                    }}
                    className="ml-2 text-red-500"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <div className="px-4">
              <p className="text-gray-400 italic">
                *Select a location to see the details
              </p>
            </div>

            <div className="py-2">
              <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
                Details about the location you have currently selected:
              </p>
            </div>
            <div className="px-4">
              <div>
                <p
                  className="text-justify"
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedDestinationDetails.description ||
                      "Select a destination to see details",
                  }}
                ></p>
              </div>
              <div>
                <strong>Activities:</strong>
                <ul className="ml-12">
                  {selectedDestinationDetails.activities.length > 0 ? (
                    selectedDestinationDetails.activities.map(
                      (activity, index) => <li key={index}>• {activity}</li>
                    )
                  ) : (
                    <li>No activities available</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="py-2">
              <p className="text-gray-700 font-semibold sm:ml-2 md:ml-4">
                Describe any additional locations if you have in your mind:
              </p>
            </div>
            <div className="px-4">
              <textarea
                name="additionalLocations"
                placeholder="Describe additional locations"
                className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                rows="2"
              />
            </div>
          </div>

          {/* ***************************************************cards02*************************************************** */}
          <div className="py-2 rounded-lg shadow-lg flex justify-center items-center border-2">
            <div style={{ height: mapHeight, width: "97.5%" }}>
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API}>
                <Map
                  zoom={zoom}
                  center={position}
                  mapId={import.meta.env.VITE_MAP_ID}
                  fullscreenControl={false}
                  streetViewControl={false}
                  zoomControl={false}
                  gestureHandling="none"
                >
                  <Directions selectedDestinations={selectedDestinations} />
                </Map>
              </APIProvider>
            </div>
          </div>
        </div>

        <h3 className="py-2 yellow-bg text-xl text-white text-center">
          General Information
        </h3>
        <div className={commonStyles.gridItem}>
          <p className={commonStyles.label}>
            Your Name:{" "}
            <span className="text-red-600 text-xs"> (*required)</span>
          </p>
          <TextInput
            type="text"
            name="userName"
            placeholder=""
            className="flex-1 px-4"
          />
        </div>
        <div className={commonStyles.gridContainer}>
          <div className={commonStyles.gridItem}>
            <p className={commonStyles.label}>
              Arrival Date:
              <span className="text-red-600 text-xs"> (*required)</span>
            </p>
            <Datepicker
              name="arrivalDate"
              className={commonStyles.datepickerClass}
              minDate={new Date()}
            />
          </div>
          <div className={commonStyles.gridItem}>
            <p className={commonStyles.label}>
              Departure Date:
              <span className="text-red-600 text-xs"> (*required)</span>
            </p>
            <Datepicker
              name="departureDate"
              className={commonStyles.datepickerClass}
              minDate={new Date()}
            />
          </div>
          <div className={commonStyles.gridItem}>
            <p className={commonStyles.label}>Arrival Time (approximate):</p>
            <TextInput
              type="text"
              name="arrivalTime"
              placeholder="Arrival Time - ex:(10 AM)"
              className="flex-1"
            />
          </div>
        </div>
        <div className={commonStyles.gridContainer}>
          <div className={commonStyles.gridItem}>
            <p className={commonStyles.label}>
              Number of people:
              <span className="text-red-600 text-xs"> (*required)</span>
            </p>
            <TextInput
              type="text"
              name="numberOfPeople"
              placeholder="Number of people"
              className="flex-1"
            />
          </div>
          <div className={commonStyles.gridItem}>
            <p className={commonStyles.label}>Number of adults:</p>
            <TextInput
              type="text"
              name="numberOfAdults"
              placeholder="Number of adults"
              className="flex-1"
            />
          </div>
          <div className={commonStyles.gridItem}>
            <p className={commonStyles.label}>Number of children:</p>
            <TextInput
              type="text"
              name="numberOfChildren"
              placeholder="Number of children"
              className="flex-1"
            />
          </div>
        </div>
        <p className="py-2 text-gray-700 font-semibold text-center">
          If you have any comments about the date please mention here:
        </p>
        <div className="pt-0 p-4 flex justify-center">
          <TextInput
            type="text"
            name="dateComments"
            placeholder="Any Comments about the date"
            className="flex-1"
          />
        </div>
        <h3 className="py-2 yellow-bg text-xl text-white text-center">
          Accommodation
        </h3>
        <div className={commonStyles.gridContainer}>
          <div className={commonStyles.gridItem}>
            <p className={commonStyles.label}>
              Accommodation Type:
              <span className="text-red-600 text-xs"> (*required)</span>
            </p>
            <select
              id="star"
              name="accommodationType"
              className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none"
              value={selectedStar}
              onChange={(e) => setSelectedStar(e.target.value)}
            >
              <option value="" disabled>
                Select the accommodation type
              </option>
              <option value="3_star">3 stars ⭐⭐⭐</option>
              <option value="4_star">4 stars ⭐⭐⭐⭐</option>
              <option value="5_star">5 stars ⭐⭐⭐⭐⭐</option>
              <option value="5+_star">5+ stars 🌟🌟🌟🌟🌟🌟</option>
              <option value="Cabana">Cabana</option>
              <option value="Tree_house">Tree House</option>
              <option value="Beach_resort">Beach Resort</option>
              <option value="Bungalows">Bungalows</option>
              <option value="Villa">Villa</option>
              <option value="Home_stays">Home stays</option>
            </select>
          </div>
          <div className={commonStyles.gridItem}>
            <p className={commonStyles.label}>Meal Plans:</p>

            <select
              id="star"
              name="mealPlan"
              className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none"
              value={selectedMeal}
              onChange={(e) => setSelectedMeal(e.target.value)}
            >
              <option value="" disabled>
                Select a meal plan
              </option>
              <option value="Full_Board">Full Board</option>
              <option value="Half_Board">Half Board</option>
              <option value="Bed_and_Breakfast">Bed and Breakfast</option>
              <option value="Room_Only">Room Only</option>
              <option value="All_Inclusive">All-Inclusive</option>
            </select>
          </div>
          <div className={commonStyles.gridItem}>
            <p className={commonStyles.label}>
              Describe any Specific preference:
            </p>
            <TextInput
              type="text"
              name="accommodationPreference"
              placeholder="Describe Any Preference"
              className="flex-1"
              autoComplete="off"
            />
          </div>
        </div>
        <h3 className="py-2 mt-4 yellow-bg text-xl text-white text-center">
          Transportation
        </h3>
        <div className={commonStyles.gridContainer}>
          <div className={commonStyles.gridItem}>
            <p className={commonStyles.label}>
              Vehicle Type:
              <span className="text-red-600 text-xs"> (*required)</span>
            </p>
            <select
              id="vehicle"
              name="vehicleType"
              className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="" disabled>
                Select a Type
              </option>
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle.title}>
                  {vehicle.title}
                </option>
              ))}
            </select>
          </div>
          <div className={commonStyles.gridItem}>
            <p className={commonStyles.label}>Number of Vehicles:</p>
            <TextInput
              type="text"
              name="numberOfVehicles"
              placeholder="Number of Vehicles"
              className="flex-1"
            />
          </div>
          <div className={commonStyles.gridItem}>
            <p className={commonStyles.label}>
              Describe any Specific preference:
            </p>
            <TextInput
              type="text"
              name="transportPreference"
              placeholder="Describe Any Preference"
              className="flex-1"
              autoComplete="off"
            />
          </div>
        </div>
        <h3 className="py-2 mt-4 yellow-bg text-xl text-white text-center">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
          <div className={commonStyles.gridItem}>
            <p className={commonStyles.label}>
              Mobile No:
              <span className="text-red-600 text-xs"> (*required)</span>
            </p>
            <TextInput
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              className="flex-1"
            />
          </div>
          <div className="grid grid-rows-2">
            <p className={commonStyles.label}>WhatsApp/Telegram/WeChat:</p>
            <div className="flex">
              <select
                id="selectCommunication"
                name="whatsappNumberType"
                className="w-1/3 px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none"
                value={selectedComType}
                onChange={(e) => setSelectedComType(e.target.value)}
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Telegram">Telegram</option>
                <option value="WeChat">WeChat</option>
              </select>
              <TextInput
                type="text"
                name="whatsappNumber"
                placeholder="WhatsApp/Telegram/WeChat Number"
                className="w-2/3"
              />
            </div>
          </div>
          <div className={commonStyles.gridItem}>
            <p className={commonStyles.label}>
              Email: <span className="text-red-600 text-xs"> (*required)</span>
            </p>
            <TextInput
              type="text"
              name="email"
              placeholder="Email"
              className="flex-1"
              autoComplete="on"
            />
          </div>
        </div>
        <div className="py-2">
          <p className="text-gray-400 italic">
            *Don’t worry about the details you’ve entered; you can modify any
            feature later by discussing it with our service agent. Once you
            submit the form, we’ll receive your inquiry. You can create multiple
            inquiries. We’ll contact you through the provided contact details
            for further confirmation.
          </p>
        </div>
        {/* Replace the existing submit button div with this code */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="bg-[#F4AC20] text-xl text-white font-semibold py-4 px-12 rounded-lg hover:bg-[#f49120]"
          >
            Submit Your Plan
          </button>
        </div>
      </div>

      <Modal show={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <Modal.Header>Confirm Submission</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Are you sure you want to submit your travel plan? You can still
              modify any details later by discussing with our service agent.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="bg-[#F4AC20] hover:bg-[#f49120]"
            onClick={() => {
              setShowConfirmModal(false);
              handleSubmit();
              setLoading(true);
            }}
          >
            Yes, Submit
          </Button>
          <Button color="gray" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <Modal.Header className="justify-center text-center">
          Plan has created successfully! 🎉
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-center leading-relaxed text-gray-500 dark:text-gray-400">
              Thank you for submitting your travel plan. We have received your
              inquiry and will contact you soon using the contact information
              you have provided for further confirmation. You can see your
              submitted plans in the dashboard.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-center">
          <Button
            className="bg-[#F4AC20] hover:bg-[#f49120] px-4"
            onClick={() => {
              setShowSuccessModal(false);
              navigate("/");
            }}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onClose={() => setShowErrorModal(false)}>
        <Modal.Header className="justify-center text-center">
          <span className="text-4xl">⚠️</span> Plan has Not being created!
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-center leading-relaxed text-gray-500 dark:text-gray-400">
              {error}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-center">
          <Button
            className="bg-red-600 px-4"
            onClick={() => {
              setShowErrorModal(false);
            }}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </form>
  );
}

// ***********************************************************************Scripts*********************************************************************** //

function Directions({ selectedDestinations }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const geocodingLibrary = useMapsLibrary("geocoding");
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [geocodingService, setGeocodingService] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [hasRoute, setHasRoute] = useState(false);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (geocodingLibrary) {
      setGeocodingService(new geocodingLibrary.Geocoder());
    }
  }, [geocodingLibrary]);

  const clearMap = () => {
    if (directionsRenderer) {
      directionsRenderer.setDirections(null);
    }
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
    setRoutes([]);
    setHasRoute(false);
  };

  const getLocationName = async (position) => {
    if (!geocodingService) return "";

    try {
      const response = await geocodingService.geocode({
        location: position,
      });

      if (response.results[0]) {
        // Try to get the locality or sublocality first
        for (let component of response.results[0].address_components) {
          if (
            component.types.includes("locality") ||
            component.types.includes("sublocality")
          ) {
            return component.short_name;
          }
        }
        // Fallback to formatted address if no locality found
        return response.results[0].formatted_address.split(",")[0];
      }
      return "";
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return "";
    }
  };

  const createMarker = async (position) => {
    const locationName = await getLocationName(position);

    return new google.maps.Marker({
      position: position,
      map: map,
      label: {
        text: locationName,
        color: "white",
        fontSize: "14px",
        fontWeight: "bold",
      },
      title: locationName,
    });
  };

  const calculateRoute = async (destinations) => {
    if (!directionsService || !directionsRenderer || destinations.length < 2) {
      clearMap();
      return;
    }

    try {
      const origin = destinations[0];
      const destination = destinations[destinations.length - 1];
      const waypoints = destinations.slice(1, -1).map((location) => ({
        location,
        stopover: true,
      }));

      const response = await directionsService.route({
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      });

      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null));

      // Get route points for markers
      const legs = response.routes[0].legs;
      const positions = [
        legs[0].start_location,
        ...legs.map((leg) => leg.end_location),
      ];

      // Create markers with names from reverse geocoding
      const newMarkers = await Promise.all(
        positions.map((position) => createMarker(position))
      );

      setMarkers(newMarkers);
      directionsRenderer.setOptions({ suppressMarkers: true });
      directionsRenderer.setDirections(response);
      setRoutes(response.routes);
      setHasRoute(true);
    } catch (error) {
      console.error("Error calculating route:", error);
      clearMap();
    }
  };

  useEffect(() => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    if (directionsService && directionsRenderer && geocodingService) {
      calculateRoute(selectedDestinations);
    }
  }, [
    selectedDestinations,
    directionsService,
    directionsRenderer,
    geocodingService,
  ]);

  useEffect(() => {
    if (!routesLibrary || !map) return;

    const renderer = new routesLibrary.DirectionsRenderer({
      map,
      suppressMarkers: true,
    });
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(renderer);

    return () => {
      if (renderer) {
        renderer.setMap(null);
      }
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsRenderer || !hasRoute) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer, hasRoute]);

  return null;
}
