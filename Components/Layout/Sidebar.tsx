'use client'
import { BsHouseFill, BsBellFill, BsFillBookmarkFill } from "react-icons/bs";
import { BiLogIn, BiLogOut, BiSolidMessage } from 'react-icons/bi'
import { FaUser } from "react-icons/fa";
import SidebarLogo from "./SidebarLogo";
import SidebarItem from "./SidebarItem";
import SidebarTweetButton from "./SidebarTweetButton";
import { signOut, useSession } from "next-auth/react";
import { memo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import userServices from "@/services/user.services";
import useUserStore from "@/hooks/useMutateUser";

const Sidebar = () => {
  const router = useRouter()
  const { data: session } = useSession();
  const setCurrentUser = useUserStore((state) => state.setUserProfile)
  const currentUser = useUserStore((state) => state.userProfile)
  const user = session?.user;
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (session?.error) {
      setIsLogin(false)
      router.push('/login')
      return
    }
    if (session?.user) {
      setIsLogin(true)
      if (user && !currentUser) {
        const fetchData = async () => {
          return await userServices.getMe(user?.accessToken)
        }
        fetchData().then((res) => {
          setCurrentUser(res?.user)
        }).catch((error) => {
          console.log(error)
        })
      }
    } else {
      setIsLogin(false)
    }
  }, [session])

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
