"use client";

import React, { useState } from "react";
import { SidebarDemo } from "../../components/Sidebar";
import { contract } from "../client";
import CompaignCard from "./CompaignCard";
import { useActiveAccount, useReadContract } from "thirdweb/react";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("open"); // "open" or "ended"
  const account = useActiveAccount();

  const { data, isPending } = useReadContract({
    contract,
    method:
      "function getAllWagersExceptOwn(address caller) view returns (uint256[], (address owner, string title, string description, uint256 deadline, uint256 totalAmount, string image, address[] participants, string[] options, uint256 betAmount, string[] availableOptions, bool resolved)[], bool[])",
    params: [account?.address],
  });

  // Separate the response into two arrays
  const [indices, challenges, hasParticipated] = data || [];

  // Maintain the original ordering while separating challenges
  const unresolvedChallenges = [];
  const resolvedChallenges = [];
  const unresolvedIndices = [];
  const resolvedIndices = [];

  if (challenges) {
    challenges.forEach((challenge, idx) => {
      if (!hasParticipated[idx]) {
        if (challenge.resolved) {
          resolvedChallenges.push(challenge);
          resolvedIndices.push(indices[idx]);
        } else {
          unresolvedChallenges.push(challenge);
          unresolvedIndices.push(indices[idx]);
        }
      }
    });
  }

  return (
    <SidebarDemo>
      <main className="max-w-7xl px-4 mt-4 sm:px-6 lg:px-8 h-[100vh] overflow-y-auto">
        <div className="py-10">
          <h1 className="text-4xl font-bold mb-4 text-black">Challenges</h1>

          {/* Tab Navigation */}
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 text-lg font-medium ${
                selectedTab === "open"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setSelectedTab("open")}
            >
              Open
            </button>
            <button
              className={`px-4 py-2 text-lg font-medium ${
                selectedTab === "ended"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setSelectedTab("ended")}
            >
              Closed
            </button>
          </div>

          {/* Challenges based on selected tab */}
          {selectedTab === "open" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isPending ? (
                <p>Loading...</p>
              ) : unresolvedChallenges.length > 0 ? (
                unresolvedChallenges.map((challenge, idx) => (
                  <CompaignCard
                    key={unresolvedIndices[idx]}
                    idx={unresolvedIndices[idx]}
                    campaignAddress={challenge.owner}
                    challenge={challenge}
                  />
                ))
              ) : (
                <p className="text-xl mt-4 text-black">No Open Challenges</p>
              )}
            </div>
          )}

          {selectedTab === "ended" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isPending ? (
                <p>Loading...</p>
              ) : resolvedChallenges.length > 0 ? (
                resolvedChallenges.map((challenge, idx) => (
                  <CompaignCard
                    key={resolvedIndices[idx]}
                    idx={resolvedIndices[idx]}
                    campaignAddress={challenge.owner}
                    challenge={challenge}
                  />
                ))
              ) : (
                <p className="text-xl mt-4 text-black">No Ended Challenges</p>
              )}
            </div>
          )}
        </div>
      </main>
    </SidebarDemo>
  );
};

export default Dashboard;
