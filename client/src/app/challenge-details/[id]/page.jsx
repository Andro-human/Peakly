"use client";

import React, { useState } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "../../client";
import { SidebarDemo } from "../../../components/Sidebar";
import Modal from "./modal";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
const ChallengeDetails = ({ params }) => {
  const { id: _id } = params; // Get the ID from the URL
  const { data: details, isPending } = useReadContract({
    contract,
    method:
      "function getWagerDetails(uint256 _id) view returns (uint256 id, address owner, string title, string description, uint256 deadline, uint256 totalAmount, string image, bool resolved, uint256 betAmount, string[] availableOptions)",
    params: [_id],
  });

  const { data: participantsData, isParticipantsPending } = useReadContract({
    contract,
    method:
      "function getParticipants(uint256 _id) view returns (address[], string[])",
    params: [_id],
  });

  const router = useRouter();

  const account = useActiveAccount(); // Get the active account
  const isParticipant = participantsData?.[0]?.includes(account?.address);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-700">Loading details...</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-red-500">
          Failed to fetch details.
        </p>
      </div>
    );
  }
  const [
    id,
    owner,
    title,
    description,
    deadline,
    totalAmount,
    image,
    resolved,
    betAmount,
    availableOptions,
  ] = details;

  const formattedDeadline = new Date(Number(deadline) * 1000).toLocaleString();

  const isOwner = account && account.address === owner; // Check if the connected account is the owner
  return (
    <SidebarDemo>
      <button onClick={() => router.back()}>
        <IconArrowLeft className="text-neutral-700 h-8 w-8 flex-shrink-0 sm:ml-6 sm:mt-6" />
      </button>
      <div className="max-w-3xl mx-auto p-2 sm:p-6 bg-[#f6f6f6] shadow-lg rounded-lg mb-6 border border-gray-200">
        <h1 className="text-lg sm:text-3xl font-bold text-gray-800 mb-4">
          {title}
        </h1>
        <img
          src={image}
          alt={title}
          className="w-72 sm:w-full h-40 sm:h-64 object-cover rounded-lg mb-6"
        />
        <p className="text-wrap text-xs sm:text-sm text-gray-600 mb-4">
          {description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 sm:mb-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Owner:</span>
            <span className="text-xs sm:text-sm font-medium text-gray-800 break-words">
              {owner}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Wager ID:</span>
            <span className="text-xs sm:text-lg font-medium text-gray-800">
              {Number(id)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Deadline:</span>
            <span className="text-xs sm:text-lg font-medium text-gray-800">
              {formattedDeadline}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Bet Amount:</span>
            <span className="text-xs sm:text-lg font-medium text-gray-800">
              {Number(betAmount)} ETH
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Pool:</span>
            <span className="text-xs sm:text-lg font-medium text-gray-800">
              {Number(totalAmount)} ETH
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Resolved:</span>
            <span
              className={`text-xs sm:text-lg font-medium ${
                resolved ? "text-green-500" : "text-red-500"
              }`}
            >
              {resolved ? "Yes" : "No"}
            </span>
          </div>

          <div className="mt-4 sm:col-span-2">
            <h2 className="text-sm sm:text-lg font-semibold text-gray-800 mb-2">
              Available Options:
            </h2>
            <ul className="list-disc list-inside flex space-x-4 text-gray-700 text-xs sm:text-lg">
              {availableOptions.map((option, idx) => (
                <li key={idx} className="sm:mb-1">
                  {option}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            {isOwner && !resolved && (
              <button
                onClick={() => {
                  setModalOpen(true);
                  setModalType("resolve");
                }}
                style={{
                  // marginTop: "1rem",
                  backgroundColor: "#2563EB",
                  color: "white",
                  padding: "1rem",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                }}
              >
                Resolve
              </button>
            )}
            {!isParticipant && !resolved && (
              <button
                onClick={() => {
                  setModalOpen(true);
                  setModalType("participate");
                }}
                style={{
                  // marginTop: "1rem",
                  backgroundColor: "#10B981",
                  color: "white",
                  padding: "1rem",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                }}
              >
                Participate
              </button>
            )}
          </div>
        </div>

        <div>
          {participantsData && participantsData[0].length > 0 && (
            <div className="mt-6">
              <h2 className="text-xs sm:text-lg font-semibold text-gray-800 mb-2">
                Participants:
              </h2>
              <ul className="list-disc list-inside flex flex-col space-y-2 text-gray-700">
                {participantsData[0].map((participant, idx) => (
                  <li key={idx} className="mb-1">
                    <span className="text-sm sm:text-lg text-gray-800">
                      Address:
                    </span>{" "}
                    <span className="text-xs sm:text-lg">{participant}</span>
                    <br className="sm:hidden" />
                    <span className="text-sm sm:text-lg text-gray-800 ml-2">
                      Option:
                    </span>{" "}
                    <span className="text-xs sm:text-lg">
                      {participantsData[1][idx]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        modalType={modalType}
        onClose={() => setModalOpen(false)}
        options={availableOptions}
        betAmount={betAmount}
        id={_id}
      />
    </SidebarDemo>
  );
};

export default ChallengeDetails;
