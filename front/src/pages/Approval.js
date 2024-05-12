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
        const event = approvalRequests.find(request => request.eventId === eventId);
        if (isApproved && event && event.ticketPrice > 0) {
          generatePaymentLink(eventId, userEmail);
        } else if (!isApproved) {
          sendRejectionEmail(userEmail);
        }
      } else {
        console.error("Failed to update request status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };
  
  const generatePaymentLink = async (eventId, userEmail) => {
    try {
      const response = await fetch(`https://ezpass-backend.vercel.app/api/payment-link/${eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail }),
      });

      if (response.ok) {
        const { paymentLink } = await response.json();
        sendPaymentLinkEmail(userEmail, paymentLink);
      } else {
        console.error("Failed to generate payment link:", response.statusText);
      }
    } catch (error) {
      console.error("Error generating payment link:", error);
    }
  };

  const sendPaymentLinkEmail = (to_email, paymentLink) => {
    const templateParams = {
      to_email,
      paymentLink
    };

    emailjs.send('service_2onmr4k', 'template_wpezusn', templateParams, '2E3UzQ9GieXS_NXxN')
      .then((response) => {
        console.log('Payment link email sent:', response);
        alert(`Payment link successfully sent to ${to_email}`);
      })
      .catch((error) => {
        console.error('Payment link email error:', error);
        alert(`Failed to send payment link to ${to_email}. Please try again later.`);
      });
  };

  const sendRejectionEmail = (to_email) => {
    emailjs.send('service_2onmr4k', 'template_wpezusn','2E3UzQ9GieXS_NXxN', {
      to_email,
      isRejected: true
    }, '2E3UzQ9GieXS_NXxN')
      .then((response) => {
        console.log('Rejection email sent:', response);
        alert(`Rejection email successfully sent to ${to_email}`);
      })
      .catch((error) => {
        console.error('Rejection email error:', error);
        alert(`Failed to send rejection email to ${to_email}. Please try again later.`);
      });
  };

  return (
    <div className="bg-white border border-gray-600 rounded-lg shadow-xl p-6 mx-2 md:mx-20 my-4 md:my-2">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Approval Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="divide-y divide-gray-400">
          {approvalRequests.map((request, index) => (
            <li key={index} className="py-6">
              <div className="md:flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-sm md:text-lg font-semibold">Event ID: {request.eventId}</p>
                  <p className="text-sm md:text-lg">User Email: {request.userEmail}</p>
                  <p className="text-sm md:text-lg">Booking Details: {JSON.stringify(request.bookingDetails)}</p>
                </div>
                <div className="mt-3 md:mt-0">
                  <button onClick={() => handleApproval(request.eventId, request.userEmail, true)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600 mr-2">Approve</button>
                  <button onClick={() => handleApproval(request.eventId, request.userEmail, false)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">Reject</button>
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
