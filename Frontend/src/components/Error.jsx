import React from 'react';

const Error = () => {
  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center p-8 bg-gray-800 shadow-lg rounded-lg max-w-sm mx-auto">
        <h1 className="text-6xl font-bold text-red-400">404</h1>
        <p className="mt-4 text-2xl text-white">Oops! Page Not Found</p>
        <p className="mt-2 text-gray-400">Sorry, the page you're looking for doesn't exist.</p>
        <a 
          href="/" 
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-300"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default Error;
