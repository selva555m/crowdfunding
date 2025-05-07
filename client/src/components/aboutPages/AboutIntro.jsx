import React from "react";
import { assets } from "../../assets/assets";

const AboutIntro = () => {
  return (
    <section className="w-full flex flex-col items-center justify-center py-25 px-6 bg-linear-to-r from-indigo-100 to-purple-100">
      <h2 className="text-4xl font-bold text-gray-700 text-center">About Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 items-center max-w-6xl">
        <div className="flex justify-center">
          <img
            src={assets.about} // Ensure this path matches your assets structure
            alt="About Us"
            className="w-full max-w-md md:max-w-lg rounded-lg shadow-lg"
          />
        </div>
        <div className="space-y-6">
          <p className="text-gray-700 text-lg">
            At <span className="font-bold">CrowdBoost</span>, we believe in
            empowering dreamers and innovators by providing a seamless
            crowdfunding platform. Our mission is to turn visionary ideas into
            reality through community-driven support.
          </p>
          <p className="text-gray-700">
            Built on transparency and trust, we are more than just a platform.
            We are a movement that enables entrepreneurs, creators, and
            nonprofits to bring their projects to life.
          </p>
          <h3 className="font-bold text-xl text-gray-700">Our Vision</h3>
          <p className="text-gray-700">
            To create an inclusive, accessible, and secure ecosystem where
            innovation thrives, and ideas receive the backing they deserve.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutIntro;
