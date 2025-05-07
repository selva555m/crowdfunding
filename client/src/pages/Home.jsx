import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/homePages/HeroSection";
import CampaignsSection from "../components/homePages/CampaignsSection";
import TestimonialsSection from "../components/homePages/TestimonialsSection";
import CallToAction from "../components/homePages/CallToAction";
import Vision from "../components/homePages/Vision";

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden bg-gray-100">
      <Navbar />
      <HeroSection />
      <CampaignsSection />
      <TestimonialsSection />
      <Vision />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
