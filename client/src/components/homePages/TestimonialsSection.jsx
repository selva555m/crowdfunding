import React from "react";

const TestimonialsSection = () => {
  return (
    <section className="bg-linear-to-bl from-indigo-50 to-purple-50 py-16 px-6">
      <h2 className="text-3xl font-bold text-center text-indigo-500">What People Say</h2>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3,4,5,6].map((_, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6 text-center">
            <p className="text-gray-700">"This platform changed my life! The support I received was incredible."</p>
            <h4 className="mt-3 font-semibold text-indigo-500">- User {index + 1}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
