import React, { useState, useEffect } from "react";
import API from "../../../uitiles/api";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast"; // ✅ Import toast

const DonateForm = ({ campaignId, updateCampaign }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    fetchCampaignDetails(); // ✅ Fetch campaign details on mount
  }, []);

  const fetchCampaignDetails = async () => {
    try {
      const { data } = await API.get(`/campaigns/${campaignId}`);
      setCampaign(data);
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      toast.error("Failed to load campaign details.");
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to donate!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }

    if (!campaign) {
      toast.error("Campaign details not loaded. Please refresh.");
      return;
    }

    if (campaign.currentAmount >= campaign.goalAmount) {
      toast.error("This campaign has already reached its goal.");
      return;
    }

    const remainingAmount = campaign.goalAmount - campaign.currentAmount;
    if (amount > remainingAmount) {
      toast.error(`You can only donate up to ₹${remainingAmount}.`);
      return;
    }

    if (!window.Razorpay) {
      toast.error(
        "Razorpay SDK failed to load. Check your internet connection."
      );
      return;
    }

    setLoading(true);

    try {
      const { data } = await API.post("/payment/create-payment", {
        amount,
        campaignId,
        currency: "INR",
      });

      if (data.success) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Charity Donation",
          description: "Thank you for your donation!",
          order_id: data.order.id,
          handler: async function (response) {
            try {
              const verifyRes = await API.post("/payment/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                transactionId: data.transactionId,
              });

              if (verifyRes.data.success) {
                toast.success(
                  "Payment successful! Thank you for your donation."
                );
                setAmount("");
                fetchCampaignDetails(); // ✅ Refresh campaign details
                updateCampaign(); // ✅ Update UI
              } else {
                toast.error(
                  "Payment verification failed. Please contact support."
                );
              }
            } catch (error) {
              console.error("Verification error:", error);
              toast.error("Error verifying payment. Please try again.");
            }
          },
          theme: { color: "#6366F1" },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

        razorpay.on("payment.failed", function (response) {
          console.error("Payment failed:", response.error);
          toast.error("Payment failed. Please try again.");
        });
      } else {
        toast.error("Payment initiation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-6 bg-indigo-50 rounded-lg">
      <Toaster position="top-center" reverseOrder={false} />{" "}
      {/* ✅ Add Toaster */}
      <h3 className="text-xl font-semibold text-gray-800">Make a Donation</h3>
      {campaign && (
        <p className="text-gray-600">
          Goal: ₹{campaign.goalAmount} | Raised: ₹{campaign.currentAmount}
        </p>
      )}
      <form onSubmit={handleDonate} className="mt-4">
        <label className="block text-gray-700">Enter Amount (₹):</label>
        <input
          type="number"
          className="w-full p-3 border border-gray-300 rounded-lg mt-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="1"
          max={campaign ? campaign.goalAmount - campaign.currentAmount : ""}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg mt-4 hover:bg-indigo-500 disabled:opacity-50"
          disabled={
            loading ||
            !campaign ||
            campaign.currentAmount >= campaign.goalAmount
          }
        >
          {loading ? "Processing..." : "Donate Now"}
        </button>
      </form>
    </div>
  );
};

export default DonateForm;
