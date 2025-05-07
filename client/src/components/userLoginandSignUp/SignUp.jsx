import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../uitiles/api"; // Import API service
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles
import background from "../../assets/background.jpg"; // Import Background Image
import logo from "../../assets/logo.png"; // Import Logo

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email.includes("@")) {
      newErrors.email = "Valid email is required";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await API.post("/auth/register", formData);
      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }} // Apply Background Image
    >
      <div className="relative w-96 p-8 bg-white bg-opacity-90 shadow-2xl rounded-2xl">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 text-xl hover:text-gray-700"
          onClick={() => navigate("/")}
        >
          ✕
        </button>

        {/* Logo and Name */}
        <div className="flex justify-center items-center mb-4">
          <img src={logo} alt="Logo" className="h-16 mr-2" />
          <h1 className="text-3xl font-bold text-indigo-500">Crowd Funding</h1>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-700">
          Sign Up
        </h2>
        {errors.general && (
          <p className="text-red-500 text-sm text-center mt-2">
            {errors.general}
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-3 mt-4 cursor-pointer bg-gradient-to-bl from-indigo-500 to-purple-400 text-white rounded-lg hover:from-indigo-600 hover:to-purple-500"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-700">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer font-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default SignupForm;
