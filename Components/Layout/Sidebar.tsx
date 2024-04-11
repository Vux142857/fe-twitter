'use client'
import { BsHouseFill, BsBellFill, BsFillBookmarkFill, BsSearch } from "react-icons/bs";
import { BiLogIn, BiLogOut, BiSolidMessage } from 'react-icons/bi'
import { FaUser } from "react-icons/fa";
import SidebarLogo from "./SidebarLogo";
import SidebarItem from "./SidebarItem";
import SidebarTweetButton from "./SidebarTweetButton";
import { signOut } from "next-auth/react";
import { memo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import userServices from "@/services/user.services";
import useUserStore from "@/hooks/useMutateUser";
interface SidebarProps {
  userSession?: any;
}
const Sidebar: React.FC<SidebarProps> = ({ userSession }) => {
  const router = useRouter()
  const clearSession = useUserStore((state: any) => state.clearUserProfile)
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (userSession) {
      setIsLogin(true)
    }
  }, [userSession])

  const handleLogout = useCallback(async () => {
    signOut({ redirect: false })
    await userServices.logout(userSession?.refreshToken, userSession?.accessToken)
    clearSession()
    setIsLogin(false)
  }, [userSession])
  const items = [
    {
      label: "Home",
      href: "/",
      icon: BsHouseFill,
    },
    // {
    //   label: "Notifications",
    //   href: "/notifications",
    //   icon: BsBellFill,
    // },
    {
      label: "Search",
      href: "/search",
      icon: BsSearch
    }
    ,
    {
      label: "Bookmarks",
      href: "/bookmark",
      icon: BsFillBookmarkFill,
    },
    {
      label: "Messages",
      href: "/chat",
      icon: BiSolidMessage,
    },
    {
      label: "Profile",
      href: "/me",
      icon: FaUser,
    },
  ];
  return (
    <>
      <div className="h-full col-span-1 pr-4 md:pr-2 fixed">
        <div className="flex flex-col items-center">
          <div className="space-y-2 lg:w-[180px]">
            <SidebarLogo />
            {isLogin ? (
              <>
                {
                  items.map((item) => (
                    <SidebarItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
                  ))
                }
                <>
                  <SidebarItem onClick={handleLogout} label="Logout" icon={BiLogOut} />
                  <SidebarTweetButton isLogin={isLogin} />
                </>
              </>
            ) :
              <>
                <SidebarItem onClick={() => { router.push('/login') }} label="Login" icon={BiLogIn} />
              </>
            }
          </div>
        </div>
      </div>
      <div className="h-full col-span-1 pr-4 md:pr-2">
        <div className="flex flex-col items-center">
          <div className="space-y-2 lg:w-[180px]">
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Sidebar);
