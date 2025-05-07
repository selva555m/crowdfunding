import React, { useState, useEffect } from "react";
import API from "../../../uitiles/api"; // Your Axios instance
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const MyCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth(); // Get logged-in user details

  // State for editing campaigns
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserCampaigns();
    }
  }, [user]);

  const fetchUserCampaigns = async () => {
    try {
      const response = await API.get(`/auth/campaigns`);
      setCampaigns(response.data);
    } catch (err) {
      setError("Failed to load your campaigns.");
      toast.error("Failed to load campaigns!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (campaign) => {
    setEditingCampaign(campaign);
    setEditedData({
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goalAmount,
    });
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdateCampaign = async () => {
    if (!editingCampaign) return;

    const formData = new FormData();
    formData.append("title", editedData.title);
    formData.append("description", editedData.description);
    formData.append("goalAmount", editedData.goalAmount);
    if (file) {
      formData.append("campaignfiles", file);
    }

    try {
      const response = await API.patch(
        `/campaigns/${editingCampaign._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Campaign updated successfully!");

      // Update state after successful edit
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((camp) =>
          camp._id === editingCampaign._id ? { ...camp, ...editedData } : camp
        )
      );

      setEditingCampaign(null); // Close modal
    } catch (err) {
      toast.error("Failed to update campaign!");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">My Campaigns</h3>

      {loading ? (
        <p className="text-gray-600">Loading your campaigns...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : campaigns.length === 0 ? (
        <p className="text-gray-600">You haven't created any campaigns yet.</p>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="bg-gray-100 p-4 rounded-md shadow relative"
            >
              <h4 className="text-lg font-semibold text-gray-900">
                {campaign.title}
              </h4>
              <p className="text-gray-700">{campaign.description}</p>

              {/* Additional Campaign Details */}
              <p className="text-sm text-gray-600">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    campaign.isApproved ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {campaign.isApproved ? "Approved" : "Pending Approval"}
                </span>
              </p>

              <p className="text-sm text-gray-600">
                <strong>Active:</strong>{" "}
                <span
                  className={`font-semibold ${
                    campaign.isActive ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {campaign.isActive ? "Yes" : "No"}
                </span>
              </p>

              <p className="text-sm text-gray-600">
                <strong>Category:</strong> {campaign.category || "N/A"}
              </p>

              <p className="text-sm text-gray-600">
                <strong>Goal Amount:</strong> ₹
                {campaign.goalAmount.toLocaleString()}
              </p>

              <p className="text-sm text-gray-600">
                <strong>Raised Amount:</strong> ₹
                {campaign.currentAmount.toLocaleString()}
              </p>

              <p className="text-sm text-gray-600">
                <strong>Number of Supporters:</strong>{" "}
                {campaign.supportersCount || 0}
              </p>

              <p className="text-sm text-gray-600">
                <strong>Deadline:</strong>{" "}
                {new Date(campaign.deadline).toLocaleDateString()}
              </p>

              <p className="text-sm text-gray-600">
                <strong>Created On:</strong>{" "}
                {new Date(campaign.createdAt).toLocaleDateString()}
              </p>

              {/* Show Edit Button Only if Status: Pending Approval & Active: No */}
              {!campaign.isApproved && !campaign.isActive && (
                <button
                  onClick={() => handleEditClick(campaign)}
                  className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingCampaign && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Edit Campaign
            </h3>

            <input
              type="text"
              name="title"
              value={editedData.title}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded-md"
              placeholder="Campaign Title"
            />

            <textarea
              name="description"
              value={editedData.description}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded-md"
              placeholder="Campaign Description"
            />

            <input
              type="number"
              name="goalAmount"
              value={editedData.goalAmount}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded-md"
              placeholder="Goal Amount"
            />

            {/* File Upload */}
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 mb-2 border rounded-md"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingCampaign(null)}
                className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCampaign}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default MyCampaigns;
