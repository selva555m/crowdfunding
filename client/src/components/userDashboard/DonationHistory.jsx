import React, { useState, useEffect } from "react";
import API from "../../../uitiles/api"; // Axios instance
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDonationHistory();
  }, []);

  const fetchDonationHistory = async () => {
    try {
      const response = await API.get("/payment/history");
      setDonations(response.data);
      toast.success("Donation history loaded successfully! 🎉");
    } catch (err) {
      setError("Failed to load donation history.");
      toast.error("❌ Failed to load donation history!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Donation History
      </h3>

      {loading ? (
        <p className="text-gray-600">Loading your donation history...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : donations.length === 0 ? (
        <p className="text-gray-600">You haven't made any donations yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {donations.map((donation) => (
            <div
              key={donation._id}
              className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm"
            >
              <h4 className="text-lg font-semibold text-gray-900">
                {donation.campaignId?.title || "General Donation"}
              </h4>

              <div className="mt-2">
                <p className="text-gray-700">
                  <strong>Amount:</strong>{" "}
                  <span className="text-green-600">
                    ₹{donation.amount.toLocaleString()} {donation.currency}
                  </span>
                </p>
                <p className="text-gray-700">
                  <strong>Payment Method:</strong> {donation.paymentMethod}
                </p>
                <p className="text-gray-700">
                  <strong>Razorpay Order ID:</strong>{" "}
                  <span className="text-blue-600">
                    {donation.razorpayOrderId}
                  </span>
                </p>
                {donation.razorpayPaymentId ? (
                  <p className="text-gray-700">
                    <strong>Payment ID:</strong>{" "}
                    <span className="text-blue-600">
                      {donation.razorpayPaymentId}
                    </span>
                  </p>
                ) : null}
                <p className="text-gray-700">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      donation.status === "success"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {donation.status.toUpperCase()}
                  </span>
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Date:</strong>{" "}
                  {new Date(donation.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DonationHistory;
