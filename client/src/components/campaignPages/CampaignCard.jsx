import React, { memo } from "react";
import { Link } from "react-router-dom";

const CampaignCard = memo(
  ({ campaign }) => {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
        <img
          src={campaign.image || "/assets/placeholder.jpg"} // Fallback image
          alt={campaign.title}
          className="w-full h-52 object-cover"
          onError={(e) => (e.target.src = "/assets/placeholder.jpg")} // Handle broken images
        />
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-800">
            {campaign.title}
          </h3>
          <p className="text-gray-600 text-sm mt-2 flex-grow">
            {campaign.description}
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-indigo-600 font-bold">
              ${campaign.raised} Raised
            </span>
            <Link to={`/campaigns/${campaign.id}`}>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500">
                Donate
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.campaign.raised === nextProps.campaign.raised; // Re-render only if amount changes
  }
);

export default CampaignCard;
