"use client";

import { useContext, createContext } from "react";
// import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
const StateContext = createContext();

const contractAddress = process.env.NEXT_PUBLIC_TEMPLATE_CONTRACT_ADDRESS;
export const StateContextProvider = ({ children }) => {
  const contract = getContract({
    client: client,
    chain: baseSepolia,
    address: CROWDFUNDING_FACTORY,
  });

  const { mutateAsync: createWager } = useContractWrite(
    contract,
    "createWager"
  );

  // const account = useActiveAccount();

  const publishWager = async (form) => {
    try {
      const data = await createWager([
        address, // owner
        form.title, // title
        form.description,
        new Date(form.deadline).getTime(),
        form.amount,
        form.image,
        form.options,
      ]);

      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  return (
    <StateContext.Provider value={{ address, contract, publishWager }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
