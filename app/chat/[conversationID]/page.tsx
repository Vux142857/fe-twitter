'use client'
import LayoutChat, { User } from "@/Components/Chat/LayoutChat";
import socket, { notifySocket } from "@/libs/socket";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Message } from "../page";
import { useRouter } from 'next/navigation'
import MessageElement from "@/Components/Chat/MessageElement";
import conversationServices from "@/services/conversation.service";
import Avatar from "@/Components/Avatar";
import useMessages from "@/hooks/useGetMessages";
import { NotificationConstructor, useSendNotify } from "@/hooks/useNotify";
import { ActionNotify } from "@/constants/dataBody";

const ChatRoom = ({ params }: { params: { conversationID: string } }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
  const [data, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>({
    conversation: params.conversationID,
    userID: "",
    username: "",
    avatar: "",
    isOnline: false
  });
  const [pageNumber, setPageNumber] = useState(1)
  const [notify, setNotify] = useState<NotificationConstructor | null>(null);

  const user = useRef(session?.user);
  useEffect(() => {
    user.current = session?.user;
  }, [session]);
  const { messages, hasMore } = useMessages(pageNumber, params.conversationID, user.current?.accessToken)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await conversationServices.getConversation(params.conversationID, session?.user.accessToken);
        if (!res?.result) {
          router.push('/chat');
          return;
        }
        const { sender, receiver } = res.result;
        const selectedUser = sender?._id.toString() === session?.user.id
          ? { conversation: params.conversationID, userID: receiver._id.toString(), username: receiver.username, avatar: receiver.avatar }
          : { conversation: params.conversationID, userID: sender._id.toString(), username: sender.username, avatar: sender.avatar };
        setSelectedUser(selectedUser);
      } catch (error) {
        console.error('Error during fetching conversation data:', error);
        router.push('/');
      }
    };
    fetchData();
  }, [session]);

  useEffect(() => {
    if (messages.length > 0) {
      setMessages(messages.map((message) => ({ to: message.to, from: message.from, content: message.content, fromSelf: message.from === user.current?.id })));
    }
  }, [pageNumber, messages]);

  useEffect(() => {
    const isOnline = usersInRoom.find((user) => user.userID === selectedUser.userID)?.isOnline;
    setSelectedUser({ ...selectedUser, isOnline });
  }, [usersInRoom])

  useEffect(() => {
    if (notify && !selectedUser.isOnline) {
      useSendNotify(notify);
      setNotify(null);
    }
  }, [notify, selectedUser]);

  useEffect(() => {
    notifySocket.on('inRoom', (data) => {
      console.log('receive notify', data)
    })
  }, [])

  useEffect(() => {
    socket.auth = { id: user.current?.id, username: user.current?.username, accessToken: user.current?.accessToken };
    socket.connect();
    socket.on("users", (users) => {
      const arrayOfUsers: User[] = Object.values(users);
      setUsersInRoom(arrayOfUsers)
    });
    socket.on("receive message", (message) => {
      if (message.from !== user.current?.id) {
        setMessages((prev) => [...prev, { to: message.to, from: message.from, content: message.content, fromSelf: false }]);
      }
    });
    return () => {
      socket.disconnect();
    }
  }, []);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
  }

  const handleLoadMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPageNumber(pageNumber + 1);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value === "") return;
    const message = {
      from: user.current?.id,
      content: value,
      to: selectedUser.userID,
      conversation_id: params.conversationID
    }
    socket.emit("private message", message);
    setMessages((prev) => [...prev, { to: message.to, from: message.from, content: message.content, fromSelf: true }]);
    setNotify({
      from: user.current?.username,
      to: selectedUser.userID,
      link: `/chat/${params.conversationID}`,
      action: ActionNotify.MESSAGE
    })
    setValue("");
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };
  return (
    <LayoutChat conversations={usersInRoom}>
      <div className="flex-1 justify-between flex flex-col h-screen">
        <div
          className="flex sm:items-center justify-between py-3 px-3 border-b-2 border-gray-200"
        >
          <div className="flex flex-wrap gap-4">
            <div className="avatar">
              <Avatar
                avatarURL={selectedUser?.avatar}
                username={selectedUser?.username}
              />
            </div>
            <div className="m-auto border-b-black">
              <p className="text-primary-content text-xl">{selectedUser?.username}</p>
            </div>
          </div>
        </div>
        <div
          className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          {hasMore && (<button className="btn btn-block" onClick={handleLoadMore}>Load more</button>)}
          {data.map((message, index) => (
            <MessageElement content={message.content} fromSelf={message.fromSelf} key={index} />
          ))}
        </div>
        <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <div className="relative flex">
            <input
              type="text"
              onChange={handleValueChange} value={value}
              autoFocus
              onKeyDown={handleKeyDown}
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
