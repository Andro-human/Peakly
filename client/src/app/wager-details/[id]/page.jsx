"use client";

import { useParams } from "next/navigation";

export default function WagerDetails() {
  const { id } = useParams(); // Access the dynamic route parameter

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Wager Details</h1>
      <p>You're viewing details for wager ID: {id}</p>
    </div>
  );
}