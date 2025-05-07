import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Campaigns from "./pages/Campaigns";
import CampaignDetails from "./components/campaignPages/CampaignDetails";
import LoginForm from "./components/userLoginandSignUp/Login";
import SignupForm from "./components/userLoginandSignUp/SignUp";
import AdminLoginForm from "./components/adminPages/AdminLogin";
import NotFound from "./components/NotFound";
import Dashboard from "./components/userDashboard/Dashboard";
import ProtectedRoute from "./context/ProtectedRoute";
import CreateCampaign from "./components/userDashboard/CreateCampaign";
import AdminDashboard from "./components/adminPages/AdminDashboard";
import { useAuth } from "../src/context/AuthContext";
// import AdminSidebar from "./components/adminPages/AdminSidebar";

const App = () => {
  const { user, token } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/campaigns" element={<Campaigns />} />
      <Route path="/campaigns/:id" element={<CampaignDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/admin-login" element={<AdminLoginForm />} />
      <Route path="/create-campaign" element={<CreateCampaign />} />

      <Route
        path="/dashboard"
        element={<ProtectedRoute element={token ? <Dashboard /> : <Home />} />}
      />
      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute element={<AdminDashboard />} />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
