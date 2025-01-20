"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "../lib/utils";
import peaklyIcon from "../../public/peakly-logo-final.svg"
import { client } from "../app/client";
import { ConnectButton } from "thirdweb/react";
// import { useConnectionStatus } from "@thirdweb-dev/react";
// import { useRouter } from "next/router";

export function SidebarDemo({ children }) {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "/logout",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);

  // const connectionStatus = useConnectionStatus(); // Check if the user is connected
  // const router = useRouter();

  // useEffect(() => {
  //   if (!connectionStatus) {
  //     // Redirect to homepage if not connected
  //     router.push("/");
  //   }
  // }, [connectionStatus, router]);

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
            </div>
          </div>
          <div>
            <ConnectButton client={client} />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Render the passed children here */}
      <div className="flex flex-1">
        <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
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
      <Image
        src={peaklyIcon}
        className="bg-[#09090b]"
        alt="Avatar"
      />
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 mt-6"
    >
       <Image
        src={peaklyIcon}
        className="bg-[#09090b]"
        alt="Avatar"
      />
    </Link>
  );
};
