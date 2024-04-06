'use client'
import { useSession } from "next-auth/react";
import { memo, useEffect, useState } from "react";
import Layout from "@/Components/Layout/Layout";
import Link from "next/link";
import Button from "@/Components/Button";

const MyProfile = () => {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState("");
    const [userSession, setUser] = useState(session?.user || null);
    useEffect(() => {
        if (session?.error) {
            return
        }
        if (session?.user) {
            setUser(session?.user)
        }
    }, [session, userSession])
    //
    const search = async () => {
        try {
            // Gọi API tìm kiếm dựa trên searchQuery
            // Ví dụ: const response = await fetch(`/api/search?query=${searchQuery}`);
            // const data = await response.json();
            // setSearchResults(data);
            console.log("Searching for:", searchQuery);
        } catch (error) {
            console.error("Error searching:", error);
        }
    }
    // Hàm xử lý khi người dùng ấn nút Search
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        search();
    }
    // Hàm xử lý sự kiện khi người dùng nhập vào input
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    }
    return (
        <Layout labelHeader={"Search"} userSession={userSession}>
            <form onSubmit={handleSearchSubmit}>
                <label className="input input-bordered flex items-center gap-2">
                    <input type="text" className="grow" placeholder="Search" value={searchQuery} onChange={handleSearchChange} />
                    <Button label="Search" onClick={handleSearchSubmit} />
                </label>
            </form>
            <div role="tablist" className="tabs tabs-lifted tabs-lg w-full p-4">
                <Link href="/search?type=tweet" role="tab" className="tab">Tweet</Link>
                <Link href="/search?type=video" role="tab" className="tab">Video</Link>
                <Link href="/search?type=image" role="tab" className="tab">Image</Link>
                <Link href="/search?type=user" role="tab" className="tab">User</Link>
            </div>
        </Layout>
    );
}

export default memo(MyProfile);
