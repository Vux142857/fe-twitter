/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import LayoutChat, { User } from "@/Components/Chat/Layout";
import socket from "@/libs/socket";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Message } from "../page";
import { useSearchParams } from 'next/navigation'
import MessageElement from "@/Components/Chat/MessageElement";
import conversationServices from "@/services/conversation.service";

const ChatRoom = ({ params }: { params: { conversationID: string } }) => {
  const searchParams = useSearchParams()
  const { data: session } = useSession();
  const [value, setValue] = useState("");
  const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const toUser = searchParams.get('to')
  const user = session?.user;
  const [selectedUser, setSelectedUser] = useState<User>({
    conversation: params.conversationID,
    userID: toUser,
    username: "",
    avatar: ""
  });

  useEffect(() => {
    const fetchData = async () => await conversationServices.getConversation(params.conversationID, user?.accessToken)
    fetchData()
      .then((res) => {
        console.log('res', res)
        const { sender, receiver } = res?.result
        console.log('sender', sender)
        console.log('receiver', receiver)
        if (sender?._id.toString() === user?.id) {
          setSelectedUser({
            conversation: params.conversationID,
            userID: receiver._id.toString(),
            username: receiver.username,
            avatar: receiver.avatar
          })
        } else {
          setSelectedUser({
            conversation: params.conversationID,
            userID: sender._id.toString(),
            username: sender.username,
            avatar: sender.avatar
          })
        }
      })
      .catch((error) => {
        console.error('Error during fetching conversation data:', error);
      })
    socket.auth = { id: user?.id, username: user?.username, accessToken: user?.accessToken };
    socket.connect();

    socket.on("users", (users) => {
      const arrayOfUsers: User[] = Object.values(users);
      setUsersInRoom(arrayOfUsers)
    });

    return () => {
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    socket.on("receive message", (message) => {
      console.log(message)
      if (message.from !== user?.id) {
        setMessages((prev) => [...prev, { to: message.to, from: message.from, content: message.content, fromSelf: false }]);
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
    setMessages((prev) => [...prev, { to: message.to, from: message.from, content: message.content, fromSelf: true }]);
    setValue("");
  }

  return (
    <LayoutChat conversations={usersInRoom}>
      <div className="flex-1 justify-between flex flex-col h-screen">
        <div
          className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200"
        >
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <span className="absolute text-green-500 right-0 bottom-0">
                <svg width="20" height="20">
                  <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                </svg>
              </span>
              <img
                src={selectedUser.avatar}
                alt={selectedUser.username}
                className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <div className="text-2xl mt-1 flex items-center">
                <span className="text-gray-700 mr-3">{selectedUser.username}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          {messages.map((message, index) => (
            <MessageElement content={message.content} fromSelf={message.fromSelf} key={index} />
          ))}
        </div>
        <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <div className="relative flex">
            <input
              type="text"
              onChange={handleValueChange} value={value}
              placeholder="Write your message!"
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
            />
            <form className="absolute right-0 items-center inset-y-0 hidden sm:flex" onSubmit={handleSubmit}>
              <button
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                type="submit"
              >
                <span className="font-bold">Send</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-6 w-6 ml-2 transform rotate-90"
                >
                  <path
                    d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
                  ></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </LayoutChat>
  )
}

export default ChatRoom;
