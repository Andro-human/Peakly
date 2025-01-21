"use client";

import { useActiveAccount, useReadContract } from "thirdweb/react";
import { SidebarDemo } from "../../components/Sidebar";
import { contract } from "../client";
import CompaignCard from "../dashboard/CompaignCard";

const Profile = () => {
  const account = useActiveAccount();
  console.log("account", account);
  const caller = account?.address;
  const { data, isPending } = useReadContract({
    contract,
    method:
      "function getAllWagersCreatedByMe(address caller) view returns (uint256[], (address owner, string title, string description, uint256 deadline, uint256 totalAmount, string image, address[] participants, string[] options, uint256 betAmount, string[] availableOptions, bool resolved)[])",
    params: [caller],
  });
  console.log("data", data);
  // Separate the data into two arrays
  const [indices, challenges] = data || [];

  console.log("My Challenges", challenges, indices, isPending);

  return (
    <SidebarDemo>
      <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8 h-[calc(100vh-100px)] overflow-y-auto">
        <div className="py-10">
          <h1 className="text-4xl font-bold mb-4 text-black">Challenges</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isPending ? (
              <p>Loading...</p>
            ) : challenges && challenges.length > 0 ? (
              challenges.map((challenge, idx) => (
                <CompaignCard
                  key={idx}
                  idx={indices[idx]}
                  campaignAddress={challenge.owner}
                  challenge={challenge}
                />
              ))
            ) : (
              <p className="text-xl mt-4 text-black ">
                You haven't created a challenge yet
              </p>
            )}
          </div>
        </div>
      </main>
    </SidebarDemo>
  );
};

export default Profile;
