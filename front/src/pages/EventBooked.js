import React from "react";
import { useLocation } from "react-router-dom";

const EventBooked = () => {
    const { state } = useLocation();
    const event = state ? state.event : null;

    return (
        <div className="bg-black play-font">
            <div>
                <h1 className="text-4xl text-yellow-400 flex justify-center pt-5 font-bold">
                    Event Booked
                </h1>
            </div>
            <div className="text-white">
                {event ? (
                    <div className="flex justify-center">
                        <div className="w-2/3">
                            <h1 className="text-3xl text-yellow-400 flex justify-center pt-5 font-extralight">
                                {event.eventName}
                            </h1>
                            <p className="pt-6 font-medium text-3xl">Host: {event.host}</p>
                            <p className="pt-6 font-medium text-3xl">Event Name: {event.eventName}</p>
                            <p className="pt-6 font-medium text-3xl">Event Location: {event.eventLocation}</p>
                            <p className="pt-6 font-medium text-3xl">Total Tickets: {event.totalTickets}</p>
                            <p className="pt-6 font-medium text-3xl">Tickets Sold: {event.ticketsSold}</p>
                            <p className="pt-6 font-medium text-3xl">Ticket Price: {event.ticketPrice}</p>
                            <p className="pt-6 font-medium text-3xl">Event Date: {event.eventDate}</p>
                            <p className="pt-6 font-medium text-3xl">Active: {event.isActive ? "Yes" : "No"}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <p className="py-10">No event details available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventBooked;