"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconUserBolt,
  IconWallet,
  IconPlus,
  IconDashboard,
  IconLogout,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "../lib/utils";
import peaklyIcon from "../../public/peakly-logo-final.svg";
import { client } from "../app/client";
import {
  ConnectButton,
  useActiveAccount,
  useDisconnect,
  useActiveWallet,
} from "thirdweb/react";
import { useRouter } from "next/navigation";

export function SidebarDemo({ children }) {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconDashboard className="text-neutral-700 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "My Challenges",
      href: "/my-challenges",
      icon: <IconUserBolt className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Create Challenge",
      href: "/create-wager",
      icon: <IconPlus className="text-neutral-700 h-5 w-5 flex-shrink-0" />,
    },
  ];
  const [open, setOpen] = useState(false);
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const account = useActiveAccount();
  const router = useRouter();
  useEffect(() => {
    if (!account) {
      router.push("/");
    }
  }, [account, router]);

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 w-full flex-1 mx-auto border border-neutral-200 overflow-hidden",
        "h-[100vh] w-[100vw]"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
              <button
                onClick={() => {
                  disconnect(wallet);
                }}
                className="mt-2 flex items-center gap-2 text-sm text-neutral-700 rounded-lg"
              >
                <IconLogout className="h-5 w-5 flex-shrink-0" />
                {open && <span>Logout</span>}
              </button>
            </div>
          </div>
          <div>
            {open ? (
              <ConnectButton client={client} />
            ) : (
              <IconWallet className="text-neutral-700 h-5 w-5 flex-shrink-0" />
            )}
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Render the passed children here */}
      <div className="flex flex-1 overflow-auto sm:overflow-hidden">
        <div className=" rounded-tl-2xl border border-neutral-200 bg-white flex flex-col gap-2 flex-1 w-full h-full overflow-auto">
          {children} {/* Display the passed dashboard component */}
        </div>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image src={peaklyIcon} className="bg-[#09090b]" alt="Avatar" />
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 mt-6"
    >
      <Image src={peaklyIcon} className="bg-[#09090b]" alt="Avatar" />
    </Link>
  );
};
