'user client'
import { Message } from "@/app/chat/page"
import UserInChat from "./UserInChat"
import Link from "next/link"
import { memo } from "react"
import SidebarItem from "../Layout/SidebarItem"
import { BsHouseFill } from "react-icons/bs"

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
        <div className="h-screen relative">
            <div className="container h-full max-w-20xl mx-auto xl:px-30">
                <div className="grid h-full grid-cols-5 lg:grid-cols-4 relative">
                    <div className="h-full col-span-1">
                        <ul className="min-h-full text-base-content">
                            {/* Sidebar content here */}
                            <SidebarItem href={"/"} label={"Home"} icon={BsHouseFill} />
                            {conversations.map((toUser, index) => (
                                <li key={index} className="hover:bg-secondary mb-4 text-primary-content hover:text-secondary-content">
                                    <Link href={`/chat/${toUser.conversation}`}>
                                        <UserInChat
                                            username={toUser.username}
                                            userID={toUser.userID}
                                            isOnline={toUser.isOnline || false}
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="h-full bg-primary col-span-4 lg:col-span-3 border-x-[1px] border-neutral-800">
                        {/* Page content here */}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(LayoutChat);