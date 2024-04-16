import FollowBar from "@/Components/Layout/FollowBar";
import Header from "@/Components/Layout/Header";
import Sidebar from "@/Components/Layout/Sidebar";
import { notifySocket } from "@/libs/socket";
import { memo, useEffect, useRef } from "react";
import { Bounce, toast } from "react-toastify";
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
            // Initialize socket if not already initialized
            if (!socketRef.current) {
                socketRef.current = notifySocket;
                socketRef.current.auth = {
                    id: userSession.id,
                    username: userSession.username,
                    accessToken: userSession.accessToken
                };
                socketRef.current.connect();

                socketRef.current.on("message", (data) => {
                    console.log(data);
                });
            }

            // Add event listener for "receive notify" event
            const handleNotify = (data: any) => {
                const { from, action } = data;
                toast(`${from} has ${action} you!`, {
                    position: "top-right",
                    autoClose: 5000,
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

            // Clean up event listener when component unmounts
            return () => {
                if (socketRef.current) {
                    socketRef.current.off("receive notify", handleNotify);
                }
            };
        }
    }, [userSession]);
    return (
        <div className="h-screen relative">
            <div className="container h-full max-w-20xl mx-auto xl:px-30">
                <div className="grid h-full grid-cols-4 relative">
                    <Sidebar userSession={userSession} />
                    <div className="h-full bg-primary col-span-3 lg:col-span-2 border-x-[1px] border-neutral-800 relative">
                        <Header showBackArrow label={labelHeader} />
                        {children}
                    </div>
                    {userSession && <FollowBar userSession={userSession} />}
                </div>
            </div>
        </div>);
}

export default memo(Layout);