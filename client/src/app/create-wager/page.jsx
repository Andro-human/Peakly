"use client";

import React, { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";
import { SidebarDemo } from "../../components/Sidebar";
import { checkIfImage } from "../../utils/index";
import { useRouter } from "next/router";
const SignupFormDemo = () => {
  // const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // const { createCampaign } = useStateContext();
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    amount: "",
    image: "",
    option: "",
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
    console.log("form", form);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        // await createCampaign({
        //   ...form,
        //   target: ethers.utils.parseUnits(form.target, 18),
        // });
        setIsLoading(false);
        console.log("here", form);
        // router.push("/dashboard");
      } else {
        alert("Provide valid image URL");
        setForm({ ...form, image: "" });
      }
    });
  };

  return (
    <SidebarDemo>
      <div className="max-w-2xl md-w-4xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-12 shadow-input bg-black">
        <h1 className="font-bold text-xl text-neutral-200">Create Challenge</h1>
        <p className="text-sm max-w-sm mt-2 text-neutral-300">
          Create a Decentralized Challenge where you friends can participate.
        </p>
        <form className="my-8" onSubmit={handleSubmit}>
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
          <LabelInputContainer className="mb-4">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="This Challenge is based on the ongoing US elections"
              rows="4"
              cols="50"
              className="rounded-lg px-3 py-2 text-black"
              onChange={(e) => handleFormFieldChange("description", e)}
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

          <LabelInputContainer className="mb-4">
            <Label htmlFor="options">Options (separate by commas)</Label>
            <Input
              id="options"
              placeholder="Donald Trump, Kamala Harris"
              type="text"
              onChange={(e) => handleFormFieldChange("option", e)}
              required
            />
          </LabelInputContainer>
          <button
            className="bg-gradient-to-br relative group/btn to-neutral-600 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Submit new Challenge &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          {/* <div className="flex flex-col space-y-4">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit">
            <IconBrandGithub className="h-4 w-4 text-neutral-300" />
            <span className="text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit">
            <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
            <span className="text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit">
            <IconBrandOnlyfans className="h-4 w-4 text-neutral-800 text-neutral-300" />
            <span className="text-neutral-700 text-neutral-300 text-sm">
              OnlyFans
            </span>
            <BottomGradient />
          </button>
        </div> */}
        </form>
      </div>
    </SidebarDemo>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
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
