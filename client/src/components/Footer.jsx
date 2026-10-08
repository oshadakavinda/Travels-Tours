import { Link } from "react-router-dom";
import logo from "../images/logo.png";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#fefcfb] py-12 px-4 sm:px-6  lg:px-8">
      <div className="max-w-7xl  mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center lg:grid-cols-3 gap-8">
          {/* Logo and Tagline */}
          <div className="flex flex-col">
            <img
              src={logo}
              alt="Renuka Tours & Travels"
              className="w-32 mb-4"
            />
            <p className="text-gray-600 text-center md:text-left mb-6">
              Enhancing experiences through innovation and trust.
            </p>
            <div className="flex gap-5 text-gray-700">
              <a 
                href="https://www.facebook.com/RenukaToursAndTravel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#F4AC20] transition-colors duration-300 flex items-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Follow us</span>
              </a>
            </div>
          </div>

          {/* Explore More */}
          <div className="flex flex-col items-center">
            <h5 className="text-lg font-bold text-gray-800 mb-4">Navigation</h5>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-600 hover:text-[#F4AC20] transition-colors">
                Home
              </Link>
              <Link to="/about" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-600 hover:text-[#F4AC20] transition-colors">
                About Us
              </Link>
              <Link to="/tours" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-600 hover:text-[#F4AC20] transition-colors">
                Tours
              </Link>
              <Link to="/gallery" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-600 hover:text-[#F4AC20] transition-colors">
                Gallery
              </Link>
              <Link to="/services" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-600 hover:text-[#F4AC20] transition-colors">
                Services
              </Link>
              <Link to="/destinations" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-600 hover:text-[#F4AC20] transition-colors">
                Destinations
              </Link>
              <Link to="/dashboard" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-600 hover:text-[#F4AC20] transition-colors">
                Dashboard
              </Link>
              <Link to="/customize" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-gray-600 hover:text-[#F4AC20] transition-colors">
                Customizor
              </Link>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col items-center">
            <h5 className="text-lg font-bold text-gray-800 mb-4">Contact Us</h5>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#f49120]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <a href="mailto:renukatours94@gmail.com" className="hover:text-[#F4AC20] transition-colors">
                  renukatours94@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#f49120]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>+94 77 926 4693</span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <svg className="w-5 h-5 text-[#f49120]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>Sri Lanka</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom with enhanced design */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {year} Renuka Tours & Travels. All rights reserved.
            </p>
           
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;