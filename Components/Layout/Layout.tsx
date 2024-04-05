import FollowBar from "@/Components/Layout/FollowBar";
import Header from "@/Components/Layout/Header";
import Sidebar from "@/Components/Layout/Sidebar";
import { memo } from "react";
import { Toaster } from "react-hot-toast"

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
    return (
        <div className="h-screen relative">
            <div className="container h-full max-w-20xl mx-auto xl:px-30">
                <div className="grid h-full grid-cols-4 relative">
                    <Toaster />
                    <Sidebar userSession={userSession} />
                    <div className="h-full bg-primary col-span-3 lg:col-span-2 border-x-[1px] border-neutral-800 relative">
                        <Header showBackArrow label={labelHeader} />
                        {children}
                    </div>
                    <FollowBar />
                </div>
            </div>
        </div>);
}

export default memo(Layout);