import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 md:px-12 py-10">
      <div className="flex flex-wrap justify-between items-center gap-8">
        {/* Logo and Subscription */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-4">
            <img src={assets.logo} alt="Logo" className="w-14 h-14" />
            <h2 className="text-2xl font-semibold">Crowd Funding</h2>
          </div>
          <p className="mt-4 text-sm">Stay updated with our latest campaigns!</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="px-4 py-2 text-sm w-full sm:w-60 border-2 border-white bg-white text-black rounded-full outline-none"
            />
            <button className="bg-white text-gray-700 px-4 py-2 text-sm rounded-full hover:text-black transition cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>

        {/* Footer Links (Grid Layout for Better Responsiveness) */}
        <div className="w-full md:w-2/3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-center md:text-left">
          <div>
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="hover:text-gray-200 cursor-pointer">Features</li>
              <li className="hover:text-gray-200 cursor-pointer">Popular campaigns</li>
              <li className="hover:text-gray-200 cursor-pointer">Testimonials</li>
              <li className="hover:text-gray-200 cursor-pointer">FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold">Follow Us</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="hover:text-gray-200 cursor-pointer">Facebook</li>
              <li className="hover:text-gray-200 cursor-pointer">Instagram</li>
              <li className="hover:text-gray-200 cursor-pointer">LinkedIn</li>
              <li className="hover:text-gray-200 cursor-pointer">Twitter</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>info@crowdfunding.com</li>
              <li>+91-XXX-XXXX-XXX</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold">Address</h4>
            <p className="mt-3 text-sm">
              Crowd Funding Groups, Chennai, Tamil Nadu, India
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 text-center text-sm border-t border-white/20 pt-4">
        © 2025 Crowd Funding Group. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
