import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../../uitiles/api";
import { useAuth } from "../../context/AuthContext"; // Import Auth Context

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); // Get token from AuthContext

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    deadline: "",
    category: "",
    campaignphotos: [],
    imagePreviews: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = ["Technology", "Health", "Education", "Art", "Other"];

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle multiple file uploads
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    let validFiles = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
      } else if (file.size > 10 * 1024 * 1024) {
        // Increased to 10MB
        setError("File size must be less than 10MB.");
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setError("");
      setFormData({
        ...formData,
        campaignphotos: [...formData.campaignphotos, ...validFiles],
        imagePreviews: [
          ...formData.imagePreviews,
          ...validFiles.map((file) => URL.createObjectURL(file)),
        ],
      });
    }
  };

  // Remove an image from preview and list
  const removeImage = (index) => {
    const newPhotos = [...formData.campaignphotos];
    const newPreviews = [...formData.imagePreviews];

    newPhotos.splice(index, 1);
    URL.revokeObjectURL(newPreviews[index]); // Prevent memory leaks
    newPreviews.splice(index, 1);

    setFormData({
      ...formData,
      campaignphotos: newPhotos,
      imagePreviews: newPreviews,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      toast.error("You must be logged in to create a campaign.");
      navigate("/login");
      return;
    }

    if (formData.campaignphotos.length === 0) {
      toast.error("Please upload at least one image.");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "imagePreviews" && key !== "campaignphotos") {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append multiple images
    formData.campaignphotos.forEach((file) => {
      formDataToSend.append("campaignphotos", file);
    });

    try {
      await API.post("/campaigns", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Campaign created successfully! Waiting for approval.");
      setFormData({
        title: "",
        description: "",
        goalAmount: "",
        deadline: "",
        category: "",
        campaignphotos: [],
        imagePreviews: [],
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Campaign creation failed. Please try again."
      );
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl w-full max-w-xl mx-auto sm:max-w-2xl md:max-w-3xl lg:w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Create Campaign
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <label className="block text-sm font-medium text-gray-700">
          Upload Images
        </label>
        <div className="relative border-2 border-dashed p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500">
          <label className="flex flex-col items-center cursor-pointer">
            <FaUpload className="text-indigo-500 text-2xl mb-2" />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-gray-600">
              {formData.campaignphotos.length > 0
                ? `${formData.campaignphotos.length} images selected`
                : "Choose images"}
            </span>
          </label>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Image Previews */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {formData.imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>

        {/* Campaign Details */}
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />
        <input
          type="number"
          name="goalAmount"
          placeholder="Goal Amount"
          value={formData.goalAmount}
          onChange={handleChange}
          min="1"
          required
          className="w-full p-3 border rounded-lg"
        />
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />

        {/* Category Dropdown */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-3 bg-indigo-500 text-white rounded-lg"
          disabled={loading || formData.campaignphotos.length === 0}
        >
          {loading ? "Creating..." : "Create Campaign"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateCampaign;
