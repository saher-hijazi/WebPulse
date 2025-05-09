import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Mock user data - in a real app, this would come from authentication context
  const user = { name: 'John Doe' };

  const handleLogout = () => {
    // Implement logout functionality
    console.log('Logging out...');
    // Redirect to login page
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">WebPulse</span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div className="flex items-center space-x-4">
                <span>{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded-md text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
