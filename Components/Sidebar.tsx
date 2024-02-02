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
      href: "/user",
      icon: FaUser,
    },
  ];
  return (
    <div className="h-full col-span-1 pr-4 md:pr-6">
      <div className="flex flex-col items-end">
        <div className="space-y-2 lg:w-[230px]">
          <SidebarLogo />
          {items.map((item) => (
            <SidebarItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ))}
          {/* {session && session.user && session.user.id && <SidebarItem onClick={() => signOut({ redirect: false })} label="Logout" icon={BiLogOut} />} */}
          <SidebarTweetButton />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
