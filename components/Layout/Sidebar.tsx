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
  const clearSession = useUserStore((state: any) => state.setUserProfile);
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (userSession) {
      setIsLogin(true)
    }
  }, [userSession])

  const handleLogout = useCallback(async () => {
    signOut({ redirect: false })
    await userServices.logout(userSession?.refreshToken, userSession?.accessToken)
    clearSession(null)
    setIsLogin(false)
  }, [userSession])

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
    <div className="w-full" >
      <div className="lg:w-full flex flex-col items-start justify-center gap-2 sticky top-0 px-20">
        <SidebarLogo />
        <>
          {
            items.map((item) => (
              <SidebarItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
            ))
          }
          {isLogin ? (
            <SidebarItem onClick={handleLogout} label="Logout" icon={BiLogOut} />
          ) : (
            <SidebarItem onClick={() => { router.push('/login') }} label="Login" icon={BiLogIn} />
          )
          }
          <SidebarTweetButton isLogin={isLogin} />
        </>
      </div>
    </div>
  );
};

export default memo(Sidebar);
