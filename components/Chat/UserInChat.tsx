'use client'
import { useParams } from "next/navigation"
import Avatar from "../Avatar"
import { memo } from "react"

interface UserInChatProps {
    username: string
    userID: string
    isOnline: boolean
}

const UserInChat: React.FC<UserInChatProps> = ({ username, userID, isOnline }) => {
    const status = isOnline ? 'online' : 'offline'
    const pathname = useParams()
    const isSelected = pathname.userID === userID ? 'rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2' : ''
    return (
        <div className="flex flex-wrap flex-row">
            <div className={`avatar ${status} ${isSelected} hidden lg:block`}>
                <Avatar
                    avatarURL=""
                    username={username}
                />
            </div>
            <div className="p-2 border-b-black">
                <p className="text-sm lg:text-base">{username}</p>
            </div>
        </div>
    );
}

export default memo(UserInChat);