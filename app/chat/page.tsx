'use client'
import socket from "@/libs/socket";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
const ChatRoom = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const [value, setValue] = useState("");
    const [message, setMessage] = useState("");
    useEffect(() => {
        socket.on("connect", () => {
        })
        if (user) {
            console.log(user);
            const { id, username } = user;
            socket.auth = { id, username };
        }
        socket.on("message", (data) => {
            setMessage(data);
        })
        return () => {
            socket.disconnect();
        }
    })
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setValue(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        socket.emit("message", value);
    }
    return (
        <div className="min-h-svh flex flex-col justify-center">
            <div className="">
                <div className="chat chat-start">
                    <div className="chat-bubble chat-bubble-secondary">{message}</div>
                </div>
                <div className="chat chat-end">
                    <div className="chat-bubble chat-bubble-primary">{value}</div>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="">
                    <input type="text" onChange={handleValueChange} placeholder="Type here" className="input input-bordered input-primary w-full max-w-xs" />
                </div>
                <button type="submit" className="btn btn-primary w-full max-w-xs">Send</button>
            </form>
        </div>
    );
}

export default ChatRoom;