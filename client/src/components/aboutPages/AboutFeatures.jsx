import React from "react";
import {
  FaUsers,
  FaShieldAlt,
  FaChartLine,
  FaHandshake,
  FaDollarSign,
  FaHeadset,
} from "react-icons/fa";

const features = [
  {
    id: 1,
    icon: <FaUsers className="text-indigo-600 text-3xl" />,
    title: "Community-Driven Platform",
    description:
      "We connect creators with backers to bring ideas to life through collective support.",
  },
  {
    id: 2,
    icon: <FaShieldAlt className="text-green-600 text-3xl" />,
    title: "Secure & Transparent",
    description:
      "Our platform ensures security and transparency, fostering trust among users.",
  },
  {
    id: 3,
    icon: <FaChartLine className="text-red-600 text-3xl" />,
    title: "Success-Oriented Tools",
    description:
      "We provide expert resources and strategies to help campaigns reach their full potential.",
  },
  {
    id: 4,
    icon: <FaHandshake className="text-purple-600 text-3xl" />,
    title: "Global Networking",
    description:
      "Access a worldwide network of supporters who share your vision for innovation.",
  },
  {
    id: 5,
    icon: <FaDollarSign className="text-yellow-600 text-3xl" />,
    title: "Low Fees & High Returns",
    description:
      "We maintain fair pricing to ensure creators retain the majority of their funding.",
  },
  {
    id: 6,
    icon: <FaHeadset className="text-teal-600 text-3xl" />,
    title: "24/7 Customer Support",
    description:
      "Our dedicated support team is always ready to assist you in your fundraising journey.",
  },
];

const AboutFeatures = () => {
  return (
    <section className="w-full py-12 px-6 bg-linear-to-r from-indigo-100 to-purple-100">
      <h2 className="font-bold text-3xl text-center text-gray-800">
        Why Choose Us?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-gray-100 p-6 rounded-lg shadow-md text-center"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="font-semibold text-lg text-gray-800">
              {feature.title}
            </h3>
            <p className="text-gray-600 mt-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutFeatures;
