/* eslint-disable @next/next/no-img-element */
'use client'
import UserInChat from "@/Components/Chat/UserInChat";
import socket from "@/libs/socket";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Message {
  content: string
  from?: string
  to?: string
  fromSelf?: boolean
}
interface User {
  userID: string
  username: string
  connected: boolean
  messages: Message[]
  self?: boolean
  hasNewMessages?: boolean
}

const ChatRoom = ({ params }: { params: { userID: string } }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const initReactiveProperties = (user: User) => {
    user.hasNewMessages = false;
  };

  useEffect(() => {
    if (user) {
      const { id, username } = user;
      socket.auth = { id, username };
    }
    socket.connect();

    socket.on("users", (users) => {
      setUsers(users)
      users.forEach((user: User) => {
        user.messages.forEach((message) => {
          message.fromSelf = message.from === socket.userID;
        });
        for (let i = 0; i < users.length; i++) {
          const existingUser = users[i];
          if (existingUser.userID === user.userID) {
            existingUser.connected = user.connected;
            existingUser.messages = user.messages;
            return;
          }
        }
        user.self = user.userID === socket.userID;
        initReactiveProperties(user);
        users.push(user);
      });
    });

    socket.on("user connected", (user) => {
      for (let i = 0; i < users.length; i++) {
        const existingUser = users[i];
        if (existingUser.userID === user.userID) {
          existingUser.connected = true;
          return;
        }
      }
      initReactiveProperties(user);
      users.push(user);
    });

    socket.on("private message", ({ content, from, to }: Message) => {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const fromSelf = socket.userID === from;
        if (user.userID === (fromSelf ? to : from)) {
          user.messages.push({
            content,
            fromSelf,
          });
          // if (user !== selectedUser) {
          //   user.hasNewMessages = true;
          // }
          break;
        }
      }
    });
    return () => {
      socket.disconnect();
    }
  }, [session, user])

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("message", value);
  }
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-8">
        {/* Page content here */}
        <div className="">
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS chat bubble component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
            <div className="chat-header">
              Obi-Wan Kenobi
              <time className="text-xs opacity-50">12:45</time>
            </div>
            <div className="chat-bubble">You were the Chosen One!</div>
            <div className="chat-footer opacity-50">
              Delivered
            </div>
          </div>
          <div className="chat chat-end">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS chat bubble component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
            <div className="chat-header">
              Anakin
              <time className="text-xs opacity-50">12:46</time>
            </div>
            <div className="chat-bubble">I hate you!</div>
            <div className="chat-footer opacity-50">
              Seen at 12:46
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-wrap">
            <input type="text" onChange={handleValueChange} placeholder="Type here" className="input input-bordered input-secondary w-11/12" />
            <button type="submit" className="btn btn-primary ml-auto ">Send</button>
          </div>
        </form>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <li>
            <Link href='/chat/65bcddd39ff2cb3a8f979e87'>
              <UserInChat
                username='Vux'
                isNewMessage={false}
                userID="65bcddd39ff2cb3a8f979e87"
                isOnline={true}
              />
            </Link>
          </li>
          <li>
            <Link href='/chat/65bcddd39ff2cb3a8f979e88'>
              <UserInChat
                username='Vux'
                isNewMessage={false}
                userID="65bcddd39ff2cb3a8f979e88"
                isOnline={true}
              />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ChatRoom;
