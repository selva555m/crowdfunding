import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 text-gray-800">
      <h1 className="text-9xl font-extrabold text-indigo-600">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold mt-4">Page Not Found</h2>
      <p className="text-lg text-gray-600 mt-2 text-center px-6 md:px-0">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
