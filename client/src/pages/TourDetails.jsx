import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import TimelineComponent from "../components/shared/timeline";
import FtourBooking from "../components/featuredTours/FtourBook";
import EmailTourButton from "../components/featuredTours/EmailTourButton";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TourPDFDocument from "../components/featuredTours/TourPdfDoc";
import { MdOutlineFileDownload } from "react-icons/md";

const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [destData, setDestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true);

        // Fetch tour data
        const tourResponse = await axios.get(`/api/tours/gettour/${id}`);
        setTour(tourResponse.data);

        // Fetch destination data
        const destResponse = await axios.get("/api/destination/get-dest");
        setDestData(destResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tour]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't load the tour information.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-amber-400 hover:bg-amber-500 text-white font-medium rounded-full transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!tour || !destData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Tour Data Found
          </h2>
          <p className="text-gray-600">
            The requested tour could not be found.
          </p>
        </div>
      </div>
    );
  }

  const { title, destinations, days, photo, desc } = tour || {};
  const destinationList = destData?.destinations || [];

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-8/12">
            <div className="tour__content bg-white shadow-md rounded-md p-6">
              {photo && (
                <img
                  src={photo}
                  alt={title}
                  className="w-full h-80 object-cover rounded-md mb-6"
                />
              )}
              <div className="tour__info">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <div className="flex flex-wrap gap-4 mb-4">
                  <span className="text-sm font-medium text-gray-600">
                    <strong>Days:</strong> {days}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    <strong>Destinations:</strong> {destinations?.length -1 || 0}
                  </span>
                </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg -mt-32 relative z-10 overflow-hidden">
          <div className="flex flex-col xl:flex-row">
            {/* Tour Content Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="xl:w-2/3 p-8 lg:p-12"
            >
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold ml-4 text-gray-800">
                  Tour Overview
                </h2>
              </div>

              <div
                className="prose prose-lg max-w-none text-gray-600 mb-10"
                dangerouslySetInnerHTML={{ __html: desc }}
              />

              {/* PDF Download Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <PDFDownloadLink
                  document={
                    <TourPDFDocument
                      tour={tour}
                      destinationList={destinationList}
                      bookingData={""}
                    />
                  }
                  fileName={`${tour.title}.pdf`}
                >
                  {({ loading }) =>
                    loading ? (
                      <button className="bg-amber-400 text-white px-8 py-3 rounded-full font-medium">
                        Loading PDF...
                      </button>
                    ) : (
                      <button className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white px-8 py-3 rounded-full font-medium inline-flex items-center space-x-2 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
                        <span>Download Tour Details</span>
                        <MdOutlineFileDownload className="w-5 h-5" />
                      </button>
                    )
                  }
                </PDFDownloadLink>
              </motion.div>

              {/* Timeline Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-12"
              >
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold ml-4 text-gray-800">
                    Tour Itinerary
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <TimelineComponent
                    dest_ids={destinations}
                    dest_obj={destinationList}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Booking Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="xl:w-1/3 bg-gradient-to-b from-gray-50 to-white p-4"
            >
              <div className="sticky top-8">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-400 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Book This Tour
                    </h3>
                    <p className="text-amber-100">
                      Start planning your adventure
                    </p>
                  </div>

                  <div className="p-6">
                    <FtourBooking
                      tour={tour}
                      onBookingUpdate={setBookingData}
                    />
                  </div>

                  <div className="px-6 pb-4">
                    <div className="bg-amber-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-600 text-sm italic">
                        *Don't worry about the details you've entered; you can
                        modify any feature later by discussing it with our
                        service agent. Once you submit the form, we'll receive
                        your inquiry. You can create multiple inquiries. We'll
                        contact you through the provided contact details for
                        further confirmation. You will receive an email with
                        inquiry details.
                      </p>
                    </div>

                    <EmailTourButton
                      tour={tour}
                      destinationList={destinationList}
                      bookingData={bookingData}
                      userEmail={bookingData?.email}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-amber-500 to-amber-400 rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for Your Adventure?
          </h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Join us on this incredible journey and create memories that will
            last a lifetime. Our expert guides and carefully crafted itinerary
            ensure an unforgettable experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/tours">
              <button className="bg-white text-amber-500 font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                Browse More Tours
              </button>
            </a>
            <a href="/customize">
              <button className="bg-transparent text-white border-2 border-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition-all duration-300">
                Customize Your Journey
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );

};

export default TourDetails;
