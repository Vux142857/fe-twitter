import Link from "next/link";
import Avatar from "../Avatar";
const FollowBar = () => {
    return (
        <>
            <div className="hidden h-full px-6 py-4 lg:block  fixed right-0">
                <div className="p-4 rounded-xl bg-primary">
                    <h2 className="text-xl font-semibold text-center text-secondary-content">Who to follow</h2>
                    <div className="flex flex-col gap-6 mt-4">
                        {/* {TODO USER LIST} */}
                        <div className="flex flex-row gap-4">
                            <Avatar username="Vu142857" avatarURL="" />
                            <div className="flex flex-col">
                                <Link href='/vu'>@Vu142857</Link>
                                <p>Tran Thanh Vu</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden h-full px-6 py-4 lg:block ">
                <div className="p-4 rounded-xl">
                </div>
            </div>
        </>
    );
}

export default FollowBar;