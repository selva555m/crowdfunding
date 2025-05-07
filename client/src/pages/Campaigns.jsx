import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CampaignList from "../components/campaignPages/CampaignList";

const Campaigns = () => {
  return (
    <div className="bg-gray-100">
      <Navbar />
      <CampaignList />
      <Footer />
    </div>
  );
};

export default Campaigns;
