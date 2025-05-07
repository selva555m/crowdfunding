import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../uitiles/api";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logo.png"; // Import Logo
import background from "../../assets/background.jpg"; // Import Background Image

const LoginForm = ({ closeModal }) => {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

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
      const { data } = await API.post("/auth/login", formData);
      login(data.token);

      toast.success("Login successful! Redirecting...");
      closeModal();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "No Data Found Please Register";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }} // Use Background Image
    >
      <div className="w-96 p-8 bg-white bg-opacity-90 shadow-2xl rounded-2xl relative">
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

        <h2 className="text-3xl font-bold text-center text-gray-700">Login</h2>
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
            className="w-full p-3 mt-4 cursor-pointer bg-gradient-to-bl from-indigo-500 to-purple-300 text-white rounded-lg hover:from-indigo-600 hover:to-purple-400"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-700">
          Don't have an account?{" "}
          <span
            className="text-indigo-500 cursor-pointer font-semibold"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
};

export default LoginForm;
