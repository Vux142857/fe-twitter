/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import LayoutChat, { User } from "@/Components/Chat/Layout";
import UserInChat from "@/Components/Chat/UserInChat";
import socket from "@/libs/socket";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface Message {
    from: string
    to: string
    content: string
    fromSelf?: boolean
}

const ChatRoom = () => {
    const { data: session } = useSession();
    const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
    const user = session?.user;

    useEffect(() => {
        socket.auth = { id: user?.id, username: user?.username, accessToken: user?.accessToken };
        socket.connect();

        socket.on("users", (users) => {
            const arrayOfUsers: User[] = Object.values(users);
            setUsersInRoom(arrayOfUsers)
        });

        return () => {
            socket.disconnect();
        }
    }, [user]);

    return (
        <LayoutChat conversations={usersInRoom}>
            {/* Page content here */}
            <div className="h-full">
                <h1>Hello</h1>
            </div>
        </LayoutChat>
    );
}

export default ChatRoom;
