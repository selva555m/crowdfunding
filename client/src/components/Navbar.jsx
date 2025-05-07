import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { assets } from "../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const userRole = user?.data?.role;

  const handleAdminClick = () => {
    if (userRole === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/admin-login");
    }
  };

  const isActive = (path) =>
    location.pathname === path ? "text-yellow-300 font-bold" : "text-white";

  return (
    <nav className="w-full fixed top-0 left-0 bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between h-20 px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img src={assets.logo} alt="Logo" className="w-12 h-12" />
          <h1 className="text-2xl font-bold">Crowd Funding</h1>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-6">
          <Link
            to="/"
            className={`${isActive("/")} hover:text-gray-200 transition`}
          >
            Home
          </Link>
          <Link
            to="/campaigns"
            className={`${isActive(
              "/campaigns"
            )} hover:text-gray-200 transition`}
          >
            Campaigns
          </Link>
          <Link
            to="/about"
            className={`${isActive("/about")} hover:text-gray-200 transition`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`${isActive("/contact")} hover:text-gray-200 transition`}
          >
            Contact
          </Link>
        </div>

        {/* User & Admin Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Show Admin Button Only If No User Logged In OR If User Is Admin */}
          {/* {(!token || userRole === "admin") && (
            <button
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition"
              onClick={handleAdminClick}
            >
              Admin
            </button>
          )} */}

          {token && userRole !== "admin" && (
            <FaUserCircle
              className="text-2xl cursor-pointer hover:text-gray-200 transition"
              onClick={() => navigate("/dashboard")}
            />
          )}

          {!token && (
            <button
              className="bg-indigo-500 px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-purple-600 flex flex-col items-center justify-center space-y-6 transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <button
          className="absolute top-5 right-5 text-white text-3xl"
          onClick={() => setMenuOpen(false)}
        >
          <FaTimes />
        </button>

        <Link
          to="/"
          className="text-white text-lg"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/campaigns"
          className="text-white text-lg"
          onClick={() => setMenuOpen(false)}
        >
          Campaigns
        </Link>
        <Link
          to="/about"
          className="text-white text-lg"
          onClick={() => setMenuOpen(false)}
        >
          About
        </Link>
        <Link
          to="/contact"
          className="text-white text-lg"
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </Link>

        {/* Show Admin Button Only If No User Logged In OR If User Is Admin */}
        {/* {(!token || userRole === "admin") && (
          <button
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition"
            onClick={() => {
              setMenuOpen(false);
              handleAdminClick();
            }}
          >
            Admin
          </button>
        )} */}

        {token && userRole !== "admin" && (
          <button
            className="text-lg text-white"
            onClick={() => {
              setMenuOpen(false);
              navigate("/dashboard");
            }}
          >
            Dashboard
          </button>
        )}

        {!token && (
          <button
            className="text-lg text-white"
            onClick={() => {
              setMenuOpen(false);
              navigate("/login");
            }}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
