/* eslint-disable no-unused-vars */
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import "../index.css";
import logo from "../images/logo.png";

export default function NavigationBar() {
  const commonStyles = {
    lgButton:
      "rounded-md text-gray-500 yellow-bg-hover hover:shadow-lg hover:text-white px-3 py-2 md:text-base sm:text-sm font-medium transition-colors duration-200 ease-in-out",
    smButton: `block rounded-md text-gray-500 yellow-bg-hover hover:shadow-lg hover:text-white px-3 py-2 text-base font-medium transition-colors duration-200 ease-in-out`,
  };

  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const { currentUser } = useSelector((state) => state.user);

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="shadow-lg lg:py-3">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 yellow-bg-hover hover:shadow-lg hover:text-white"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${menuOpen ? "hidden" : "block"} size-6`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${menuOpen ? "block" : "hidden"} size-6`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Logo and Links */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link to="/">
                <img
                  className="h-12 w-auto"
                  src={logo}
                  alt="Renuka Tours & Travels"
                />
              </Link>
            </div>

            <div
              className={`hidden sm:ml-6 sm:block ${menuOpen ? "" : "hidden"}`}
            >
              {" "}
              {/* Show links based on menu state */}
              <div className="flex lg:space-x-4">
                <Link to="/" className={commonStyles.lgButton}>
                  Home
                </Link>
                <Link to="/destinations" className={commonStyles.lgButton}>
                  Destinations
                </Link>
                <Link to="/tours" className={commonStyles.lgButton}>
                  Featured Tours
                </Link>
                <Link to="/gallery" className={commonStyles.lgButton}>
                  Gallery
                </Link>
                <Link to="/services" className={commonStyles.lgButton}>
                  Our Services
                </Link>
                <Link to="/about" className={commonStyles.lgButton}>
                  About Us
                </Link>
              </div>
            </div>
          </div>

          {/* User Profile Dropdown */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {currentUser ? (
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar
                    alt="user"
                    img={currentUser.profilePicture}
                    rounded
                    className="hover:border-yellow-400 hover:border"
                  />
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">@{currentUser.username}</span>
                  <span className="block text-sm font-medium truncate">
                    {currentUser.email}
                  </span>
                </Dropdown.Header>
                <Link to={"/dashboard?tab=dash"}>
                  <Dropdown.Item>Dashboard</Dropdown.Item>
                </Link>
                <Link to={"/dashboard?tab=profile"}>
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
              </Dropdown>
            ) : (
              <div>
                <Link to="/signin">
                  <button className="hidden md:inline-flex yellow-text-hover font-medium mr-4">
                    Log In
                  </button>
                </Link>

                <Link to="/register">
                  <button className="yellow-bg shadow-lg text-white font-bold px-4 py-2 rounded-lg yellow-bg-bold-hover">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={`sm:hidden`} id="mobile-menu">
          <div className={`space-y-1 px-2 pb-3 pt-2`}>
            <Link to="/" onClick={closeMenu} className={commonStyles.smButton}>
              Home
            </Link>

            <Link
              to="/destinations"
              onClick={closeMenu}
              className={commonStyles.smButton}
            >
              Destinations
            </Link>
            <Link
              to="/tours"
              onClick={closeMenu}
              className={commonStyles.smButton}
            >
              Featured Tours
            </Link>
            <Link
              to="/gallery"
              onClick={closeMenu}
              className={commonStyles.smButton}
            >
              Gallery
            </Link>
            <Link
              to="/services"
              onClick={closeMenu}
              className={commonStyles.smButton}
            >
              Our Services
            </Link>
            <Link
              to="/about"
              onClick={closeMenu}
              className={commonStyles.smButton}
            >
              About Us
            </Link>
            {!currentUser && (
              <Link
                to="/signin"
                onClick={closeMenu}
                className={commonStyles.smButton}
              >
                Log In
              </Link>
            )}
            {currentUser && (
              <>
                <Link
                  to="/dashboard?tab=dash"
                  onClick={closeMenu}
                  className={commonStyles.smButton}
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard?tab=profile"
                  onClick={closeMenu}
                  className={commonStyles.smButton}
                >
                  Profile
                </Link>
                <Link
                  onClick={() => {
                    closeMenu();
                    handleSignout();
                  }}
                  className={commonStyles.smButton}
                >
                  Log Out
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
