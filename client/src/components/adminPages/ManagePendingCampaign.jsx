import React, { useState, useEffect } from "react";
import API from "../../../uitiles/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManagePendingCampaigns = () => {
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPendingCampaigns();
  }, []);

  const fetchPendingCampaigns = async () => {
    try {
      const response = await API.get("/admin/campaigns/pending");
      const filteredCampaigns = response.data.filter(
        (campaign) => !campaign.isApproved && !campaign.isActive
      );
      setPendingCampaigns(filteredCampaigns);
      toast.success("Pending campaigns loaded successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      setError("Failed to load pending campaigns.");
      toast.error("Error fetching pending campaigns!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const approveAndActivateCampaign = async (campaignId) => {
    try {
      await API.put(`/admin/campaigns/${campaignId}/approve`, {
        isActive: true,
        isApproved: true,
      });
      setPendingCampaigns((prev) => prev.filter((c) => c._id !== campaignId));
      toast.success("Campaign activated and approved successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to approve and activate campaign.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const deleteCampaign = async (campaignId) => {
    if (!window.confirm("Are you sure you want to delete this campaign?"))
      return;
    try {
      await API.delete(`/admin/campaigns/${campaignId}`);
      setPendingCampaigns((prev) => prev.filter((c) => c._id !== campaignId));
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

  const requestMoreDetails = async (campaignId) => {
    try {
      await API.post(`/admin/campaigns/${campaignId}/request-details`);
      toast.success("Request for more details sent successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to send request for more details.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Inactive Pending Campaigns
      </h2>

      {loading ? (
        <p className="text-gray-600">Loading pending campaigns...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : pendingCampaigns.length === 0 ? (
        <p className="text-gray-600">No inactive pending campaigns.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {pendingCampaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="bg-white shadow-md rounded-lg p-6 transition-transform transform hover:scale-105"
            >
              {campaign.images?.length > 0 && (
                <img
                  src={campaign.images[0].path}
                  alt={campaign.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                {campaign.title}
              </h3>
              <p className="text-gray-600 text-sm">{campaign.description}</p>

              <p className="text-gray-700 text-sm mt-2">
                <strong>Category:</strong> {campaign.category || "N/A"}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Goal:</strong> ₹
                {(campaign.goalAmount || 0).toLocaleString()}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Raised:</strong> ₹
                {(campaign.currentAmount || 0).toLocaleString()}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Deadline:</strong>{" "}
                {new Date(campaign.deadline).toLocaleDateString()}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Status:</strong> {campaign.status || "Pending"}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Created By:</strong>{" "}
                {campaign.creator?.email || "Unknown"}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Created At:</strong>{" "}
                {new Date(campaign.createdAt).toLocaleDateString()}
              </p>

              {campaign.documents?.length > 0 && (
                <div className="mt-2">
                  <p className="text-gray-700 text-sm">
                    <strong>Documents:</strong>
                  </p>
                  {campaign.documents.map((document) => (
                    <div
                      key={document._id}
                      className="flex items-center space-x-2"
                    >
                      <span className="text-gray-600 text-sm">
                        {document.filename}
                      </span>
                      <button
                        className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded"
                        onClick={() =>
                          window.open(
                            `http://localhost:8080/campaign-files/${document.filename}`,
                            "_blank"
                          )
                        }
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-col space-y-2">
                <button
                  className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded"
                  onClick={() => approveAndActivateCampaign(campaign._id)}
                >
                  Activate & Approve
                </button>

                <button
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded"
                  onClick={() => requestMoreDetails(campaign._id)}
                >
                  Request More Details
                </button>

                <button
                  className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded"
                  onClick={() => deleteCampaign(campaign._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ManagePendingCampaigns;
