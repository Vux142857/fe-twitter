import FollowBar from "@/Components/Layout/FollowBar";
import Header from "@/Components/Layout/Header";
import Sidebar from "@/Components/Layout/Sidebar";

interface LayoutProps {
    children: React.ReactNode;
    labelHeader: string
}
const Layout = ({
    children,
    labelHeader
}: LayoutProps) => {
    return (
        <div className="h-screen bg-primary">
            <div className="container h-full max-w-20xl mx-auto xl:px-30">
                <Header showBackArrow label={labelHeader} />
                <div className="grid h-full grid-cols-4">
                    <Sidebar />
                    <div className="col-span-3 lg:col-span-2 border-x-[1px] border-neutral-800">
                        {children}
                    </div>
                    <FollowBar />
                </div>
            </div>
        </div>);
}

export default Layout;