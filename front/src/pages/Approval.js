import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ApprovalRequests = () => {
  const { id }   = useParams();
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchApprovalRequests = async () => {
      try {
        const response = await fetch(`https://ezpass-backend.vercel.app/api/approval/${id}`);
        if (response.ok) {
          const data = await response.json();
          setApprovalRequests(data);
        } else {
          console.error("Failed to fetch approval requests:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching approval requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalRequests();
  }, [id]);

  const handleApprove = async (eventId, userEmail) => {
    try {
      const response = await fetch(`https://ezpass-backend.vercel.app/api/approve-request/${eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail, approve: true }),
      });

      if (response.ok) {
        // Update UI to remove the approval request
        setApprovalRequests(prevRequests => prevRequests.filter(request => request.eventId !== eventId));
      } else {
        console.error("Failed to approve user:", response.statusText);
      }
    } catch (error) {
      console.error("Error handling approval:", error);
    }
  };
  
  const handleReject = async (eventId, userEmail) => {
    try {
      const response = await fetch(`https://ezpass-backend.vercel.app/api/approve-request/${eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail, approve: false }),
      });


      if (response.ok) {
        // Update UI to remove the approval request
        setApprovalRequests(prevRequests => prevRequests.filter(request => request.eventId !== eventId));
      } else {
        console.error("Failed to reject user:", response.statusText);
      }
    } catch (error) {
      console.error("Error handling rejection:", error);
    }
  };
  

  return (
    <div className="bg-white border border-gray-600 rounded-lg shadow-xl p-6 mx-20 my-2">
  <h2 className="text-2xl font-bold mb-4">Approval Requests</h2>
  {loading ? (
    <p>Loading...</p>
  ) : (
    <ul className="divide-y divide-gray-200">
      {approvalRequests.map((request, index) => (
        <li key={index} className="py-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-lg font-semibold">Event ID: {request.eventId}</p>
              <p className="text-lg">User Email: {request.userEmail}</p>
              <p className="text-lg">Booking Details: {JSON.stringify(request.bookingDetails)}</p>
            </div>
            <div>
              <button onClick={() => handleApprove(request.eventId, request.userEmail)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600 mr-2">Approve</button>
              <button onClick={() => handleReject(request.eventId, request.userEmail)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">Reject</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

  );
};

export default ApprovalRequests;
