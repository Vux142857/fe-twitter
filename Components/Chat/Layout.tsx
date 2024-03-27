'user client'
import { Message } from "@/app/chat/page"
import UserInChat from "./UserInChat"
import Link from "next/link"
import { memo } from "react"

export interface User {
    conversation: string
    userID: string
    username: string
    isOnline?: boolean
    messages?: Message[]
    self?: boolean
    hasNewMessages?: boolean
    socketID?: string
    avatar?: string
}

interface LayoutChatProps {
    conversations: User[]
    children: React.ReactNode
}

const LayoutChat: React.FC<LayoutChatProps> = ({ children, conversations }) => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content relative">
                {/* Page content here */}
                {children}
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                    {/* Sidebar content here */}
                    {conversations.map((toUser, index) => (
                        <li key={index}>
                            <Link href={`/chat/${toUser.conversation}`}>
                                <UserInChat
                                    username={toUser.username}
                                    hasNewMessages={toUser.hasNewMessages || false}
                                    userID={toUser.userID}
                                    isOnline={toUser.isOnline || false}
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default memo(LayoutChat);