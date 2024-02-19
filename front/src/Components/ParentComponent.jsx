// ParentComponent.js
import React, { useState } from 'react';
import Connect from '../pages/Connect';

function ParentComponent() {
  const [userEmail, setUserEmail] = useState(null);

  return (
    <div>
<div className="py-2 px-20 bg-black w-full">
  <div className="flex justify-between items-center text-white py-2 bg-white/30 rounded-full px-4 poppins-font">
    <div className="flex items-center">
      <h1 className="text-yellow-400 text-2xl font-bold">🎟️EasyPass</h1>
    </div>
    <div className="flex items-center gap-6">
      <a href="/" className="text-lg hover:underline">
        Home
      </a>
      <a href="/Dashboard" className="text-lg hover:underline">
        Dashboard
      </a>
      <a href="/host" className="text-lg hover:underline">
        Host
      </a>
      <a href="/events" className="text-lg hover:underline">
        Events
      </a>
    </div>
    <div className="flex items-center gap-6">
      {userEmail && (
        <span className="text-lg">{userEmail}</span>
      )}
      <Connect setUserEmail={setUserEmail} />
    </div>
  </div>
</div>
    </div>
  );
}

export default ParentComponent;
