'use client'
import { useParams, usePathname } from "next/navigation"
import Avatar from "../Avatar"
import { memo } from "react"

/* eslint-disable @next/next/no-img-element */
interface UserInChatProps {
    hasNewMessages: boolean
    username: string
    userID: string
    isOnline: boolean
}

const UserInChat: React.FC<UserInChatProps> = ({ hasNewMessages, username, userID, isOnline }) => {
    const status = isOnline ? 'online' : 'offline'
    const pathname = useParams()
    const isSelected = pathname.userID === userID ? 'rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2' : ''
    return (
        <div className="flex flex-wrap gap-8">
            <div className={`avatar ${status} ${isSelected}`}>
                <Avatar
                    avatarURL=""
                    username={username}
                />
            </div>
            <div className="m-auto border-b-black">
                <p className="text-primary-content text-xl">{username}</p>
                {hasNewMessages && <label className="label label-text">New message!</label>}
            </div>
        </div>
    );
}

export default memo(UserInChat);