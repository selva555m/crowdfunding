// React Component: ManageUsers
import React, { useState, useEffect } from "react";
import API from "../../../uitiles/api";
import { FaTrash, FaEye } from "react-icons/fa";
import { Dialog } from "@headlessui/react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get("/admin/users");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      alert("Failed to delete user. Please try again.");
    }
  };

  const fetchUserCampaigns = async (userId) => {
    try {
      const response = await API.get(`/admin/users/${userId}/campaigns`);
      setCampaigns(response.data);
    } catch (error) {
      setCampaigns([]);
    }
  };

  const openUserModal = async (user) => {
    setSelectedUser(user);
    await fetchUserCampaigns(user._id);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setCampaigns([]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Users</h2>

      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-md rounded-lg p-6 text-center relative hover:scale-105 cursor-pointer"
            >
              {user.avatar ? (
                <img
                  src={`http://localhost:8080${user.avatar}`}
                  alt={user.userName}
                  className="w-16 h-16 mx-auto mb-3 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-indigo-200 flex items-center justify-center text-xl font-bold text-indigo-700">
                  {user.userName[0].toUpperCase()}
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-900">
                {user.userName}
              </h3>
              <p
                className="text-gray-600 text-sm truncate w-full max-w-[180px] mx-auto"
                title={user.email}
              >
                {user.email}
              </p>

              <span
                className={`mt-2 inline-block px-3 py-1 text-sm rounded-full ${
                  user.role === "admin"
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>

              <button
                onClick={() => openUserModal(user)}
                className="absolute top-2 left-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700"
              >
                <FaEye />
              </button>
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-700"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <Dialog
          open={!!selectedUser}
          onClose={closeUserModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              User Details
            </h3>
            <p>
              <strong>Name:</strong> {selectedUser.userName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              {selectedUser.role.charAt(0).toUpperCase() +
                selectedUser.role.slice(1)}
            </p>
            <p>
              <strong>Registered On:</strong>{" "}
              {new Date(selectedUser.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {selectedUser.status || "Active"}
            </p>
            <h4 className="text-lg font-bold text-gray-800 mt-4">
              User Campaigns
            </h4>
            {campaigns.length > 0 ? (
              <ul>
                {campaigns.map((campaign) => (
                  <li key={campaign._id} className="border-b py-2">
                    <strong>{campaign.title}</strong>
                    <p>
                      Goal: ${campaign.goalAmount} | Raised: $
                      {campaign.raisedAmount}
                    </p>
                    <p>Status: {campaign.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No campaigns found.</p>
            )}
            <button
              onClick={closeUserModal}
              className="mt-4 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-900"
            >
              Close
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default ManageUsers;
