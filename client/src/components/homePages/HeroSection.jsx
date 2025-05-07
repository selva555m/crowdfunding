import React from "react";

const HeroSection = () => {
  return (
    <section className="w-full min-h-screen bg-gradient-to-r from-indigo-200 to-purple-50 flex flex-col items-center justify-center text-center px-6 shadow-md">
      <div className="max-w-screen-xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-indigo-600">
          Empower Dreams, Fund Change
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700">
          Join a community that makes a difference, one campaign at a time.
        </p>
        <button className="mt-6 bg-indigo-500 px-6 py-3 text-lg font-semibold text-white rounded-full hover:bg-indigo-600 transition">
          Start a Campaign
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
