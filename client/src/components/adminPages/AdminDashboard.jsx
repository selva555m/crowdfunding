import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaClipboardList,
  FaSignOutAlt,
  FaClock,
  FaDev,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminHeader";
import DashboardStats from "./DashboardStatus";
import ManageUsers from "./ManageUsers";
import ManageCampaigns from "./ManageCampaigns";
import ManagePendingCampaigns from "./ManagePendingCampaign";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    navigate("/");
  };

  const renderSection = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardStats />;
      case "users":
        return <ManageUsers />;
      case "campaigns":
        return <ManageCampaigns />;
      case "pending":
        return <ManagePendingCampaigns />;
      default:
        return <DashboardStats />;
    }
  };

  // ✅ Close sidebar when tapping outside (mobile)
  const handleCloseSidebar = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.addEventListener("touchstart", handleCloseSidebar);
    } else {
      document.removeEventListener("touchstart", handleCloseSidebar);
    }

    return () => document.removeEventListener("touchstart", handleCloseSidebar);
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen">
      {/* ✅ Mobile Overlay (Touch to Close Sidebar) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ✅ Sidebar (Ref for Outside Clicks) */}
      <div
        ref={sidebarRef}
        className={`fixed z-50 bg-indigo-700 text-white w-64 h-full p-6 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0`}
      >
        {/* Close Button for Mobile */}
        <div className="md:hidden flex justify-end">
          <button onClick={() => setSidebarOpen(false)}>
            <FaTimes className="text-2xl text-white" />
          </button>
        </div>

        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-4">
          <li
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-indigo-600"
            onClick={() => navigate("/")}
          >
            <FaHome /> Home
          </li>
          <li
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-indigo-500"
                : "hover:bg-indigo-600"
            }`}
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen(false);
            }}
          >
            <FaDev /> Dashboard
          </li>
          <li
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
              activeTab === "users" ? "bg-indigo-500" : "hover:bg-indigo-600"
            }`}
            onClick={() => {
              setActiveTab("users");
              setSidebarOpen(false);
            }}
          >
            <FaUsers /> Manage Users
          </li>
          <li
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
              activeTab === "campaigns"
                ? "bg-indigo-500"
                : "hover:bg-indigo-600"
            }`}
            onClick={() => {
              setActiveTab("campaigns");
              setSidebarOpen(false);
            }}
          >
            <FaClipboardList /> Manage Campaigns
          </li>
          <li
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
              activeTab === "pending" ? "bg-indigo-500" : "hover:bg-indigo-600"
            }`}
            onClick={() => {
              setActiveTab("pending");
              setSidebarOpen(false);
            }}
          >
            <FaClock /> Waiting for Approval
          </li>
          <li
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-red-600"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 md:ml-64 h-screen overflow-auto">
        {/* ✅ Mobile Navbar (Hamburger Menu) */}
        <div className="md:hidden bg-indigo-700 text-white p-4 flex items-center">
          <button onClick={() => setSidebarOpen(true)}>
            <FaBars className="text-2xl" />
          </button>
          <h2 className="ml-4 text-lg font-semibold">Admin Panel</h2>
        </div>

        <AdminHeader />
        <div className="p-6">{renderSection()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
