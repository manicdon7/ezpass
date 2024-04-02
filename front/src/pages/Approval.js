import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import emailjs from '@emailjs/browser';

const ApprovalRequests = () => {
  const { id } = useParams();
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

  const handleApproval = async (eventId, userEmail, isApproved) => {
    try {
      const response = await fetch(`https://ezpass-backend.vercel.app/api/approve-request/${eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail, approve: isApproved }),
      });

      if (response.ok) {
        setApprovalRequests(prevRequests => prevRequests.filter(request => request.eventId !== eventId));
        sendApprovalEmail(userEmail, isApproved);
      } else {
        console.error("Failed to update request status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const sendApprovalEmail = (userEmail, isApproved) => {
    const templateId = isApproved ? 'template_wpezusn' : 'template_wpezusn'; // Adjust template IDs as needed

    emailjs.send('service_2onmr4k', templateId, {
      to_email: userEmail,
    }, '2E3UzQ9GieXS_NXxN',
    ) 
      .then((response) => {
        console.log('Email sent:', response);
        alert(`Email ${isApproved ? 'approved' : 'rejected'} successfully sent to ${userEmail}`);
      })
      .catch((error) => {
        console.log(error);
        console.error('Email error:', error);
        alert(`Failed to send email to ${userEmail}. Please try again later.`);
      });
  };

  return (
    <div className="bg-white border border-gray-600 rounded-lg shadow-xl p-6 mx-2 md:mx-20 my-4 md:my-2">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Approval Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Event ID</th>
                <th className="px-4 py-2">User Email</th>
                <th className="px-4 py-2">Booking Details</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvalRequests.map((request, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="border px-4 py-2">{request.eventId}</td>
                  <td className="border px-4 py-2">{request.userEmail}</td>
                  <td className="border px-4 py-2">{JSON.stringify(request.bookingDetails)}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleApproval(request.eventId, request.userEmail, true)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600 mr-2">Approve</button>
                    <button onClick={() => handleApproval(request.eventId, request.userEmail, false)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApprovalRequests;
