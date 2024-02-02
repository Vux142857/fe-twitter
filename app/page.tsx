import Image from "next/image";
import FollowBar from "@/Components/FollowBar";
import Header from "@/Components/Header";
import Sidebar from "@/Components/Sidebar";
export default function Home({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-primary">
      <div className="container h-full max-w-20xl mx-auto xl:px-30">
        <Header showBackArrow label="Home" />
        <div className="grid h-full grid-cols-4">
          <Sidebar />
          <div className="col-span-3 lg:col-span-2 border-x-[1px] border-neutral-800">
            {children}
          </div>
          <FollowBar />
        </div>
      </div>
    </div>
  );
}
