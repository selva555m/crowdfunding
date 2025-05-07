import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import API from "../../../uitiles/api";
import background from "../../assets/background.jpg"; // Import Background Image
import logo from "../../assets/logo.png"; // Import Logo

const AdminLoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const response = await API.post("/admin/login", formData);
      console.log("API Response:", response.data);

      if (response.data.token) {
        login(response.data.token); // Store token
        toast.success("Login successful!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid response from server.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Invalid credentials, please try again.");
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
        <button
          className="absolute top-3 right-3 text-gray-500 text-lg"
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
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
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
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <p
            className="text-indigo-500 text-sm cursor-pointer text-right font-semibold"
            onClick={() => alert("Forgot Password clicked!")}
          >
            Forgot Password?
          </p>
          <button
            type="submit"
            className="w-full p-3 mt-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminLoginForm;
