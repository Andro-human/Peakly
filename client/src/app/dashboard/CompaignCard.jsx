"use client";

import React from "react";
import { useRouter } from "next/navigation";

const CompaignCard = ({ idx, campaignAddress, challenge }) => {
  const { title, description, image, betAmount, totalAmount, deadline } =
    challenge;
  const router = useRouter();
  const formattedDeadline = new Date(Number(deadline) * 1000).toLocaleString();

  const handleCardClick = () => {
    // Navigate to the challenge details page
    router.push(`/challenge-details/${idx}`);
  };

  return (
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer flex flex-col"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
      </div>

      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>

        <p className="text-gray-600 text-sm mt-2">{description}</p>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm">
            <span className="font-medium text-gray-700">Bet Amount:</span>{" "}
            <span className="text-gray-800">{betAmount.toString()} ETH</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Total Pool:</span>{" "}
            <span className="text-gray-800">{totalAmount.toString()} ETH</span>
          </div>
        </div>

        <div className="text-sm text-gray-600 mt-2">
          <span className="font-medium text-gray-700">Deadline:</span>{" "}
          {formattedDeadline}
        </div>
      </div>

      <div className="flex-grow" />

      {/* Footer */}
      <div className="bg-gray-100 p-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-auto">
        <span className="text-sm text-gray-600 break-words w-full sm:w-auto">
          Owner: {campaignAddress}
        </span>
      </div>
    </div>
  );
};

export default CompaignCard;
