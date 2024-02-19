// Navbar.js
import React from 'react';

const Navbar = ({ userEmail }) => {
  return (
    <div className="py-2 px-20 bg-black w-full">
      <div className="flex justify-between text-white py-2 bg-white/30 rounded-full px-4">
        <div className="flex items-center">
          <h1 className="text-yellow-400 text-2xl font-bold">🎟️EasyPass</h1>
        </div>
        <div className="flex items-center gap-6">
          <a href="/" className="text-lg">
            Home
          </a>
          <a href="/Dashboard" className="text-lg">
            Dashboard
          </a>
          <a href="/host" className="text-lg">
            Host
          </a>
          <a href="/events" className="text-lg">
            Events
          </a>
        </div>
        {userEmail && (
          <span className="text-lg">{userEmail}</span>
        )}
      </div>
    </div>
  );
};

export default Navbar;
