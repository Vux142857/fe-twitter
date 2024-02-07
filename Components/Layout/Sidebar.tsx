'use client'
import { BsHouseFill, BsBellFill } from "react-icons/bs";
import { BiLogIn, BiLogOut, BiRegistered } from 'react-icons/bi'
import { FaUser } from "react-icons/fa";
import SidebarLogo from "./SidebarLogo";
import SidebarItem from "./SidebarItem";
import SidebarTweetButton from "./SidebarTweetButton";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter()
  const { data: session, status } = useSession();
  console.log(session)
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (status === "authenticated") {
      console.log(status)
      setIsLogin(true)
    }

  }, [status, router])

  const handleLogout = () => {
    signOut({ redirect: false })
    setIsLogin(false)
  }
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
          {isLogin ? items.map((item) => (
            <SidebarItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
          )) :
            <>
              <SidebarItem onClick={() => { router.push('/login') }} label="Login" icon={BiLogIn} />
            </>
          }
          {isLogin && <SidebarItem onClick={handleLogout} label="Logout" icon={BiLogOut} />}
          <SidebarTweetButton isLogin={isLogin} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
