"use client";

import { useState } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { SidebarDemo } from "../../components/Sidebar";
import { contract } from "../client";
import CompaignCard from "../dashboard/CompaignCard";

const Profile = () => {
  const account = useActiveAccount();
  const caller = account?.address;

  // fetch created challenges
  const { data, isPending } = useReadContract({
    contract,
    method:
      "function getAllWagersCreatedByMe(address caller) view returns (uint256[], (address owner, string title, string description, uint256 deadline, uint256 totalAmount, string image, address[] participants, string[] options, uint256 betAmount, string[] availableOptions, bool resolved)[])",
    params: [caller],
  });

  const [indices, createdChallenges] = data || [];
  const unresolvedCreated = [];
  const unresolvedCreatedIndices = [];
  const resolvedCreated = [];
  const resolvedCreatedIndices = [];

  createdChallenges?.forEach((challenge, idx) => {
    if (challenge.resolved) {
      resolvedCreated.push(challenge);
      resolvedCreatedIndices.push(indices[idx]);
    } else {
      unresolvedCreated.push(challenge);
      unresolvedCreatedIndices.push(indices[idx]);
    }
  });

  // Fetch participated challenges
  const { data: participatedData, isPending: isPendingParticipated } =
    useReadContract({
      contract,
      method:
        "function getAllWagersExceptOwn(address caller) view returns (uint256[], (address owner, string title, string description, uint256 deadline, uint256 totalAmount, string image, address[] participants, string[] options, uint256 betAmount, string[] availableOptions, bool resolved)[], bool[])",
      params: [account?.address],
    });

  const [participatedIndices, participatedChallenges, hasParticipated] =
    participatedData || [];

  // const unresolvedParticipated =
  //   participatedChallenges?.filter(
  //     (c, idx) => hasParticipated[idx] && !c.resolved
  //   ) || [];
  // const resolvedParticipated =
  //   participatedChallenges?.filter(
  //     (c, idx) => hasParticipated[idx] && c.resolved
  //   ) || [];
  const unresolvedParticipated = [];
  const unresolvedParticipatedIndices = [];
  const resolvedParticipated = [];
  const resolvedParticipatedIndices = [];

  participatedChallenges?.forEach((challenge, idx) => {
    if (hasParticipated[idx]) {
      if (challenge.resolved) {
        resolvedParticipated.push(challenge);
        resolvedParticipatedIndices.push(participatedIndices[idx]);
      } else {
        unresolvedParticipated.push(challenge);
        unresolvedParticipatedIndices.push(participatedIndices[idx]);
      }
    }
  });

  // State for tabs
  const [activeTab, setActiveTab] = useState("participated");
  const [subTab, setSubTab] = useState("unresolved");

  return (
    <SidebarDemo>
      <main className=" max-w-7xl px-4 mt-4 sm:px-6 lg:px-8 h-[100vh] overflow-y-auto">
        <h1 className="text-4xl font-bold mb-4 text-black"> My Challenges</h1>

        {/* Primary Tabs (Participated / Created) */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 text-lg font-medium ${
              activeTab === "participated"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("participated")}
          >
            Participated Challenges
          </button>
          <button
            className={`px-4 py-2 text-lg font-medium ${
              activeTab === "created"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("created")}
          >
            Created Challenges
          </button>
        </div>

        {/* Secondary Tabs (Unresolved / Resolved) */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 text-lg font-medium ${
              subTab === "unresolved"
                ? "border-b-2 border-green-500 text-green-600"
                : "text-gray-500"
            }`}
            onClick={() => setSubTab("unresolved")}
          >
            Open
          </button>
          <button
            className={`px-4 py-2 text-lg font-medium ${
              subTab === "resolved"
                ? "border-b-2 border-green-500 text-green-600"
                : "text-gray-500"
            }`}
            onClick={() => setSubTab("resolved")}
          >
            Closed
          </button>
        </div>

        {/* Display Challenges Based on Selected Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isPending || isPendingParticipated ? (
            <p>Loading...</p>
          ) : activeTab === "participated" ? (
            subTab === "unresolved" ? (
              unresolvedParticipated.length > 0 ? (
                unresolvedParticipated.map((challenge, idx) => (
                  <CompaignCard
                    key={idx}
                    idx={unresolvedParticipatedIndices[idx]}
                    campaignAddress={challenge.owner}
                    challenge={challenge}
                  />
                ))
              ) : (
                <p className="text-xl mt-4 text-black">
                  No unresolved participated challenges
                </p>
              )
            ) : resolvedParticipated.length > 0 ? (
              resolvedParticipated.map((challenge, idx) => (
                <CompaignCard
                  key={idx}
                  idx={resolvedParticipatedIndices[idx]}
                  campaignAddress={challenge.owner}
                  challenge={challenge}
                />
              ))
            ) : (
              <p className="text-xl mt-4 text-black">
                No resolved participated challenges
              </p>
            )
          ) : subTab === "unresolved" ? (
            unresolvedCreated.length > 0 ? (
              unresolvedCreated.map((challenge, idx) => (
                <CompaignCard
                  key={idx}
                  idx={unresolvedCreatedIndices[idx]}
                  campaignAddress={challenge.owner}
                  challenge={challenge}
                />
              ))
            ) : (
              <p className="text-xl mt-4 text-black">
                No unresolved created challenges
              </p>
            )
          ) : resolvedCreated.length > 0 ? (
            resolvedCreated.map((challenge, idx) => (
              <CompaignCard
                key={idx}
                idx={resolvedCreatedIndices[idx]}
                campaignAddress={challenge.owner}
                challenge={challenge}
              />
            ))
          ) : (
            <p className="text-xl mt-4 text-black">
              No resolved created challenges
            </p>
          )}
        </div>
      </main>
    </SidebarDemo>
  );
};

export default Profile;
