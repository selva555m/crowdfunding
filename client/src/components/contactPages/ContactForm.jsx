import React, { useState } from "react";
import axios from "axios";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage(""); // Reset response message

    try {
      const response = await axios.post(
        "http://localhost:8080/v1/contact",
        formData
      );
      setResponseMessage(response.data.message);
      setFormData({ name: "", email: "", message: "" }); // Clear form after submission
    } catch (error) {
      setResponseMessage("Failed to send message. Please try again.");
    }
  };

  return (
    <section className="w-full flex flex-col items-center justify-center py-12 px-6 bg-gradient-to-r from-indigo-100 to-purple-100">
      <h2 className="text-3xl font-bold text-gray-700 text-center">
        Send Us a Message
      </h2>
      <form
        className="w-full max-w-lg mt-6 bg-gray-50 p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Message
          </label>
          <textarea
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-500 transition-all duration-300"
        >
          Send Message
        </button>
        {responseMessage && (
          <p className="mt-4 text-center text-green-600 font-semibold">
            {responseMessage}
          </p>
        )}
      </form>
    </section>
  );
};

export default ContactForm;
