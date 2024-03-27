import FollowBar from "@/Components/Layout/FollowBar";
import Header from "@/Components/Layout/Header";
import Sidebar from "@/Components/Layout/Sidebar";
import { memo } from "react";

interface LayoutProps {
    children: React.ReactNode;
    labelHeader: string
}
const Layout = ({
    children,
    labelHeader
}: LayoutProps) => {
    return (
        <div className="h-screen relative">
            <div className="container h-full max-w-20xl mx-auto xl:px-30">
                <div className="grid h-full grid-cols-4 relative">
                    <Sidebar />
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