import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

const img = require('../assets/photo-1522327646852-4e28586a40dd.avif');

const bg = {
  backgroundImage: `url(${img})`,
  backgroundSize: "cover",
};

const Events = ({ userEmail }) => {
  const [eventList, setEventList] = useState([]);
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [popupClosed, setPopupClosed] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setShowSignInPopup(false);
      setPopupClosed(true);
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("https://ezpass-backend.vercel.app/api/events");
        if (response.ok) {
          const eventData = await response.json();
          setEventList(eventData);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchEvents();
  }, []);

  useEffect(() => {
    if (user && popupClosed) {
      setShowSignInPopup(false);
    }
  }, [user, popupClosed]);

  return (
    <div className="bg-black min-h-screen py-10 px-5 poppins-font" style={bg}>
      <h1 className="text-4xl text-yellow-400 text-center font-bold mb-10">Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eventList.length > 0 ? (
          eventList.map((event) => (
            <div key={event._id} className="bg-gradient-to-br from-yellow-300 via-gray-400 to-gray-200   p-2 rounded-lg shadow-lg">
              <img
                className="w-full h-48 object-cover object-center rounded-t-lg"
                src={`data:${event.contentType};base64,${event.image}`}
                alt={event.name}
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{event.name}</h2>
                <p className="text-gray-700 mb-3">Location: {event.location}</p>
                <p className="text-gray-700 mb-3">Available Seats: {event.totalTickets}</p>
                <p className="text-gray-700 mb-3">Event Time: {event.time}</p>
                {!user && (
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-4 ml-32" onClick={() => setShowSignInPopup(true)}>Sign in to book</button>
                )}
                {user && (
                  <Link
                    to={{
                      pathname: `/event/${event._id}`,
                      search: `?userEmail=${userEmail}`,
                    }}
                    className="block w-full text-center mt-6"
                  >
                    <button className="bg-gradient-to-r from-red-800 via-yellow-600 to-yellow-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-red-800 text-white py-2 px-4 rounded-lg">
                      Book Now
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center">Loading events...</p>
        )}
      </div>
      {showSignInPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Sign in to book an event</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-4" onClick={signInWithGoogle}>Sign in with Google</button>
            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg" onClick={() => setShowSignInPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
