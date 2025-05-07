import React from "react";

const CallToAction = () => {
  return (
    <section className="bg-white text-center py-12 px-6 shadow-md">
      <h2 className="text-3xl font-bold text-indigo-500">
        Ready to Make a Difference?
      </h2>
      <p className="mt-4 text-lg text-gray-700">
        Start your campaign today and bring your ideas to life.
      </p>
      <button className="mt-6 bg-indigo-500 px-6 py-2 text-lg text-white rounded-full hover:bg-indigo-600 transition">
        Get Started
      </button>
    </section>
  );
};

export default CallToAction;
