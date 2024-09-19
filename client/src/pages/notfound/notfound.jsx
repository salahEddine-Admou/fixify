// src/pages/notFound/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-blue-600">404</h1>
                <h2 className="text-3xl font-semibold mt-4 text-gray-800">Page Not Found</h2>
                <p className="text-lg mt-2 text-gray-600">
                    Oops! The page you are looking for does not exist.
                </p>
                <Link to="/" className="mt-6 inline-block px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-500 transition">
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
