import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { contract } from "../../client";

const Modal = ({ isOpen, onClose, modalType, options, betAmount, id }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const { mutate: sendTransaction } = useSendTransaction();

  // console.log("betAmount", betAmount);
  // console.log("id", id);
  const onResolveClick = async () => {
    // const winningOptionFromPrompt = prompt("Please select a winning option");
    // if (!winningOptionFromPrompt) {
    //   alert("Please select a winning option.");
    //   return;
    // }

    // try {
    const transaction = prepareContractCall({
      contract,
      method: "function resolveWager(uint256 _id, string winningOption)",
      params: [id, selectedOption],
    });

    sendTransaction(transaction, {
      onError: (error) => alert(`Error: ${error.message}`),
      onTransactionConfirmed: () => {
        alert("Successfully Participated!");
        onClose();
      },
    });
    // console.log("transaction", transaction);
    // } catch (error) {
    //   console.error("Error resolving wager:", error);
    // }
  };

  const onParticipateClick = async () => {
    // try {
    const transaction = prepareContractCall({
      contract,
      method:
        "function participateToWager(uint256 _id, string _option) payable",
      params: [id, selectedOption],
      value: betAmount,
    });
    sendTransaction(transaction, {
      onError: (error) => alert(`Error: ${error.message}`),
      onTransactionConfirmed: () => {
        alert("Successfully Participated!");
        onClose();
      },
    });
    // } catch (error) {
    //   Alert("Error resolving wager:", error);
    // }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg text-black font-bold mb-4">Select an Option</h2>
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="w-full p-2 border rounded-lg text-black"
        >
          <option value="">Choose an option</option>
          {options.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => {
              if (modalType === "resolve") {
                onResolveClick();
              } else {
                onParticipateClick();
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            disabled={!selectedOption}
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
