import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactInfo from "../components/contactPages/ContactInfo";
import ContactForm from "../components/contactPages/ContactForm"; // Optional

const Contact = () => {
  return (
    <div className="bg-gray-100">
      <Navbar />
      <ContactInfo />
      <ContactForm /> {/* Remove this if you don't need a contact form */}
      <Footer />
    </div>
  );
};

export default Contact;
