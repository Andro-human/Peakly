"use client";

import React, { useState } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "../../client";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { SidebarDemo } from "../../../components/Sidebar";

const ChallengeDetails = ({ params }) => {
  const { id: _id } = params; // Get the ID from the URL
  const { mutate: sendTransaction } = useSendTransaction();
  const { data: details, isPending } = useReadContract({
    contract,
    method:
      "function getWagerDetails(uint256 _id) view returns (uint256 id, address owner, string title, string description, uint256 deadline, uint256 totalAmount, string image, bool resolved, uint256 betAmount, string[] availableOptions)",
    params: [_id],
  });

  const account = useActiveAccount(); // Get the active account

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

  const onResolveClick = async (e) => {
    e.preventDefault();
    const winningOptionFromPrompt = prompt("Please select a winning option");
    if (!winningOptionFromPrompt) {
      alert("Please select a winning option.");
      return;
    }

    // try {
    const transaction = await prepareContractCall({
      contract,
      method: "function resolveWager(uint256 _id, string winningOption)",
      params: [id, winningOptionFromPrompt],
    });

    sendTransaction(transaction, {
      onError: (error) => alert(`Error: ${error.message}`),
      onTransactionConfirmed: () => {
        alert("Successfully Participated!");
      },
    });
    // console.log("transaction", transaction);
    // } catch (error) {
    //   console.error("Error resolving wager:", error);
    // }
  };

  const onParticipateClick = async (e) => {
    e.preventDefault();
    const userOption = prompt("Please select an option");
    if (!userOption) {
      alert("Please select an option.");
      return;
    }

    // try {
    const transaction = prepareContractCall({
      contract,
      method:
        "function participateToWager(uint256 _id, string _option) payable",
      params: [_id, userOption],
      value: betAmount,
    });
    sendTransaction(transaction, {
      onError: (error) => alert(`Error: ${error.message}`),
      onTransactionConfirmed: () => {
        alert("Successfully Participated!");
      },
    });
    // } catch (error) {
    //   Alert("Error resolving wager:", error);
    // }
  };

  const formattedDeadline = new Date(Number(deadline) * 1000).toLocaleString();

  const isOwner = account && account.address === owner; // Check if the connected account is the owner

  return (
    <SidebarDemo>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <p className="text-gray-600 mb-4">{description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Owner:</span>
            <span className="text-lg font-medium text-gray-800 break-words">
              {owner}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Wager ID:</span>
            <span className="text-lg font-medium text-gray-800">
              {Number(id)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Deadline:</span>
            <span className="text-lg font-medium text-gray-800">
              {formattedDeadline}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Bet Amount:</span>
            <span className="text-lg font-medium text-gray-800">
              {Number(betAmount)} ETH
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Pool:</span>
            <span className="text-lg font-medium text-gray-800">
              {Number(totalAmount)} ETH
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Resolved:</span>
            <span
              className={`text-lg font-medium ${
                resolved ? "text-green-500" : "text-red-500"
              }`}
            >
              {resolved ? "Yes" : "No"}
            </span>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Available Options:
            </h2>
            <ul className="list-disc list-inside text-gray-700">
              {availableOptions.map((option, idx) => (
                <li key={idx} className="mb-1">
                  {option}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            {isOwner ? (
              <button
                onClick={onResolveClick}
                style={{
                  marginTop: "1rem",
                  backgroundColor: "#2563EB",
                  color: "white",
                  padding: "1rem",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                }}
              >
                Resolve
              </button>
            ) : (
              <button
                onClick={onParticipateClick}
                style={{
                  marginTop: "1rem",
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
      </div>
    </SidebarDemo>
  );
};

export default ChallengeDetails;
