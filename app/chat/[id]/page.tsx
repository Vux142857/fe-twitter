/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import UserInChat from "@/Components/Chat/UserInChat";
import socket from "@/libs/socket";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  connected?: boolean
  messages: Message[]
  self?: boolean
  hasNewMessages?: boolean
}

const ChatRoom = ({ params }: { params: { userID: string } }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const [value, setValue] = useState("");
  const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const selectedUser: User = {
    userID: params.userID as string,
    messages: [],
    username: ""
  }
  const initReactiveProperties = (user: User) => {
    user.hasNewMessages = false;
  };

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID") || undefined;
    if (user && !sessionID) {
      console.log(123)
      const { id, username } = user;
      socket.auth = { id, username };
      socket.connect();
    } else if (user && sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    }

    socket.on("session", ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
      console.log(sessionID, userID)
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        console.log("Invalid username");
      }
    });

    socket.on("users", (users) => {
      setUsersInRoom(users)
      console.log(usersInRoom)
      // users.forEach((user: User) => {
      //   user.messages.forEach((message) => {
      //     message.fromSelf = message.from === socket.userID;
      //   });
      //   for (let i = 0; i < users.length; i++) {
      //     const existingUser = users[i];
      //     if (existingUser.userID === user.userID) {
      //       existingUser.connected = user.connected;
      //       existingUser.messages = user.messages;
      //       return;
      //     }
      //   }
      //   user.self = user.userID === socket.userID;
      //   initReactiveProperties(user);
      //   usersInRoom.push(user);
      //   console.log(usersInRoom)
      // });
    });

    // socket.on("private message", ({ content, from, to }: Message) => {
    //   for (let i = 0; i < usersInRoom.length; i++) {
    //     const user = usersInRoom[i];
    //     const fromSelf = socket.userID === from;
    //     if (user.userID === (fromSelf ? to : from)) {
    //       user.messages.push({
    //         content,
    //         fromSelf,
    //       });
    //       if (user.userID !== selectedUser.userID) {
    //         user.hasNewMessages = true;
    //       }
    //       break;
    //     }
    //   }
    // });
    return () => {
      socket.disconnect();
    }
  }, [session])

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("private message", {
      content: value,
      to: selectedUser.userID,
    });
    selectedUser.messages.push({
      content: value,
      fromSelf: true,
    });
  }
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-8 relative">
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
        <form
          onSubmit={handleSubmit}
          className="absolute bottom-40 w-11/12">
          <input type="text" onChange={handleValueChange} placeholder="Type here" className="input input-bordered input-secondary w-11/12" />
          <button type="submit" className="btn btn-primary ml-5">Send</button>
        </form>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          {usersInRoom.map((userInRoom, index) => (
            (userInRoom.userID !== user?.id && <li key={index}>
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
