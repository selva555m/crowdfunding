import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../../uitiles/api";
import Navbar from "../Navbar";
import Footer from "../Footer";
import DonateForm from "./DonateForm";
import Loading from "../Loading";
import { assets } from "../../assets/assets";

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCampaign = async () => {
    try {
      const response = await API.get(`/campaigns/${id}`);
      const data = response.data;

      const formattedCampaign = {
        id: data._id,
        title: data.title,
        description: data.description,
        image: data.images?.[0]?.path
          ? `http://localhost:8080/campaign-uploads/${data.images[0].filename}`
          : assets.campaignPlaceholder,
        raised: data.currentAmount,
        goal: data.goalAmount,
        organizer: data.organizer || "Unknown Organizer",
      };

      setCampaign(formattedCampaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      setCampaign(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  return (
    <div className="bg-gradient-to-r from-indigo-100 to-purple-100 min-h-screen py-30">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg min-h-[50vh] flex items-center justify-center">
        {loading ? (
          <Loading />
        ) : campaign ? (
          <div className="w-full">
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-80 object-cover rounded-lg"
              onError={(e) => (e.target.src = assets.campaignPlaceholder)}
            />
            <h2 className="text-3xl font-bold text-gray-800 mt-6">
              {campaign.title}
            </h2>
            <p className="text-gray-600 text-lg mt-4">{campaign.description}</p>
            <p className="text-gray-700 font-semibold mt-4">
              Organizer:{" "}
              <span className="font-normal">{campaign.organizer}</span>
            </p>

            {/* Progress Bar */}
            <div className="mt-4">
              <p className="text-gray-700 font-semibold">
                Funds Raised:{" "}
                <span className="font-normal">
                  ₹{campaign.raised} / ₹{campaign.goal}
                </span>
              </p>
              <div className="w-full bg-gray-300 rounded-full h-4 mt-2">
                <div
                  className="bg-indigo-500 h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${(campaign.raised / campaign.goal) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Donate Form with update function */}
            <DonateForm
              campaignId={campaign.id}
              updateCampaign={fetchCampaign}
            />
          </div>
        ) : (
          <p className="text-center text-red-500">Campaign Not Found</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CampaignDetails;
