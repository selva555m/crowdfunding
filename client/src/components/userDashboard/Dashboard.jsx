import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaDonate,
  FaClipboardList,
  FaSignOutAlt,
  FaHome,
  FaPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import DonationHistory from "./DonationHistory";
import MyCampaigns from "./MyCampaigns";
import CreateCampaign from "./CreateCampaign";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest(".sidebar")) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center">
      {/* Sidebar */}
      <div
        className={`sidebar fixed inset-y-0 left-0 transform bg-indigo-700 text-white p-6 w-64 z-10 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <button
            className="lg:hidden text-white text-2xl"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        <ul className="space-y-4">
          <li
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
              activeSection === "profile"
                ? "bg-indigo-500"
                : "hover:bg-indigo-600"
            }`}
            onClick={() => {
              setActiveSection("profile");
              setSidebarOpen(false);
            }}
          >
            <FaUser /> Profile
          </li>
          <li
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
              activeSection === "donations"
                ? "bg-indigo-500"
                : "hover:bg-indigo-600"
            }`}
            onClick={() => {
              setActiveSection("donations");
              setSidebarOpen(false);
            }}
          >
            <FaDonate /> Donation History
          </li>
          <li
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
              activeSection === "campaigns"
                ? "bg-indigo-500"
                : "hover:bg-indigo-600"
            }`}
            onClick={() => {
              setActiveSection("campaigns");
              setSidebarOpen(false);
            }}
          >
            <FaClipboardList /> My Campaigns
          </li>
          <li
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
              activeSection === "create"
                ? "bg-indigo-500"
                : "hover:bg-indigo-600"
            }`}
            onClick={() => {
              setActiveSection("create");
              setSidebarOpen(false);
            }}
          >
            <FaPlus /> Create Campaign
          </li>
          <li
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-green-600"
            onClick={() => navigate("/")}
          >
            <FaHome /> Home
          </li>
          <li
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-red-600"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <button
          className="lg:hidden text-2xl text-indigo-700 mb-4"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars />
        </button>
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Welcome
        </h2>

        <div className="mb-10 items-center min-h-screen ">
          <div className="w-full mt-5 ">
            {activeSection === "profile" && <ProfileCard />}
            {activeSection === "donations" && <DonationHistory />}
            {activeSection === "campaigns" && <MyCampaigns />}
            {activeSection === "create" && <CreateCampaign />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
