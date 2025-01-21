"use client";

import Image from "next/image";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "./client";
import peaklyIcon from "../../public/peakly-logo-final.svg";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const account = useActiveAccount();
  const router = useRouter();
  useEffect(() => {
    if (account) {
      // Redirect to the dashboard if already connected
      router.push("/dashboard");
    }
  }, [account, router]);

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <Header />

        <div className="flex justify-center mb-20">
          <ConnectButton client={client} />
        </div>
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <Image
        src={peaklyIcon}
        alt=""
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />

      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        Challenge.
        <span className="text-zinc-300 inline-block mx-1"> Wager. </span>
        <span className="inline-block -skew-x-6 text-blue-500"> Win. </span>
      </h1>

      <h2 className="text-1xl md:text-2xl mb-6 text-center">
        Decentralized platform that allows users to participate in, create, and
        wager on any real-world topic.
      </h2>

      <p className="text-zinc-300 text-base">
        Please login
        <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">
          to continue
        </code>{" "}
      </p>
    </header>
  );
}
