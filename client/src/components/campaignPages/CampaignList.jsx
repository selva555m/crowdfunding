import React, { useEffect, useState } from "react";
import API from "../../../uitiles/api"; // Import your API instance
import CampaignCard from "./CampaignCard";
import { assets } from "../../assets/assets";
import Loading from "../Loading"; // Import the Loading component

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await API.get("/campaigns"); // Fetch campaigns from backend

        // Format campaigns
        const formattedCampaigns = response.data.map((item) => ({
          id: item._id,
          title: item.title,
          description: item.description,
          image: item.images?.[0]?.path
            ? `http://localhost:8080/campaign-uploads/${item.images[0].filename}`
            : assets.campaignPlaceholder, // Fallback if no image
          raised: item.currentAmount || 0,
        }));

        setCampaigns(formattedCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);

        // Set mock campaigns when backend fails
        setCampaigns([
          {
            id: "fake1",
            title: "Support Education for Kids",
            description:
              "Help underprivileged children get access to education.",
            image: assets.sample,
            raised: 5000,
          },
          {
            id: "fake2",
            title: "Medical Aid for Families",
            description:
              "Providing essential medical assistance to families in need.",
            image: assets.sample,
            raised: 8000,
          },
          {
            id: "fake3",
            title: "Clean Water for Villages",
            description: "Ensuring safe drinking water for remote villages.",
            image: assets.sample,
            raised: 12000,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loading />
      </div>
    );
  }

  return (
    <section className="max-w-6xl w-full mx-auto py-25 px-6">
      <h2 className="text-4xl font-bold text-gray-700 text-center">
        Active Campaigns
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </section>
  );
};

export default CampaignList;
