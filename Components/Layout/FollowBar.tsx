'use client'
import Link from "next/link";
import Avatar from "../Avatar";
import { memo, useEffect, useState } from "react";
import { notifySocket } from "@/libs/socket";
import UserInChat from "../Chat/UserInChat";
const FollowBar = ({ userSession }) => {
  const [followersOnline, setFollowersOnline] = useState([]);
  useEffect(() => {
    notifySocket.on("users", (data) => {
      setFollowersOnline(data)
    })
  }, []);
  return (
    <>
      <div className="hidden h-full px-6 py-4 lg:block fixed right-0 overflow-y-auto">
        <div className="p-4 rounded-xl bg-primary mb-4">
          <h2 className="text-xl font-semibold text-center text-secondary-content">Who to follow</h2>
          <div className="flex flex-col gap-6 mt-4">
            {/* {TODO USER LIST} */}
            <div className="flex flex-row gap-4">
              <Avatar username="Vu142857" avatarURL="" />
              <div className="flex flex-col">
                <Link href='/admin'>@admin</Link>
                <p>Tran Thanh Vu</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-primary">
          <h2 className="text-xl font-semibold pb-2 text-center text-secondary-content">Your follower</h2>
          <div className="flex flex-row gap-4 ">
            <div className="flex flex-col gap-4">
              {followersOnline.map((toUser, index) => {
                return (
                  <div key={index} className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <UserInChat
                        username={toUser.username}
                        hasNewMessages={toUser.hasNewMessages || false}
                        userID={toUser.userID}
                        isOnline={toUser.isOnline || false}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden h-full px-6 py-4 lg:block ">
        <div className="p-4 rounded-xl">
        </div>
      </div>
    </>
  );
}

export default memo(FollowBar);