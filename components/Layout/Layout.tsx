import Sidebar from "@/components/Layout/Sidebar";
import { ActionNotify } from "@/constants/dataBody";
import { notifySocket } from "@/libs/socket";
import Link from "next/link";
import { memo, useEffect, useRef } from "react";
import { Bounce, toast } from "react-toastify";
import RightBar from "./RightBar";
interface LayoutProps {
    children: React.ReactNode;
    labelHeader: string;
    userSession?: any;
}
const Layout = ({
    children,
    labelHeader,
    userSession,
}: LayoutProps) => {
    const socketRef = useRef<any>(null);
    useEffect(() => {
        if (userSession) {
            if (!socketRef.current) {
                socketRef.current = notifySocket;
                socketRef.current.auth = {
                    id: userSession.id,
                    username: userSession.username,
                    accessToken: userSession.accessToken
                };
                socketRef.current.connect();
            }
            const handleNotify = (data: any) => {
                const { from, action, link } = data;
                let msg
                if (action == ActionNotify.MESSAGE) {
                    msg = <Link className='text-bold' href={link}><p className="font-bold">{from}</p> has send message to you!</Link>
                } else if (action == ActionNotify.TWEET) {
                    msg = <Link className='text-bold' href={link}><p className="font-bold">{from}</p> has created new tweet!</Link>
                } else if (action == ActionNotify.FOLLOW) {
                    msg = <Link className='text-bold' href={link}><p className="font-bold">{from}</p> has followed you!</Link>
                } else {
                    msg = <Link className='text-bold' href={link}><p className="font-bold">{from}</p> has {action}d your tweet!</Link>
                }
                toast(msg, {
                    position: "top-right",
                    autoClose: 600000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
            };
            socketRef.current.on("receive notify", handleNotify);

            return () => {
                if (socketRef.current) {
                    socketRef.current.off("receive notify", handleNotify);
                }
            };
        }
    }, [userSession]);
    return (
        <div className="h-screen">
            <div className="container h-full w-full mx-auto">
                <div className="grid h-full grid-cols-6 lg:grid-cols-4 relative">
                    <Sidebar userSession={userSession} />
                    <div className="h-full bg-primary col-span-5 lg:col-span-2 border-x-[1px] border-neutral-800 relative">
                        {children}
                    </div>
                    <RightBar />
                </div>
            </div>
        </div>);
}

export default memo(Layout);