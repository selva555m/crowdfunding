import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutIntro from "../components/aboutPages/AboutIntro";
import AboutFeatures from "../components/aboutPages/AboutFeatures";

const About = () => {
  return (
    <div className="bg-gray-100">
      <Navbar />
      <AboutIntro />
      <AboutFeatures />
      <Footer />
    </div>
  );
};

export default About;
