import React from "react";
import { motion } from "framer-motion";
import logo from "../images/logo.png";

export default function About() {
  return (
    <div className="bg-gradient-to-b from-[#fcf5f1] to-amber-50 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section with Logo */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <img
              src={logo}
              alt="Renuka Tours and Travels Logo"
              className="h-24 md:h-32 mx-auto mb-4 drop-shadow-lg"
            />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Discover <span className="text-amber-500">Sri Lanka</span> with Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Creating unforgettable journeys <b>since 2015</b>
          </p>
        </motion.div>

        {/* Company Introduction */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-10 items-center mb-24 overflow-hidden"
        >
          <div className="lg:w-1/2">
            <motion.div 
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <img
                className="w-full h-auto rounded-2xl shadow-xl z-10 relative"
                src="https://www.reddottours.com/uploads/Activities/Sri-Lanka-Waterfalls/Sri-Lanka-Waterfalls-gallery-pop-up-1-min.jpg"
                alt="Beautiful Sri Lanka landscape"
              />
              <div className="absolute inset-0 border-4 border-amber-400 rounded-2xl -z-0 "></div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:w-1/2"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">About Renuka Tours and Travels</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At Renuka Tours and Travels, we're passionate about showcasing the beauty and culture of Sri Lanka to the world. With years of experience in the travel industry, we specialize in creating personalized travel experiences that cater to the unique preferences of our clients.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              From selecting top destinations and accommodations to organizing unforgettable activities, we take care of every detail so you can focus on enjoying your journey. Discover Sri Lanka's breathtaking landscapes, vibrant history, and warm hospitality with us.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-amber-100 rounded-full px-6 py-2 text-amber-700 font-medium">Personalized Tours</div>
              <div className="bg-amber-100 rounded-full px-6 py-2 text-amber-700 font-medium">Local Expertise</div>
              <div className="bg-amber-100 rounded-full px-6 py-2 text-amber-700 font-medium">Premium Service</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Vision & Mission Container */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Vision Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-48 bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center">
              <h2 className="text-3xl font-bold text-white">Our Vision</h2>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed border-l-4 border-amber-400 pl-6 py-2 italic">
                To be the most trusted and innovative travel partner, offering personalized and seamless travel experiences that showcase the beauty of Sri Lanka while ensuring comfort, affordability, and unforgettable memories for every traveler.
              </p>
            </div>
          </motion.div>

          {/* Mission Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-48 bg-gradient-to-r from-amber-500 to-amber-400 flex items-center justify-center">
              <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            </div>
            <div className="p-8">
              <p className="text-gray-700 leading-relaxed border-l-4 border-amber-400 pl-6 py-2 italic">
                To provide personalized and hassle-free travel experiences by offering customized itineraries, comprehensive destination insights, seamless booking services, and efficient customer support, ensuring every journey is memorable and stress-free.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Core Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Excellence</h3>
              <p className="text-gray-600">We strive for excellence in every aspect of our service, from planning to execution.</p>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Customer Focus</h3>
              <p className="text-gray-600">We put our customers at the heart of everything we do, tailoring experiences to their needs.</p>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.65" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Cultural Respect</h3>
              <p className="text-gray-600">We honor and promote Sri Lanka's rich cultural heritage in all our travel experiences.</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-amber-500 to-amber-400 rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Explore Sri Lanka?</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Contact us today to start planning your perfect Sri Lankan adventure. Our team is ready to create a personalized experience just for you.
          </p>
          <a href="/customize">
            <button className="bg-white text-amber-500 font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
              Plan Your Journey
            </button>
          </a>
        </motion.div>
      </section>
    </div>
  );
}