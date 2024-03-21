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
import userServices from "@/services/user.services";

const Sidebar = () => {
  const router = useRouter()
  const { data: session } = useSession();
  const user = session?.user;
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (session?.error) {
      setIsLogin(false)
      router.push('/login')
      return
    }
    const fetchData = async () => {
      await userServices.getMe(user?.accessToken)
    }
    fetchData().then(() => {
      setIsLogin(true)
    }).catch((error) => {
      console.error('Error during fetching user data:', error);
      setIsLogin(false)
    })
  }, [user, session])

  const handleLogout = async () => {
    signOut({ redirect: false })
    await userServices.logout(user?.refreshToken, user?.accessToken)
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
    <>
      <div className="h-full col-span-1 pr-4 md:pr-2 bg-primary fixed">
        <div className="flex flex-col items-center">
          <div className="space-y-2 lg:w-[180px]">
            <SidebarLogo />
            {session ? items.map((item) => (
              <SidebarItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
            )) :
              <>
                <SidebarItem onClick={() => { router.push('/login') }} label="Login" icon={BiLogIn} />
              </>
            }
            {session
              &&
              <SidebarItem onClick={handleLogout} label="Logout" icon={BiLogOut} />
              &&
              <SidebarTweetButton isLogin={isLogin} />
            }
          </div>
        </div>
      </div>
      <div className="h-full col-span-1 pr-4 md:pr-2 bg-primary">
        <div className="flex flex-col items-center">
          <div className="space-y-2 lg:w-[180px]">
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
