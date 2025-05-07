import React, { useState, useEffect } from "react";
import API from "../../../uitiles/api"; // Axios instance
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";

const ManageCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await API.get(
        "/admin/campaigns?isActive=true&isApproved=true"
      );
      setCampaigns(response.data);
      toast.success("Campaigns loaded successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      setError("Failed to load campaigns. Please try again.");
      toast.error("Error fetching campaigns!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (campaignId) => {
    if (!window.confirm("Are you sure you want to delete this campaign?"))
      return;
    try {
      await API.delete(`/admin/campaigns/${campaignId}`);
      setCampaigns((prev) =>
        prev.filter((campaign) => campaign._id !== campaignId)
      );
      toast.success("Campaign deleted successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to delete campaign.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">
        Manage Campaigns
      </h2>

      {loading ? (
        <p className="text-gray-600 text-lg">Loading campaigns...</p>
      ) : error ? (
        <p className="text-red-500 text-lg">{error}</p>
      ) : campaigns.length === 0 ? (
        <p className="text-gray-600 text-lg">
          No active and approved campaigns found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const progress =
              (campaign.currentAmount / campaign.goalAmount) * 100;

            return (
              <div
                key={campaign._id}
                className="bg-white shadow-md rounded-lg p-5 transition-all hover:shadow-lg hover:scale-105 flex flex-col justify-between"
              >
                {/* Campaign Title */}
                <h3 className="text-xl font-bold text-gray-900 truncate">
                  {campaign.title}
                </h3>

                {/* Campaign Description */}
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                  {campaign.description}
                </p>

                {/* Status & Amount Raised */}
                <div className="mt-4">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-500 text-white">
                    Active & Approved
                  </span>

                  {/* Amount Raised */}
                  <div className="mt-3">
                    <p className="text-gray-700 text-sm font-semibold">
                      Raised: ${campaign.currentAmount.toLocaleString()} / $
                      {campaign.goalAmount.toLocaleString()}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-300 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex justify-end">
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-md hover:bg-red-600 transition-all"
                    onClick={() => deleteCampaign(campaign._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageCampaigns;
