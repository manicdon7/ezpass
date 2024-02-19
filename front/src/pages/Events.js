import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const img = require('../assets/photo-1522327646852-4e28586a40dd.avif');

const bg = {
  backgroundImage: `url(${img})`,
  backgroundSize: "cover",
};

const Events = ({ userEmail }) => {
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("http://localhost:5000/api/events");
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
                <h2 className="mb-2 text-2xl font-semibold">{userEmail}</h2>
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
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-cente r">Loading events...</p>
        )}
      </div>
    </div>
  );
}

export default Events;
