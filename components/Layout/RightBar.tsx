'use client'
import { useRouter } from "next/navigation";
import SidebarItem from "./SidebarItem";
import { BsBellFill } from "react-icons/bs";

const RightBar = () => {
    const router = useRouter();
    return (
        <>
            <div className="h-2/4 w-96 lg:block col-span-1 fixed right-0 hidden ">
                <div className="flex flex-col items-center border-dotted border-2 border-base-300 h-full">
                </div>
                <div className="space-y-2 lg:w-[180px]">
                    <SidebarItem onClick={() => { router.push('/notifications') }} label="Notifications" icon={BsBellFill} />
                </div>
            </div>
            <div className="h-full col-span-1">
            </div>
        </>
    );
}

export default RightBar;