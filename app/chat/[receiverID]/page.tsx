/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import UserInChat from "@/Components/Chat/UserInChat";
import socket from "@/libs/socket";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Message {
  content: string
  fromSelf: boolean
}
interface User {
  userID: string
  username: string
  connected?: boolean
  messages?: Message[]
  self?: boolean
  hasNewMessages?: boolean
  socketID?: string
}

const ChatRoom = ({ params }: { params: { receiverID: string } }) => {
  const { data: session } = useSession();
  const [value, setValue] = useState("");
  const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const user = session?.user;
  const selectedUser: User = {
    userID: params.receiverID,
    messages: [],
    username: ""
  }

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

  useEffect(() => {
    socket.on("receive message", (message) => {
      console.log(message)
      if (message.from !== user?.id) {
        setMessages((prev) => [...prev, { content: message.content, fromSelf: false }]);
      }
    });
  }, [])

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = {
      from: user?.id,
      content: value,
      to: selectedUser.userID,
    }
    socket.emit("private message", message);
    setMessages((prev) => [...prev, { content: value, fromSelf: true }]);
    console.log(messages)
    setValue("");
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-8 relative">
        {/* Page content here */}
        <div className="h-full">
          {messages.map((message, index) => (
            <div className={'chat ' + (message.fromSelf ? 'chat-end' : 'chat-start')} key={crypto.randomUUID()}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img alt="Tailwind CSS chat bubble component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
              </div>
              {/* <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
      </div> */}
              <div className="chat-bubble">{message.content}</div>
              <div className="chat-footer opacity-50">
                Seen at 12:46
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          className="absolute bottom-40 w-11/12">
          <input type="text" onChange={handleValueChange} value={value} placeholder="Type here" className="input input-bordered input-secondary w-11/12" autoFocus />
          <button type="submit" className="btn btn-primary ml-5">Send</button>
        </form>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          {usersInRoom.map((userInRoom, index) => (
            (userInRoom.userID !== session?.user?.id && <li key={index}>
              <Link href={`/chat/${userInRoom.userID}`}>
                <UserInChat
                  username={userInRoom.username}
                  hasNewMessages={userInRoom.hasNewMessages || false}
                  userID={userInRoom.userID}
                  isOnline={userInRoom.connected || false}
                />
              </Link>
            </li>)
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChatRoom;
