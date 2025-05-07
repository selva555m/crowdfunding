import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-indigo-700 text-lg font-semibold">Loading...</p>
    </div>
  );
};

export default Loading;
