'use client'
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const ChatRoom = () => {
    const [message, setMessage] = useState("");
    useEffect(() => {
        const socket = io("http://localhost:3000");
        socket.on("connect", () => {
            console.log(socket.id); // x8WIv7-mJelg7on_ALbx
        })
        socket.on("message", (data) => {
            setMessage(data);
        })
    })
    return (
        <div className="min-h-svh flex flex-col justify-center">
            <div className="">
                <div className="chat chat-start">
                    <div className="chat-bubble chat-bubble-secondary">{message}</div>
                </div>
                <div className="chat chat-end">
                    <div className="chat-bubble chat-bubble-primary">Calm down, Anakin.</div>
                </div>
            </div>
            <div className="">
                <input type="text" placeholder="Type here" className="input input-bordered input-primary w-full max-w-xs" />
            </div>
        </div>
    );
}

export default ChatRoom;