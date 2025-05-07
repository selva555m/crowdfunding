import React, { useEffect, useState } from "react";
import API from "../../../uitiles/api"; // Axios instance
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User } from "lucide-react";

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableUserName, setEditableUserName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await API.get("/auth/profile");
      setUser(response.data);
      setEditableUserName(response.data.userName);
      setPreview(response.data.avatar);
    } catch (err) {
      setError("Failed to load user profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("userName", editableUserName);
      if (password) formData.append("password", password);
      if (image) formData.append("avatar", image); // Append profile image

      const response = await API.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(response.data);
      setPreview(response.data.avatar);
      toast.success("Profile updated successfully! ✅");
      setIsModalOpen(false);
      setPassword("");
    } catch (err) {
      toast.error("❌ Failed to update profile!");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto justify-start">
      {loading ? (
        <p className="text-gray-600">Loading profile...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {preview ? (
            <img
              src={`http://localhost:8080${preview}`} // Ensure this points to your backend
              alt="User Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-500" />
            </div>
          )}

          <h3 className="text-lg font-semibold text-gray-800">
            {user?.userName}
          </h3>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-sm text-gray-500">
            Role: <span className="font-semibold">{user?.role}</span>
          </p>
          <p className="text-sm text-gray-500">
            Auth Provider:{" "}
            <span className="font-semibold">{user?.socialAuthProvider}</span>
          </p>
          <p className="text-sm text-gray-500">
            Joined:{" "}
            <span className="font-semibold">
              {new Date(user?.createdAt).toLocaleDateString()}
            </span>
          </p>

          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full"
            onClick={() => setIsModalOpen(true)}
          >
            Update Profile
          </button>
        </>
      )}

      <ToastContainer position="top-right" autoClose={3000} />

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg font-semibold mb-4">Update Profile</h2>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
              />
            )}

            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-md mb-3"
              onChange={handleImageChange}
            />
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-3"
              value={editableUserName}
              onChange={(e) => setEditableUserName(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 border rounded-md mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={handleUpdateProfile}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
