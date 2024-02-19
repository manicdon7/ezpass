import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import img from '../assets/pexels-teddy-yang-2263436.jpg';

const bg = {
  backgroundImage: `url(${img})`,
  backgroundSize: "cover",
};

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const userEmail = user.email;
          const idToken = await user.getIdToken();
          console.log(userEmail);
          const response = await fetch("http://localhost:5000/api/dashboard", {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
          if (response.ok) {
            const eventData = await response.json();
            // Filter events based on current user's email
            const filteredEvents = eventData.filter(event => event.hostedBy === userEmail);
            setEvents(filteredEvents);
            setLoading(false);
          } else {
            console.error("Failed to fetch events");
          }
        } else {
          console.error("User not authenticated");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const authListener = onAuthStateChanged(getAuth(), (user) => {
      fetchData();
    });

    return () => {
      authListener();
    };
  }, []);

  return (
    <div className="bg-black h-screen poppins-font" style={bg}>
      <h1 className="text-4xl font-bold text-white pt-10 flex justify-center hover:underline">Dashboard</h1>
      <div className="text-white mx-2">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {events.length > 0 ? (
              <div className="grid grid-cols-3">
                {events.map((event, index) => (
                  <div className="mt-10" key={index}>
                    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                      <div className="p-5">
                        <Link to={`/event/${event._id}`}>
                          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white ">
                            {event.name}
                          </h5>
                        </Link>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Event Location<br />{event.location}</p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Total Tickets<br />{event.totalTickets}</p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Price<br />{event.price}</p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Date<br />{event.date}</p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Time<br />{event.time}</p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Hosted By<br />{event.hostedBy}</p>

                        <Link
                          to={`/approval/${event._id}`}
                          className="text-black bg-yellow-300 py-1 px-2 rounded-lg"
                        >
                          Show Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No events found for this user.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
