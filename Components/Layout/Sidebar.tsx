'use client'
import { BsHouseFill, BsBellFill } from "react-icons/bs";
import { BiLogOut } from 'react-icons/bi'
import { FaUser } from "react-icons/fa";
import SidebarLogo from "./SidebarLogo";
import SidebarItem from "./SidebarItem";
import SidebarTweetButton from "./SidebarTweetButton";
import { signOut, useSession } from "next-auth/react";

const Sidebar = () => {
  const { data: session } = useSession();
  console.log('session', session);
  const items = [
    {
      label: "Home",
      href: "/",
      icon: BsHouseFill,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: BsBellFill,
    },
    {
      label: "Profile",
      href: "/me",
      icon: FaUser,
    },
  ];
  return (
    <div className="h-full col-span-1 pr-4 md:pr-2 bg-secondary">
      <div className="flex flex-col items-center">
        <div className="space-y-2 lg:w-[180px]">
          <SidebarLogo />
          {items.map((item) => (
            <SidebarItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ))}
          {session && session.user && <SidebarItem onClick={() => signOut({ redirect: false })} label="Logout" icon={BiLogOut} />}
          <SidebarTweetButton />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
