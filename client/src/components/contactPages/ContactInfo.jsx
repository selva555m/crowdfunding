import React from "react";
import { assets } from "../../assets/assets";

const ContactInfo = () => {
  return (
    <section className="w-full flex flex-col items-center justify-center py-25 px-6 bg-linear-to-r from-indigo-100 to-purple-100">
      <h2 className="text-4xl font-bold text-gray-700 text-center ">
        CONTACT US
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 items-center max-w-6xl">
        <div className="flex justify-center">
          <img
            src={assets.contact} // Ensure this path is correct
            alt="Contact Us"
            className="w-full max-w-md md:max-w-lg rounded-lg shadow-lg"
          />
        </div>
        <div className="space-y-6 text-gray-700 px-4 md:px-0">
          <h3 className="text-lg sm:text-xl font-bold">OUR CAMPAIGN</h3>
          <p className="text-base sm:text-lg">
            54709 Willms Station <br />
            Suite 350, Washington, USA
          </p>
          <p className="text-base sm:text-lg">
            Tel: <span className="font-semibold">(415) 555-0132</span> <br />
            Email:
            <a
              href="mailto:admin@forever.com"
              className="text-indigo-600 hover:underline ml-1"
            >
              admin@forever.com
            </a>
          </p>

          <h3 className="text-lg font-semibold">Donate for Campaign</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Your contribution helps us make a difference. Join us in supporting
            great causes!
          </p>

          <button className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 border-2 border-indigo-600 rounded-lg font-semibold shadow-md hover:bg-white hover:text-indigo-600 transition-all duration-300">
            Explore
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
