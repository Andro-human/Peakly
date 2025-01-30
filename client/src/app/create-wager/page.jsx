"use client";

import React, { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";
import { SidebarDemo } from "../../components/Sidebar";
import { prepareContractCall, sendTransaction } from "thirdweb";
import { contract } from "../client";
import { TransactionButton } from "thirdweb/react";
const SignupFormDemo = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    amount: "",
    image: "",
    option: "",
    yourOption: "",
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const _availableOptions = form.option
    .split(",")
    .map((option) => option.trim())
    .filter((option) => option.length > 0);

  return (
    <SidebarDemo>
      {" "}
      {/* <div className="bg-[#252422] w-[100wh] h-[100vh] flex items-center justify-center border-2 border-red-700"> */}
      <div className="md-w-4xl w-full rounded-none md:rounded-2xl p-2 md:px-12 md:py-8 shadow-input bg-[#2b2a2a] max-w-6xl mx-auto overflow-hidden">
        <h1 className="font-bold text-4xl text-neutral-200">
          Create Challenge{" "}
        </h1>
        <p className="text-md max-w-sm m-2 text-neutral-300">
          Create a Decentralized Challenge where you friends can participate.
        </p>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Who will win the US elections?"
                type="text"
                onChange={(e) => handleFormFieldChange("title", e)}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-8">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                placeholder="https://picsum.photos/200"
                type="twitterpassword"
                onChange={(e) => handleFormFieldChange("image", e)}
                required
              />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="This Challenge is based on the ongoing US elections"
              rows="4"
              cols="50"
              className="rounded-lg px-3 py-2 text-black max-w-[61rem]"
              onChange={(e) => handleFormFieldChange("description", e)}
              required
            />
          </LabelInputContainer>
          <div className="flex space-x-4">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="amount">Amount (in dollars)</Label>
              <Input
                id="amount"
                placeholder="5$"
                type="number"
                onChange={(e) => handleFormFieldChange("amount", e)}
                required
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="deadline">Deadline (in days)</Label>
              <Input
                id="deadline"
                placeholder="5"
                type="number"
                onChange={(e) => handleFormFieldChange("deadline", e)}
                required
              />
            </LabelInputContainer>
          </div>

          <div className="flex space-x-4">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="options">All Options (separate by commas)</Label>
              <Input
                id="options"
                placeholder="Donald Trump, Kamala Harris"
                type="text"
                onChange={(e) => handleFormFieldChange("option", e)}
                required
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="yourOption">Your Option</Label>
              <select
                className="rounded-lg px-3 py-2 text-black max-w-md h-10"
                onChange={(e) => handleFormFieldChange("yourOption", e)}
                required
              >
                {_availableOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
                {!_availableOptions.length && (
                  <option value="No options available">
                    No options available
                  </option>
                )}
              </select>
            </LabelInputContainer>
          </div>

          <TransactionButton
            transaction={() =>
              prepareContractCall({
                contract,
                method:
                  "function createWager(string _title, string _description, uint256 _deadline, string _image, uint256 _betAmount, string[] _availableOptions, string _ownerOption) payable returns (uint256)",
                params: [
                  form.title,
                  form.description,
                  form.deadline,
                  form.image,
                  form.amount,
                  _availableOptions,
                  form.yourOption,
                ],
                value: form.amount,
              })
            }
            onError={(error) => alert(`Error: ${error.message}`)}
            onTransactionConfirmed={async () =>
              alert("Participated successfully!")
            }
            style={{
              marginTop: "1rem",
              backgroundColor: "#2563EB",
              color: "white",
              padding: "1rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
          >
            Participate
          </TransactionButton>
        </form>
      </div>
      {/* </div> */}
    </SidebarDemo>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default SignupFormDemo;
