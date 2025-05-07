import React, { memo, useEffect, useState } from "react";
import API from "../../../uitiles/api"; // API instance
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const fakeCampaigns = [
  {
    id: "1",
    title: "Save the Rainforests",
    description:
      "Help us protect the Amazon rainforest from deforestation...roviding free education to underprivileged children...",
    image: assets.sample,
    goalAmount: 50000,
    currentAmount: 12000,
    category: "Environment",
    deadline: new Date().toDateString(),
  },
  {
    id: "2",
    title: "Education for All",
    description:
      "Providing free education to underprivileged children...roviding free education to underprivileged children...",
    image: assets.sample,
    goalAmount: 30000,
    currentAmount: 15000,
    category: "Education",
    deadline: new Date().toDateString(),
  },
  {
    id: "3",
    title: "Medical Aid for Refugees",
    description:
      "Ensuring medical assistance for displaced communities...roviding free education to underprivileged children...",
    image: assets.sample,
    goalAmount: 40000,
    currentAmount: 18000,
    category: "Health",
    deadline: new Date().toDateString(),
  },
  {
    id: "4",
    title: "Education for All",
    description:
      "Providing free education to underprivileged children...roviding free education to underprivileged children...",
    image: assets.sample,
    goalAmount: 30000,
    currentAmount: 15000,
    category: "Education",
    deadline: new Date().toDateString(),
  },
  {
    id: "5",
    title: "Education for All",
    description:
      "Providing free education to underprivileged children...roviding free education to underprivileged children...",
    image: assets.sample,
    goalAmount: 30000,
    currentAmount: 15000,
    category: "Education",
    deadline: new Date().toDateString(),
  },
  {
    id: "6",
    title: "Education for All",
    description:
      "Providing free education to underprivileged children...roviding free education to underprivileged children...",
    image: assets.sample,
    goalAmount: 30000,
    currentAmount: 15000,
    category: "Education",
    deadline: new Date().toDateString(),
  },
];

const CampaignsSection = memo(() => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await API.get("/campaigns"); // Fetch campaigns from backend

        // Extract and format campaigns
        console.log(response, "this if for");
        const campaignList = response.data
          .filter((campaign) => campaign.isApproved) // Show only approved campaigns
          .map((item) => ({
            id: item._id,
            title: item.title,
            description:
              item.description.length > 100
                ? `${item.description.substring(0, 100)}...`
                : item.description,
            image: item.images?.[0]?.filename
              ? `http://localhost:8080/campaign-uploads/${item.images[0].filename}`
              : assets.campaignPlaceholder,
            goalAmount: item.goalAmount,
            currentAmount: item.currentAmount,
            category: item.category,
            deadline: new Date(item.deadline).toDateString(),
          }));

        console.log("Fetched Campaigns:", campaignList);
        setCampaigns(campaignList.slice(0, 6)); // Show only 6 campaigns
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setCampaigns(fakeCampaigns); // Use fake data if API fails
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <section className="w-full py-16 px-6 bg-gradient-to-r from-indigo-50 to-purple-50">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-500">
          Featured Campaigns
        </h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-52 object-cover"
                onError={(e) => (e.target.src = assets.campaignPlaceholder)}
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  {campaign.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  {campaign.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-indigo-600 font-bold">
                    ${campaign.currentAmount} Raised
                  </span>
                  <Link to={`/campaigns/${campaign.id}`}>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500">
                      Donate
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default CampaignsSection;
