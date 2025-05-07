import React, { useEffect, useState } from "react";
import API from "../../../uitiles/api";
import Loading from "../Loading";

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loading />;

  if (!stats) {
    return <p className="text-center text-red-500">Failed to load stats</p>;
  }

  const statsData = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      color: "text-indigo-600",
    },
    {
      title: "Active Campaigns",
      value: stats.activeCampaigns,
      color: "text-green-600",
    },
    {
      title: "Total Donations",
      value: `₹${stats.totalDonations.toLocaleString()}`,
      color: "text-blue-600",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-4 px-4">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="p-4 sm:p-5 md:p-6 bg-white shadow-md rounded-lg text-center transition-transform transform hover:scale-105"
        >
          <h3 className="text-xs sm:text-sm md:text-md lg:text-lg font-semibold mb-1">
            {stat.title}
          </h3>
          <p className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ${stat.color}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
